Anime recommandation website for Web Programming I final project

Site uses Jikan API for search and recommendations.

## Running locally

You need [Node.js](https://nodejs.org/) (which includes npm) installed.

1. Clone the repository and enter its directory:

   ```sh
   git clone https://github.com/gmdenjoyer/anime-finder-67.git
   cd anime-finder-67
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Start the development server:

   ```sh
   npm run dev
   ```

   Open the local URL printed by Vite (usually `http://localhost:5173/`).

To create and preview a production build, run:

```sh
npm run build
npm run preview
```

Run the linter with `npm run lint`.

## Deployment

The site is deployed to GitHub Pages by the workflow in
`.github/workflows/deploy.yml` whenever changes are pushed to `main`.

To enable deployment, open the repository's **Settings → Pages** and set the
build and deployment source to **GitHub Actions**. The published site will be
available at <https://gmdenjoyer.github.io/anime-finder-67/>.
