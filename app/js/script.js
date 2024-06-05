const DATES = 'https://api.cosmicjs.com/v3/buckets/ti-project-production/objects?pretty=true&query=%7B%22type%22:%22dates%22%7D&limit=10&read_key=gTRqDyjPMRAkcbCzQ0lkN6QowrCuKEnikL45ugW1p1hSee3a2s&depth=1&props=slug,title,metadata,id,'
const bucketSlug = 'ti-project-production';
const bucketWriteKey = 'KnBNxwoQCtYMjdPbcQPvebL7aB9njRIoj4wtJzWcnKhNtorqt8';
const client = mqtt.connect('ws://test.mosquitto.org:8080/mqtt');
const topic = 'sensor/toy1';
const topic2 = 'sensor/toy2';
let c, d, id;
let currDate;
import fetchApi from "./components/fetch.js";


// functions
function updateDate(objectId, date, newCounter){

    const url = `https://api.cosmicjs.com/v3/buckets/${bucketSlug}/objects/${objectId}`;

    const data = {
        metadata: {
            date: date,
            counter: newCounter
        }
    };

    fetch(url, {
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bucketWriteKey}`
    },
    body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
    console.log('Success:', data);
    })
    .catch((error) => {
    console.error('Error:', error);
    });
}

//@xana fiz o import em cima :))
/*async function fetchApi(apiUrl) {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`error loading search results: ${response.status}`)
        }
        const data = await response.json()
        console.log(`fetch: ${data}`);
        return data.objects;
    } catch (error) {
        console.error('Fetching error:', error);
        throw error;
    }
}*/

function getCounter(date) {
    console.log(date);
    return date.metadata.counter;
}

function getDates(date) {
    return date.metadata.date;
}

function getId(date){
    return date.id;
}

function getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

async function dateExists(currDate) {
    // console.log("***");
    let dates = await fetchApi(DATES);
    let exists = false;
    if (dates) {
        dates.forEach(date => {
            // console.log(date.title);
            if (date.title == currDate) {
                exists = true;
            }
        });
    }
    console.log(exists);
    return exists;
}

function createDate(date) {
    const url = `https://api.cosmicjs.com/v3/buckets/${bucketSlug}/objects`;

    const data = {
        title: date,
        type: "dates",
        metadata: {
            date: date,
            counter: 0
        }
    };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${bucketWriteKey}`
        },
        body: JSON.stringify(data)
    };

    fetch(url, options)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
}

function teste(){
    (async () => {
        try {
            let datesData = await fetchApi(DATES);
            
            datesData.forEach(date => {
                if (date.title == currDate) {
                    client.publish('sensor/toy2', '1');
                    updateDate(getId(date), getDates(date), getCounter(date) + 1);
                }
            });
            
        } catch (error) {
            console.error('Fetching error:', error);
            throw error;
        }
    })();
}

function main() {
    // connect to MQTT

    // get current date
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth() + 1; 
    const currentYear = currentDate.getFullYear();

    currDate = `${currentDay}-${currentMonth}-${currentYear}`;
    let exists;
    
    client.on('connect', () => {
        console.log('Connected to broker');
        client.subscribe(topic, (err) => {
            if (!err) {
                console.log(`Subscribed to topic: ${topic}`);
            }
        });
    
        client.subscribe(topic2, (err) => {
            if (!err) {
                console.log(`Subscribed to topic: ${topic2}`);
            }
        });
        
        (async () => {
            try {
                console.log("antes da função");
                exists = await dateExists(currDate)
                console.log(exists);
                if (!exists) {
                    createDate(currDate);
                    console.log("Created new date successfully");
                }
            } catch (error) {
                console.error('Date error:', error);
                throw error;
            }
        })();
        
    });
    
    // mqtt message listener
    client.on('message', (topic, message) => {
        const msg = message.toString();
        console.log(`Received message on ${topic}: ${msg}`);
    
        const messagesDiv = document.getElementById('messages');
        const newMessage = document.createElement('div');
        newMessage.textContent = `Topic: ${topic}, Message: ${msg}`;
        messagesDiv.appendChild(newMessage);

        (async () => {
            try {
                let datesData = await fetchApi(DATES);
                
                datesData.forEach(date => {
                    if (date.title == currDate) {
                        updateDate(getId(date), getDates(date), getCounter(date) + 1);
                    }
                });
                
            } catch (error) {
                console.error('Fetching error:', error);
                throw error;
            }
        })();
    
    });


    // test
    document.querySelector(".btn").addEventListener("click", teste);
}

//export {DATES};
//export {fetchApi, DATES};
main();


 