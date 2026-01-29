# 24k MMK Gold Terminal

A terminal-style web dashboard that shows:
- XAU price in USD (from gold-api)
- XAU price in SGD (from ER-API)
- Gold price in MMK per kyat-tha (1 troy oz = 31.1035 g, 1 kyat-tha = 16.606 g)
- USD→MMK rate entered per session

## Live Site

After GitHub Pages builds, your site will be available from the repository Pages URL.

## Run Locally

Open `index.html` in a browser.

## Data Sources

- Gold price: https://api.gold-api.com/price/XAU
- FX (SGD base): https://open.er-api.com/v6/latest/SGD

## Notes

- Rates are session-only and not persisted.
