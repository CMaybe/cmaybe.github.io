# Jaegyeom Kim

Personal technical blog and project portfolio for robotics software work in
model-based control, motion planning, optimization, and real-time systems.

The site is built with [Docusaurus](https://docusaurus.io/) and published at
<https://cmaybe.github.io>.

## Highlights

- Technical notes on manipulation, AMR navigation, MPC/NMPC, and real-time robotics
- Selected project links, including Optimal Parking, MPCC, and Convex MPC
- An embedded [Modern Robotics WASM](https://cmaybe.github.io/modern-robotics-wasm/)
	demo for interactive forward/inverse kinematics, planning, and dynamics

## Requirements

- Node.js 20 or newer
- npm

## Local development

Install dependencies and start the development server:

```sh
npm ci
npm start
```

The site is served at <http://localhost:3000>. Docusaurus reloads the page as
source files change.

## Build and preview

Create the production site:

```sh
npm run build
```

The generated static site is written to `build/`. Preview that output locally:

```sh
npm run serve
```

Use this type check when changing TypeScript or React code:

```sh
npm run typecheck
```

## Content

- Write posts in `blog/` using Markdown or MDX.
- Add authors in `blog/authors.yml` and tags in `blog/tags.yml` before referencing
	them from post front matter.
- Edit documentation pages in `docs/`; sidebar navigation lives in `sidebars.ts`.
- The homepage is implemented in `src/pages/index.tsx` and styled by
	`src/pages/index.module.css`.

The Modern Robotics post embeds the independently deployed web application with
an iframe. Keep the application deployment separate from this repository, then
reference its public Pages URL from the post.

## Deployment

Pushing to `main` triggers [.github/workflows/deploy.yaml](.github/workflows/deploy.yaml).
The workflow installs dependencies with `npm ci`, runs `npm run build`, and
publishes `build/` to the repository's `gh-pages` branch with `GITHUB_TOKEN`.

For GitHub Pages, configure this repository's Pages source to deploy from the
`gh-pages` branch. No local deployment command or SSH key is required.
