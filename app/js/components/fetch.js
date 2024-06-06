//TI, Snoezelen Project
//Página de js, componente de fetch

export default async function fetchApi(apiUrl) {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`error loading search results: ${response.status}`)
        }
        const data = await response.json()
        console.log("fecth api component: ");
        console.log(data);
        return data.objects;
    } catch (error) {
        console.error('Fetching error:', error);
        throw error;
    }
}

