# An automated drafting assistant

A small, single-page website scaffold for the project. It uses semantic HTML, plain CSS, a short JavaScript module, and a dependency-free Node server. No application framework, backend, member information, or solution content is included.

## Run locally

Requires Node.js 18 or newer. Start the site with:

```sh
npm start
```

The server listens on `http://localhost:3000` by default and honors `PORT` when provided.

## Content sections

The navigation links to Home, Robot, Problem Statement, Solution, Team Members, and Gallery. The Problem Statement section contains the statement supplied by the project owner. The Solution section intentionally says it is awaiting the owner's text; no solution was drafted. The Team Members section contains exactly nine numbered photo placeholders and no names or biographies. Replace a member placeholder with only the details and picture the project owner supplies and asks to add. The Gallery currently contains four generic image placeholders.

## Replace the temporary font

Inter is currently loaded from Google Fonts as a temporary choice. In `index.html`, replace the Google Fonts stylesheet link. In `src/styles.css`, update the single `--site-font` custom property to the new font family and fallbacks. These are the only font-specific edits required.

## Theme

No final theme has been selected. The current stylesheet is an interim, neutral presentation layer so the site is ready to show; its grouped CSS custom properties near the top of `src/styles.css` make its temporary colors, surfaces, borders, and spacing easy to change later. Choose a final visual direction separately when ready.
