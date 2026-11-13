const BASE_URL = "https://jikan.lucashdo.com/v1";
const MAX_RANDOM_ANIME_ATTEMPTS = 10;
const EXCLUDED_RANDOM_GENRES = new Set(["ecchi", "hentai"]);

export async function getSeasonNow() {
    const response = await fetch(
        `${BASE_URL}/seasons/now`
    );

    if (!response.ok) {
        throw new Error(`API response code: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
}

export async function searchAnime(query) {
    const response = await fetch(
        `${BASE_URL}/anime?${new URLSearchParams({ q: query })}`
    );

    if (!response.ok) {
        throw new Error(`API response code: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
}

export async function getRandomAnime() {
    for (let attempt = 0; attempt < MAX_RANDOM_ANIME_ATTEMPTS; attempt += 1) {
        const response = await fetch(`${BASE_URL}/random/anime`);

        if (!response.ok) {
            throw new Error(`API response code: ${response.status}`);
        }

        const data = await response.json();
        const anime = data.data;
        if (!anime) {
            throw new Error("Random anime response did not include anime data.");
        }

        const genres = (anime.genres ?? []).map((genre) =>
            typeof genre === "string" ? genre : genre?.name,
        )
        if (!genres.some((genre) => EXCLUDED_RANDOM_GENRES.has(genre?.toLowerCase()))) {
            return anime;
        }
    }

    throw new Error(
        `Could not find anime without Ecchi or Hentai genres after ${MAX_RANDOM_ANIME_ATTEMPTS} attempts.`,
    );
}

export async function getAnimeRecommendations(id) {
    const response = await fetch(
        `${BASE_URL}/anime/${id}/recommendations`
    );

    if (!response.ok) {
        throw new Error(`Anime recommendations failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.data;
}