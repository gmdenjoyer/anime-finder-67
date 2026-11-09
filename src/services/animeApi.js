const BASE_URL = "https://api.jikan.moe/v4";

export async function getSeasonNow() {
    const response = await fetch(
        `${BASE_URL}/seasons/now`
    );

    const data = await response.json();
    return data.data;
}

export async function searchAnime(query) {
    const response = await fetch(
        `${BASE_URL}/anime?q=${query}`
    );

    const data = await response.json();
    return data.data;
}

export async function getRandomAnime() {
    const response = await fetch(
        `${BASE_URL}/random/anime`
    );

    const data = await response.json();
    return data.data;
}

export async function getAnimeRecommendations(id) {
    const response = await fetch(
        `${BASE_URL}/anime/${id}/recommendations`
    );

    const data = await response.json();
    return data.data;
}