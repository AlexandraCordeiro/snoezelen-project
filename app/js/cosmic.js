let tags = {}
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
    let container = document.querySelector("#cosmic");
    //console.log(data);
    //console.log(data[0]);

    let counter = data[0].metadata.counter;
    console.log(counter);
    
    /*data.forEach(days => {
        for (let i = 0; i <  days.length; i++) {
           console.log(days[0]);
        }
    });*/

}


(async () => {
    try {
        daysData = await fetchApi(DAYS)
        displayDays(daysData);
    } catch (error) {
        console.error('Fetching error:', error);
        throw error;
    }
})();