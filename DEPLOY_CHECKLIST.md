# BuyWise India deployment checklist

## Run and test locally
- [ ] Install Node.js 18+.
- [ ] Run `npm start` in the project folder.
- [ ] Open `http://localhost:3000`.
- [ ] Confirm `http://localhost:3000/api/health` returns `{"status":"ok", ...}`.
- [ ] Confirm `http://localhost:3000/api/products` returns the product catalogue.
- [ ] Search for `Sony`, switch categories, change product type, and sort by price.
- [ ] Save a product and compare two products.
- [ ] Test desktop and mobile-sized screens.
- [ ] Confirm all displayed prices are labelled sample/illustrative.

## Deploy a full-stack version
- [ ] Create a Git repository and push the full project (including `server.js`, `package.json`, `data/products.json`, and `index.html`).
- [ ] Select a hosting service that supports Node.js processes; static-only hosting is insufficient.
- [ ] Configure the start command as `npm start`.
- [ ] Use the platform's provided `PORT` environment variable.
- [ ] Verify `/api/health`, `/api/products`, search, and product detail endpoints on the public URL.
- [ ] Review the host's current free-tier limits, sleep behavior, logs, and terms before relying on it.

## Before real retail data
- [ ] Choose authorized retailer APIs or affiliate feeds.
- [ ] Confirm usage terms, attribution, caching rules, and refresh limits.
- [ ] Add seller, exact variant/SKU, product URL, price currency, stock status, source, and last-checked timestamp.
- [ ] Do not label illustrative data as live prices.
- [ ] Add rate limiting, error monitoring, privacy notice, and security review before public production use.
