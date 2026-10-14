# Tito Thomas — Portfolio

A personal portfolio with an interactive 3D constellation and an index view. Career, skills, education, and contact details open in section dialogs.

## Development

```bash
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000).

## Checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Content

- `src/data/portfolioData.ts`: professional records, skills, education, hobbies, projects, and contact links.
- `src/data/siteData.ts`: identity and category configuration.
- `src/data/spatialData.ts`: introduction copy and constellation layout.

Sections without records are omitted from the constellation and index.

## Rendering

The site uses Next.js, React, TypeScript, and Three.js. The 3D renderer persists across section changes. Text labels use DOM transforms, branch geometry updates when nodes move, and background animation pauses when a dialog is open.
