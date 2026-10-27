# BuyWise India — full-stack website v1

BuyWise India is a mobile-friendly product discovery and comparison website for **Electronics** and **Skincare**. This version combines a static frontend with a built-in Node.js backend/API. It uses Node's built-in modules only; no paid hosting or third-party packages are required to run it locally.

## Run locally

1. Install Node.js 18 or newer.
2. Extract the project ZIP.
3. Open a terminal in the `buywise-india-v1` folder.
4. Run:

   ```bash
   npm start
   ```

5. Open `http://localhost:3000`.

Do not open `index.html` directly from the file manager; the frontend calls the API served by `server.js`.

## Backend API

- `GET /api/health` — health/status check.
- `GET /api/products` — returns the catalogue.
- `GET /api/products?query=sony&category=electronics&type=Headphones&sort=price-low` — searches and filters products server-side.
- `GET /api/products/:id` — returns one product by ID.

The backend reads product records from `data/products.json`. The frontend requests results from the API. This is an intentionally small first backend, suitable for development and a starter deployment—not yet a hardened production marketplace.

## Features

- Search product names, brands, types, descriptions, tags, and specifications.
- Browse Electronics and Skincare.
- Filter by product type; sort by relevance, price, or name.
- Save products in the current browser and compare up to three products.
- Responsive layout for desktop and mobile.
- Product API and health endpoint.

## Important limitations

- Catalogue and prices are illustrative sample data, not live retailer listings or verified current prices.
- Product cards show a Danawa-style multi-retailer offer comparison layout. Merchant names and offer prices are illustrative demo data, not live retailer listings or verified purchase links.
- Saved items are stored in browser local storage; there is no user account or cross-device sync.
- There is no live retailer integration, checkout, payment processing, or AI/LLM recommendation API.
- No secrets or API keys are required for this version.

## Deploying

This full-stack version needs a host that can run a Node.js process. Static hosting such as GitHub Pages can host the frontend but **cannot run this backend**. For a ₹0 launch, use a Node-compatible hosting provider's free tier after checking its current limits and availability. Set the start command to `npm start` and, if the provider supplies a `PORT` environment variable, the server will use it automatically.

Before a public production launch, add request rate limiting, structured logging, security review, automated tests, backups and monitoring. Choose authorized retailer APIs/affiliate feeds before displaying real offers, and show the source and last-checked timestamp for live prices.
