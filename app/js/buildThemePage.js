const urlParams = new URLSearchParams(window.location.search);
const themesId = urlParams.get('id');
console.log(themesId);
const THEMES_URL = `https://api.cosmicjs.com/v3/buckets/ti-project-production/objects/${themesId}?pretty=true&query=%7B%22type%22:%22themes%22%7D&limit=10&read_key=gTRqDyjPMRAkcbCzQ0lkN6QowrCuKEnikL45ugW1p1hSee3a2s&depth=1&props=slug,title,metadata,id,`;

//import fetchApi from "./components/fetch.js";

async function fetchApi(apiUrl) {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`error loading search results: ${response.status}`)
        }
        const data = await response.json()
        return data.object;
    } catch (error) {
        console.error('Fetching error:', error);
        throw error;
    }
}

function displayArtifact(data) {
    console.log(data)

    let link = document.querySelector("#lk");
    link.setAttribute("href", data.metadata.icone.url);
    
    let icon = document.querySelector('#icone');
    //icon.innerText = data.metadata.icone;

    let ico = document.createElement('img');
        ico.src=data.metadata.icone.url;
        ico.width = 40;
        ico.height = 40;
        ico.style.transform = "translateY(15%)";
        ico.alt = 'emoji ' + data.metadata.alt_img;
        icon.appendChild(ico);

    let name = document.querySelector("#theme");
    name.innerText = data.metadata.name;

    let audios = data.metadata.audio;
    console.log(audios);
    
    let wrap = document.querySelector(".wrap");

    let back_color = data.metadata.background_color;
    let color1 = data.metadata.color1;
    let color2 = data.metadata.color2;
    let text_color = data.metadata.text_color;

    let html = document.querySelector("html");
    html.style.backgroundColor=back_color;

    let back_div = document.querySelector("#back_div");
    let back = document.querySelector("#back");

    back_div.style.backgroundColor = color2;
    back.style.color = text_color;

    if(audios && audios.length > 0){
        for (let i = 0; i <  audios.length; i++) {
             //console.log(audios[i])
            let row = document.createElement("div");
            row.classList.add("row");
            wrap.appendChild(row);

            let col_vaz = document.createElement("div");
            col_vaz.classList.add("col-d-2");
            row.appendChild(col_vaz);

            let col = document.createElement("div");
            col.classList.add("col-m-6");
            col.classList.add("col-t-12");
            col.classList.add("col-d-8");
            row.appendChild(col);

            let container = document.createElement("div");
            container.classList.add("container");
            col.appendChild(container);

            let n = document.createElement("div");
            n.classList.add("n");
            container.appendChild(n);

            /*let name = document.createElement("div");
            name.classList.add("name");
            name.innerText = data.metadata.audio[i].metadata.audio + " (" + (i+1) + ")";
            name.style.color = text_color;
            n.appendChild(name);*/

            let label = document.createElement("label");
            label.setAttribute("for", "my-slider" + i + "")
            let name=data.metadata.audio[i].metadata.audio + " (" + (i+1) + ")";
            label.innerText =name;
            label.classList.add("name");
            label.style.color = text_color;
            container.appendChild(label);

            let slider_value = document.createElement("div");
            slider_value.classList.add("slider-value" + i + "")
            //slider_value.setAttribute("id", "slider-value" + i + "")
            n.appendChild(slider_value);

            let input = document.createElement("input");
            input.setAttribute("id", "my-slider" + i + "")
            input.setAttribute("type", "range")
            input.setAttribute("min", "0");
            input.setAttribute("max", "100");
            input.setAttribute("value", "0");
            input.setAttribute("data-index", i);
            container.appendChild(input);


            if (i==0){
                input.setAttribute("value", "50");
            }

            // Função de atualização do slider
        input.addEventListener("input", function() {
            let index = this.getAttribute("data-index");
            let valPercent = (this.value / this.max) * 100;
            document.querySelector(".slider-value" + index).textContent = this.value + "%";
            this.style.background = `linear-gradient(to right,`  + color1 + ` ${valPercent}%, ` + color2 + ` ${valPercent}%)`;
        });

        // Atualizar o slider inicialmente
        input.dispatchEvent(new Event('input'));
        }
        Volume_Audio(data);
    

    } else {
        let adjust = document.querySelector(".adjust");
        adjust.innerText = "Ainda não foram carregados áudios. Por favor, contacte o fornecedor do serviço.";
    }
}

(async () => {
    try {
        const themeData = await fetchApi(THEMES_URL);
        displayArtifact(themeData);
    } catch (error) {
        console.error('Fetching error:', error);
        throw error;
    }
})();
