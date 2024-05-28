const urlParams = new URLSearchParams(window.location.search);
const themesId = urlParams.get('id');
const THEMES_URL = `https://api.cosmicjs.com/v3/buckets/ti-project-production/objects/${themesId}?pretty=true&query=%7B%22type%22:%22themes%22%7D&limit=10&read_key=gTRqDyjPMRAkcbCzQ0lkN6QowrCuKEnikL45ugW1p1hSee3a2s&depth=1&props=slug,title,metadata,id,`;


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

    let icon = document.querySelector('#icone');
    icon.innerText = data.metadata.icone;

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




    if(audios!==null){
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

            let name = document.createElement("div");
            name.classList.add("name");
            name.innerText = data.metadata.audio[i].metadata.audio + " (" + (i+1) + ")";
            name.style.color = text_color;
            n.appendChild(name);

            let slider_value = document.createElement("div");
            slider_value.classList.add("slider-value" + i + "")
            //slider_value.setAttribute("id", "slider-value" + i + "")
            n.appendChild(slider_value);

            let input = document.createElement("input");
            input.setAttribute("id", "my-slider" + i + "")
            input.setAttribute("type", "range")
            input.setAttribute("min", "0");
            input.setAttribute("max", "100");
            input.setAttribute("value", "50");
            input.setAttribute("data-index", i);
            container.appendChild(input);


            // Função de atualização do slider
        input.addEventListener("input", function() {
            let index = this.getAttribute("data-index");
            let valPercent = (this.value / this.max) * 100;
            document.querySelector(".slider-value" + index).textContent = this.value;
            this.style.background = `linear-gradient(to right,`  + color1 + ` ${valPercent}%, ` + color2 + ` ${valPercent}%)`;
        });

        // Atualizar o slider inicialmente
        input.dispatchEvent(new Event('input'));
        }
    } else{
        console.log("não existem áudios a apresentar")
    }

/*
    <div class="container">
                    <div class="n">
                        <div class="name">Baleia (1)</div>
                        <div id="slider-value">0</div>
                    </div>
                    <input type="range" id="my-slider" min="0" max="100" value="50" oninput="slider()">
                </div>

*/
    /*let back_color;
    let filter1;
    let filter2;
    let filter3;
    let filter4;
    let cor1;
    let cor2;
    let tags_back;
    let tags_text;

    let body = document.querySelector("body");
    let movie = document.querySelector(".movie");
    let footer = document.querySelector("footer");


    if (data.metadata.filme !== null) {
        console.log(data.metadata.filme);
        back_color = data.metadata.filme.metadata.background_color;
        filter1 = data.metadata.filme.metadata.filter1;
        filter2 = data.metadata.filme.metadata.filter2;
        filter3 = data.metadata.filme.metadata.filter3;
        filter4 = data.metadata.filme.metadata.filter4;
        cor1 = data.metadata.filme.metadata.cor1;
        cor2 = data.metadata.filme.metadata.cor2;
        tags_back = data.metadata.filme.metadata.tags_background;
        tags_text = data.metadata.filme.metadata.tags_text;

        movie.style.backgroundColor = cor1;

        let inspired = document.createElement("div");
        inspired.innerText = "Inspired by";
        inspired.classList.add("inspired");
        inspired.style.color = cor2;
        movie.appendChild(inspired);

        let movie_title = document.createElement("div");
        movie_title.innerText = data.metadata.filme.title;
        movie_title.classList.add("movie_title");
        movie_title.style.color = cor2;
        movie_title.style.textTransform = "uppercase";
        movie.appendChild(movie_title);

        let img_filme = document.createElement("img");
        img_filme.alt = "Movie"
        img_filme.classList.add("img_filme");
        img_filme.src = data.metadata.filme.metadata.cover.url;
        movie.appendChild(img_filme);

        let year = document.createElement("div");
        year.innerText = "–" + data.metadata.filme.metadata.year;
        year.classList.add("year");
        year.style.color = cor2;
        movie.appendChild(year);

    } else { //se for igual a null
        back_color = "#F7C5C8";
        filter1 = "#CA4C45";
        filter2 = "#F2F2F2";
        filter3 = "#3B53AB";
        filter4 = "#F2D140";
        cor1 = "#640C08";
        cor2 = "#640C08";
        tags_back = "#640C08";
        tags_text = "#FFFFFF";

        footer.style.backgroundColor = "#F3E4EC";
        body.removeChild(movie);
    }

    let doc_title = document.querySelector("title");
    doc_title.innerText = data.metadata.name;
    
    // info
    const title = document.getElementById('title')
    const by = document.getElementById('by')
    const text = document.getElementById('text')
    let background = document.querySelector("html");
    let header = document.querySelector("header");
    let back_div = document.querySelector("#back_div");

    background.style.backgroundColor = back_color;
    back_div.style.backgroundColor = cor1;

    //verifica se a class show está ou não presente e muda a cor de background do header
    let eyes = document.querySelector("#eyes");
    let a = document.querySelector("#fullscreen");
    let boolean = a.classList.contains("show");
    //console.log(boolean);
    header.style.backgroundColor = back_color;

    eyes.addEventListener("click", function () {
        boolean = !boolean;
        console.log(boolean);

        if (boolean === true) {
            header.style.backgroundColor = "rgba(0,0,0,0)";
        } else {
            //cor específica de cada página
            header.style.backgroundColor = back_color;
        }
    });

    title.textContent = data.metadata.name;
    title.style.color = cor1;

    let author = data.metadata.author_name;
    if (author === null) author = "Anonymous";

    if (data.metadata.year) {
        by.innerHTML = 'by ' + '<b>' + author + '</b>' + ' (' + data.metadata.year + ')';
    } else {
        by.innerHTML = 'by ' + '<b>' + author + '</b>';
    }

    text.innerHTML = data.metadata.description;

    // more link
    if (data.metadata.more_link) {
        const linkContainer = document.getElementById('more-link');
        const link = document.createElement('a');
        link.href = data.metadata.more_link;
        link.textContent = 'More +';
        link.target = "_blank";
        link.style.color = cor1;
        linkContainer.appendChild(link);
    }

    // tags
    if (data.metadata.tags) {
        const tagsContainer = document.getElementById('tags-container')
        const list = document.createElement('ul')
        data.metadata.tags.forEach(tag => {
            const item = document.createElement('li')
            item.textContent = tag.title
            item.style.backgroundColor = tags_back;
            item.style.color = tags_text;
            list.appendChild(item)
        });
        tagsContainer.appendChild(list)
    }

    // image
    const imagesContainer = document.getElementById('img-container')
    const img = document.createElement('img')
    img.alt = "Artifact"
    img.src = data.metadata.image.url
    imagesContainer.appendChild(img)

    // dominant colors
    const colors = document.getElementById('dominant-colors')
    const palette = document.createElement('ul')
    const filterArray = [filter1, filter2, filter3, filter4];

    for (let i = 0; i < 4; i++) {
        const item = document.createElement('li')
        item.classList.add(`cor`)
        item.style.backgroundColor = filterArray[i];
        palette.appendChild(item);
    }

    colors.appendChild(palette);*/
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
