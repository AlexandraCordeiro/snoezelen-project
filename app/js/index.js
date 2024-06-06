//TI, Snoezelen Project
//Página de js, relativa à construção da página de index

let themesData;
const THEMES_URL = 'https://api.cosmicjs.com/v3/buckets/ti-project-production/objects?pretty=true&query=%7B%22type%22:%22themes%22%7D&limit=10&read_key=gTRqDyjPMRAkcbCzQ0lkN6QowrCuKEnikL45ugW1p1hSee3a2s&depth=1&props=slug,title,metadata,id,'

//faz o import da função fetchApi
import fetchApi from "./components/fetch.js";

//função que apresenta os botões para os diferentes temas
function displayThemes(data) {
    let container = document.querySelector(".btn");

    data.forEach(theme => {
        console.log(theme);
            
        const div = document.createElement('div')
        div.classList.add(theme.slug);
        div.classList.add("col-m-3", "col-t-6","col-d-3", "chos");
        container.appendChild(div);

        let element = document.createElement('a');
        element.classList.add("box-row");
        element.classList.add("choose");
        element.href=`./app/theme.html?id=${theme.id}`

        div.appendChild(element);

        let icone = document.createElement('img');
        icone.src=theme.metadata.icone.url;
        icone.width = 60;
        icone.height = 60;
        icone.alt = 'emoji ' + theme.metadata.alt_img;
        icone.classList.add("icone");

        let title = document.createElement('div');
        title.classList.add("title");
        title.innerHTML=theme.metadata.name;

        element.appendChild(title);
        element.appendChild(icone);

    });
}

(async () => {
    try {
        themesData = await fetchApi(THEMES_URL)
        displayThemes(themesData);
    } catch (error) {
        console.error('Fetching error:', error);
        throw error;
    }
})();