let tags = {}
let themesData, audioData
let palettes = {}
let openMenu = false

const THEMES_URL = 'https://api.cosmicjs.com/v3/buckets/ti-project-production/objects?pretty=true&query=%7B%22type%22:%22themes%22%7D&limit=10&read_key=gTRqDyjPMRAkcbCzQ0lkN6QowrCuKEnikL45ugW1p1hSee3a2s&depth=1&props=slug,title,metadata,id,'
const AUDIO_URL = 'https://api.cosmicjs.com/v3/buckets/ti-project-production/objects?pretty=true&query=%7B%22type%22:%22audio%22%7D&limit=10&read_key=gTRqDyjPMRAkcbCzQ0lkN6QowrCuKEnikL45ugW1p1hSee3a2s&depth=1&props=slug,title,metadata,id,'

import fetchApi from "./components/fetch.js";
/*async function fetchApi(apiUrl) {
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
}*/


function displayThemes(data) {
    let container = document.querySelector(".btn");
    //console.log(container);

    data.forEach(theme => {
        console.log(theme);
            
        const div = document.createElement('div')
        div.classList.add(theme.slug);
        div.classList.add("col-m-3", "col-t-6","col-d-3", "chos");
        container.appendChild(div);

        let element = document.createElement('a');
        element.classList.add("box-row");
        element.classList.add("choose");
        element.href=`theme.html?id=${theme.id}`

        div.appendChild(element);

        let icone = document.createElement('div');
        icone.classList.add("icone");
        icone.innerHTML=theme.metadata.icone;

        let title = document.createElement('div');
        title.classList.add("title");
        title.innerHTML=theme.metadata.name;

        element.appendChild(title);
        element.appendChild(icone);


        /*const img = document.createElement('img')
        const hyperlink = document.createElement('a')
        const container = document.createElement('div')
        container.classList.add('info-container')
        hyperlink.href = `artifact.html?id=${project.id}`
        img.src = project.metadata.image.url
        img.setAttribute('id', project.id)
        img.classList.add('prevent-select')

        let title, author
        title = project.metadata.name
        author = project.metadata.author_name
        if (title == null) title = "Untitled"
        if (author == null) author = "Anonymous"

        container.innerHTML = `${title}<br><b>${author}</b>`
        container.classList.add('prevent-select')
        hyperlink.appendChild(img)
        div.appendChild(hyperlink)
        div.appendChild(container)
        imagesContainer.appendChild(div)*/


        /*<a href="theme.html" class="box-row choose">
                            <div class="icone">🐬</div>
                            <div class="title">Água</div>
                        </a>

        /*let div2 = document.createElement('div');
        div2.classList.add("col-d-2");
        div2.classList.add("chos");
        container.appendChild(div2);*/
    });

}


(async () => {
    try {
        themesData = await fetchApi(THEMES_URL)
        audioData = await fetchApi(AUDIO_URL)
        displayThemes(themesData);
    } catch (error) {
        console.error('Fetching error:', error);
        throw error;
    }
})();