# FS Nexus website

A responsive static business website for FS Nexus, designed for Cloudflare Pages.

## Files
- `index.html` — page content and contact form
- `styles.css` — responsive visual design
- `script.js` — mobile navigation and form submission
- `functions/api/contact.js` — Cloudflare Pages Function that sends enquiries through Resend

## Deploy to Cloudflare Pages
1. Push this repository to GitHub.
2. In Cloudflare, open **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Select the `fsnexus-website` GitHub repository.
4. Framework preset: **None**.
5. Build command: leave blank.
6. Build output directory: `/` (or `.` if the UI requires a relative directory).
7. Deploy.

Cloudflare Pages Functions in the `functions/` directory are deployed automatically with the site.

## Configure the contact form
The form endpoint is `/api/contact`. Before it can send messages, add these Cloudflare Pages environment variables under Settings → Variables and Secrets:

- `RESEND_API_KEY` — secret API key from Resend
- `CONTACT_TO` — inbox that should receive enquiries
- `CONTACT_FROM` — a verified sender address on a domain you have verified with Resend, e.g. `FS Nexus Website <website@your-verified-domain>`

Then redeploy.

The website form includes a honeypot field and server-side validation. For stronger abuse protection, add Cloudflare Turnstile and validate its token in the Pages Function before launch. Do not publish API keys in GitHub or frontend JavaScript.

## Before launch
- Confirm the preferred public contact email and telephone number.
- Add the correct registered business details and any required privacy notice.
- Review service descriptions and ensure they accurately reflect the services offered.
- Configure the contact form and test it end-to-end.
- Add the custom domain in Cloudflare Pages after the site is deployed.
- Only then update the DNS records needed for the website. Preserve existing Microsoft 365 mail-related DNS records.
