# Parth Solanki | AI/ML Engineer Portfolio

A static portfolio website built with plain **HTML5, CSS3 and vanilla JavaScript**. No framework, no npm, no build step.

**Design theme:** Classic Elegance, using Camel `#B4876D`, Foghorn Grey `#7F7B78`, Dark Sea Teal `#203F42`, Snowy Peaks Cream `#E9E1D9` and Windsor Wine Burgundy `#5B2934`.

## Project structure

```
portfolio/
├── index.html                                  # Page markup and SEO metadata
├── style.css                                   # All styles (design tokens at the top)
├── script.js                                   # Nav, animations, neural canvas, resume download, EmailJS form
├── assets/
│   ├── profile.jpg                             # Placeholder portrait: replace with your photo
│   └── vendor/emailjs.min.js                   # EmailJS browser SDK (local copy, no CDN needed)
├── Parth_Solanki_AI_ML_Engineer_Resume.pdf     # Linked from the "Download Resume" buttons
└── README.md
```

## Run locally

1. Download or copy the `portfolio` folder to your computer.
2. Double-click `index.html` (or right-click, then Open with, then your browser).

That is all. The only online dependency is Google Fonts (Cormorant Garamond and Inter). If you are offline, the site falls back to Georgia and your system sans-serif font, and everything else still works.

## Customise

| What | Where |
| --- | --- |
| Your photo | Replace `assets/profile.jpg` with your own image (portrait, about 800 × 1000 px, same file name). |
| Resume | Replace `Parth_Solanki_AI_ML_Engineer_Resume.pdf`, keeping the same file name. |
| Colours | Edit the `:root` variables at the top of `style.css`. |
| Project links | Edit the `href` values inside the `#projects` section of `index.html`. |
| Site URL for social previews | After deploying, add `<meta property="og:url" content="https://your-site-url">` and an absolute `og:image` URL in `<head>`. |

## Upload to GitHub

Create a new empty repository on GitHub (for example `portfolio`), then run these commands inside the project folder:

```bash
git init
git add .
git commit -m "Add portfolio website"
git branch -M main
git remote add origin https://github.com/iparthsolanki/portfolio.git
git push -u origin main
```

Prefer no command line? On the repository page choose **Add file, then Upload files**, drag in everything inside the `portfolio` folder (including the `assets` folder) and commit. Make sure `index.html` sits at the **root** of the repository, not inside a sub-folder.

## Deploy to Render (Static Site)

1. Sign in at [render.com](https://render.com) and connect your GitHub account.
2. Click **New +, then Static Site**, and select your `portfolio` repository.
3. Use these settings:
   - **Branch:** `main`
   - **Build Command:** leave empty
   - **Publish Directory:** `.` (the project root)
4. Click **Create Static Site**. Render publishes it at a URL like `https://your-name.onrender.com`, and redeploys on every `git push`.

## Alternative: GitHub Pages

In the repository go to **Settings, then Pages**, set **Source** to *Deploy from a branch*, choose `main` and the `/ (root)` folder, then save. The site goes live at `https://iparthsolanki.github.io/portfolio/`. All paths in this project are relative, so it works under that sub-path.

## Contact form (EmailJS)

The form sends messages straight to your inbox through [EmailJS](https://www.emailjs.com), with no backend of your own. The IDs live in `EMAILJS_CONFIG` at the top of `script.js`.

In the EmailJS dashboard, open **Email Templates, then your template**, and use these variables (they match the form field names):

| Variable | Meaning |
| --- | --- |
| `{{name}}` | Visitor's name |
| `{{email}}` | Visitor's email (set **Reply To** to `{{email}}` so you can answer with one click) |
| `{{company}}` | Company / organisation (optional field) |
| `{{message}}` | The message |
| `{{sent_at}}` | Time of sending in IST |
| `{{page_url}}` | Page the form was sent from |

Set **To Email** to your own address. Suggested subject: `New portfolio message from {{name}}`.

Recommended security steps in EmailJS: under **Account, then Security**, add your site's domain (for example `your-name.onrender.com`) to the allowed origins list. The public key is meant to be visible in front-end code, and this restricts who can use it. The form also has a hidden spam trap and a 30-second cooldown between sends. The free plan allows 200 emails per month.

## Notes

- The two "Live Demo" buttons point to free-tier Render apps, which can take a short moment to wake up on the first visit.
- Respects `prefers-reduced-motion`, supports keyboard navigation with visible focus states, and includes a "skip to content" link.
