////// https://www.cosmicjs.com/docs/api/objects#update-object-metadata COM BASE NISTO
 
const bucketSlug = 'ti-project-production'; // replace with your actual bucket slug
const objectId = '665a1988b6cce150ff0989a2'; // replace with your actual object ID
const bucketWriteKey = 'KnBNxwoQCtYMjdPbcQPvebL7aB9njRIoj4wtJzWcnKhNtorqt8'; // replace with your actual bucket write key

const url = `https://api.cosmicjs.com/v3/buckets/${bucketSlug}/objects/${objectId}`;
const data = {
    metadata: {
        day: 5,
        counter: 11
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


//let tags = {}
let daysData, audioData

const DAYS = 'https://api.cosmicjs.com/v3/buckets/ti-project-production/objects?pretty=true&query=%7B%22type%22:%22numeros%22%7D&limit=10&read_key=gTRqDyjPMRAkcbCzQ0lkN6QowrCuKEnikL45ugW1p1hSee3a2s&depth=1&props=slug,title,metadata,id,'

async function fetchApi(apiUrl) {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`error loading search results: ${response.status}`)
        }
        const data = await response.json()
        return data.objects;
    } catch (error) {
        console.error('Fetching error:', error);
        throw error;
    }
}

function displayDays(data) {
    console.log(data);

    let counter = data[0].metadata.counter;
    console.log(counter);
}

const client = mqtt.connect('ws://test.mosquitto.org:8080/mqtt');

const topic = 'sensor/toy1';
const topic2 = 'sensor/toy2';

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
});

client.on('message', (topic, message) => {
    const msg = message.toString();
    console.log(`Received message on ${topic}: ${msg}`);

    const messagesDiv = document.getElementById('messages');
    const newMessage = document.createElement('div');
    newMessage.textContent = `Topic: ${topic}, Message: ${msg}`;
    messagesDiv.appendChild(newMessage);

    //faz update da cena
     //faz fetch da cena
  (async () => {
    try {
        daysData = await fetchApi(DAYS);
        displayDays(daysData);
    } catch (error) {
        console.error('Fetching error:', error);
        throw error;
    }
})();

    //updateCo();
});


 