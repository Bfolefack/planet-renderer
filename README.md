# Planet Renderer

A real-time renderer for an Earth-like planet featuring physically based atmospheric scattering and volumetric clouds, built in TypeScript with WebGL2.

## Requirements

- Node.js (v18 or later recommended)
- A modern browser with WebGL2 support (Chrome, Firefox, Edge, Safari 15+)
- A reasonably modern GPU (the renderer raymarches at full resolution)

## Setup

Install dependencies:

```bash
npm install
```

## Running

Start the Vite development server:

```bash
npm run dev
```

This will print a local URL (typically `http://localhost:5173`). Open it in your browser.

## Building

To produce a static build:

```bash
npm run build
```

The output is written to `dist/`. To preview the production build locally:

```bash
npm run preview
```
alternatively, serve the `dist/` directory with any static file server.
```bash
http-server -c-1 dist/
```

## Deploying to GitHub Pages

The repo includes a workflow (`.github/workflows/deploy.yml`) that builds the app and publishes `dist/` to GitHub Pages on every push to `main`.

One-time setup: in the GitHub repo, go to **Settings → Pages → Source** and select **GitHub Actions**. After the next push, the site is available at `https://<your-username>.github.io/planet-renderer/`.

`vite.config.ts` sets `base: '/planet-renderer/'` to match the repository name. If you rename the repo (or deploy somewhere other than a project page), update that value. Note that `npm run dev` and `npm run preview` also serve under this base path.

## Controls

Click the canvas to capture the mouse. Press **Esc** to release.

| Key | Action |
|---|---|
| **Mouse** | Look around (planet-relative pitch/yaw) |
| **W / S** | Move forward / backward along view direction |
| **A / D** | Strafe left / right |
| **Space** | Ascend (move away from planet center) |
| **Shift** | Descend (move toward planet center) |
| **Q / E** | Move sun westward / eastward across the sky |
| **1 / 3** | Slower sun movement for finer control |
| **T** | Reset sun |
| **R** | Reset camera orientation |
| **C** | Toggle cloud rendering |
| **H** | Toggle HUD (FPS counter and controls overlay) |

Movement speed scales automatically with altitude — slow near the surface, fast in space.

## Tips for Viewing

- Start position is above the atmosphere on the day side. Press **Shift** to descend through the clouds.
- Hold **Q** or **E** to scrub the sun across the sky and watch the atmosphere transition through sunset and into night.
- Look toward the sun at low angles to see Mie scattering produce a bright halo.
- View the planet from orbit (release Shift, hold Space) to see the blue atmospheric limb.

See `report.pdf` for full technical details and limitations.