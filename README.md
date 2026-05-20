# HandyGuy Service (Static Copy)

A static recreation of [handyguyservice.com](https://handyguyservice.com/), extracted for local development and customization.

## Pages

- `index.html` — Homepage (hero video, gallery, services, testimonials, calendar, FAQ)
- `contact.html` — Contact form (submits via [FormSubmit](https://formsubmit.co) to `handyguyserviceinfo@gmail.com`)

## Run locally

```bash
# Python
python3 -m http.server 8080

# or Node
npx serve .
```

Open [http://localhost:8080](http://localhost:8080).

## Assets

Images are stored under `assets/images/`. Gallery thumbnails live in `assets/images/gallery/`; full-resolution lightbox images are in `assets/images/gallery/full/` (sourced from the original site's `-scaled` uploads). The hero uses a self-hosted background video (`assets/images/hero-video.mp4`) with no player controls. The availability section embeds the original Google Calendar.

## Contact form (GitHub Pages)

Submissions are handled by **FormSubmit** (free for static sites). The form POSTs to `https://formsubmit.co/handyguyserviceinfo@gmail.com` and FormSubmit forwards the message to that inbox.

**One-time setup:** After the first real submission (or a test), FormSubmit emails `handyguyserviceinfo@gmail.com` an activation link. Click it to start receiving messages.

The simple math captcha (5+6) is still checked in the browser before submit. A honeypot field (`_honey`) helps block bots.

## Notes
- Original Elementor CSS snapshots are in `assets/post-2805.css` and `assets/post-2733.css` for reference.
