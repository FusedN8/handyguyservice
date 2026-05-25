# HandyGuy Service

HandyGuy Service website with a React + Next.js quote request page prepared for future AI and admin dashboard integrations.

## Pages

- `index.html` - Homepage with gallery, services, testimonials, calendar, and FAQ.
- `contact.html` - Contact form that submits through FormSubmit to `handyguyserviceinfo@gmail.com`.
- `/request-a-quote` - Next.js quote request page for new clients.
- `/existing-client-request` - Shorter Next.js request page for existing clients.
- `/existing-client-request?client=client-name` - Existing-client request page with a hidden client code included in the email submission.

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000/request-a-quote](http://localhost:3000/request-a-quote) for new clients or [http://localhost:3000/existing-client-request](http://localhost:3000/existing-client-request) for existing clients.

If port `3000` is already in use:

```bash
npm run dev -- --port 3005
```

Then open [http://localhost:3005/request-a-quote](http://localhost:3005/request-a-quote).

## Quote Request App

- `app/request-a-quote/page.tsx` renders the new-client quote page.
- `app/existing-client-request/page.tsx` renders the shorter existing-client request page.
- `components/quote-request-shell.tsx` provides the shared client-facing form layout.
- `components/quote-request-form.tsx` sends quote details and uploaded pictures to `handyguyserviceinfo@gmail.com` through FormSubmit.
- `app/api/quote-requests/route.ts` is the future integration point for file storage, AI triage, notifications, and an admin dashboard.

## Picture Uploads

Quote request pictures are submitted as email attachments through FormSubmit using `multipart/form-data`. Uploads are temporary from the website's perspective: the app does not store the files, and you receive the request in email. The form limits selected pictures to 10 MB total before submission.

## Assets

Images are stored under `assets/images/`. Gallery thumbnails live in `assets/images/gallery/`; full-resolution lightbox images are in `assets/images/gallery/full/`. The hero uses a self-hosted background video at `assets/images/hero-video.mp4`, and the availability section embeds the Google Calendar.

## Contact Form

Submissions from `contact.html` are handled by FormSubmit. The simple math captcha is checked in the browser before submit, and a honeypot field helps block bots.
