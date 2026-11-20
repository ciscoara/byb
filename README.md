# Believe Your Beauty: landing page

A static site (plain HTML, CSS and a little JavaScript). No build step. Any static host works; the steps below use Netlify because it is free and takes a drag and drop.

```
index.html                     the page
assets/css/  style.css, fonts.css
assets/js/   config.js  <- the only file you need to edit
             main.js       sign-up form, booking buttons, service cards
assets/fonts/  Gilda Display, Manrope (self-hosted)
assets/img/    portrait, share image, icon
google-apps-script/Code.gs     saves sign-ups to a Google Sheet
favicon.svg, robots.txt
```

## 1. Preview it locally (optional)

From this folder run `python3 -m http.server 8000` and open http://localhost:8000.
(Opening index.html directly from Finder also works, but the fonts and image load best through a server.)

## 2. Store the emails in a Google Sheet (10 minutes)

1. In Google Drive create a new Google Sheet, for example "BYB Sign-ups".
2. In the sheet open **Extensions > Apps Script**. Delete what is there and paste the whole of `google-apps-script/Code.gs`. Save.
3. Click **Deploy > New deployment**. Choose type **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
   Click **Deploy**, approve the Google permission prompt (it asks to edit this one spreadsheet), and copy the **Web app URL** (ends in `/exec`).
4. Paste that URL into `assets/js/config.js` as `window.BYB_SIGNUP_URL = "https://script.google.com/macros/s/.../exec";`

Each sign-up becomes a row in a "Signups" tab: date, email, source, page, referrer. The same email is never added twice.
To export later (Mailchimp, Flodesk, Kit and so on): File > Download > CSV.

If you change Code.gs later, use **Deploy > Manage deployments > Edit > New version** so the URL stays the same.

## 3. Booking link (optional)

Paste the Calendly link for the Healing Discovery Session into `window.BYB_BOOKING_URL` in `config.js`.
The "Book your session" and "Begin with a Discovery Session" buttons then open Calendly in a new tab.
While it is empty they read "Request a session" and take people to the email sign-up.

## 4. Put it online

1. Go to https://app.netlify.com/drop (sign up free with Google or email).
2. Drag this whole folder onto the page. You get a link like `https://something.netlify.app` within seconds.
3. Test the sign-up form on that link and check the row appears in the sheet.
4. To update the site later: Netlify > your site > **Deploys** > drag the folder again.

## 5. Connect believeyourbeauty.com

Do this last: it replaces whatever believeyourbeauty.com shows today.

1. Netlify > your site > **Domain management > Add a domain** > `believeyourbeauty.com`.
2. Netlify shows the DNS records to add. At the domain registrar (where the domain was bought) it is usually:
   - `A` record, host `@`, value `75.2.60.5`
   - `CNAME` record, host `www`, value `your-site-name.netlify.app`
   Remove any old `A`/`CNAME` records for `@` and `www` that point to the current site builder.
3. DNS can take from a few minutes to a few hours. Netlify then adds the free HTTPS certificate on its own.

## Editing copy

All text is in `index.html`. The services are the three `<details class="svc">` blocks; each opens to show the description, what's included and the outcome. The Reclamation Continuum is intentionally not on this page (alumni only).
