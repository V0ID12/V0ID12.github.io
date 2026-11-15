# Donovan Ferrel's Portfolio

The source for my portfolio site, live at **https://v0id12.github.io/**

A single-page site with a retro game theme: projects, about, skills and a contact form.

## How it's built

Plain HTML, CSS and JavaScript. There is no framework and no build step, so the files in this repo are exactly what the browser loads.

| File | Purpose |
|---|---|
| `index.html` | Page structure |
| `styles.css` | Dark and light themes, layout and animations |
| `js/data.js` | All of the site's content: bio, skills, projects and links |
| `js/main.js` | Renders the content, and runs the theme toggle, animations and contact form |
| `js/sprites.js` | The pixel-art characters, drawn as grids of text |

Content is kept apart from markup. Adding a project means adding one object to the `projects` array in `js/data.js`.

## Features

- Dark and light themes that follow the system setting and remember your choice
- Contact form with validation, delivered through Formspree so no email address appears in the source
- Pixel-art link characters built as SVG from text grids
- Animations that are toned down automatically for visitors who prefer reduced motion

## Running it locally

Open `index.html` in a browser. Nothing needs installing.

## Deployment

GitHub Pages serves the `main` branch. Pushing to `main` updates the live site about a minute later.
