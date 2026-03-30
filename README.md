# Cole Chase For Judge

This is a campaign website concept for a judicial race in Klamath County, Oregon.

⚠️ This is NOT an official campaign website and has not been approved by the candidate or campaign team.

---

## Purpose

- Provide a clean, professional example of a judicial campaign website
- Demonstrate layout, tone, and structure appropriate for a judge
- Offer a starting point for future collaboration and refinement

---

## Current Structure

```text
colechaseforjudge/
├── api/
│   └── forms.js
├── app.js
├── index.html
├── styles.css
└── assets/
    ├── documents/
    │   └── .gitkeep
    └── images/
        └── .gitkeep
```

---

## Notes on Tone and Content

This project intentionally:
- Uses neutral, professional language
- Avoids political messaging or endorsements
- Focuses on structure rather than finalized content

Content is designed to be easily replaced or expanded by a campaign team.

---

## Suggested Future Use

- `api/forms.js` → Vercel form endpoint that sends submissions through Resend
- `index.html` → Full campaign landing page
- `styles.css` → Visual identity and branding
- `app.js` → Forms, navigation, and interactivity
- `assets/images/` → Candidate photos and branding
- `assets/documents/` → PDFs, endorsements, press materials

---

## Next Steps (If Approved)

- Replace placeholder content with candidate-approved messaging
- Add official branding, photos, and contact information
- Connect domain and deploy live
- Integrate email and outreach tools if needed

---

## Form Delivery Setup

This repo now includes a Vercel function at `api/forms.js` that sends both site forms through Resend.

Set these environment variables in Vercel before testing:

- `RESEND_API_KEY` → Your Resend API key
- `RESEND_FROM_EMAIL` → A sender address on a verified Resend domain, for example `Campaign Website <noreply@yourdomain.com>`
- `CAMPAIGN_TO_EMAIL` → Destination inbox, defaults to `cole.p.chase@gmail.com` if omitted

After deploying:

- Newsletter signups submit to `/api/forms` and email the campaign inbox
- Contact form messages submit to `/api/forms` and email the campaign inbox
- The sender's email is used as `reply_to` so replies can go directly back to the person who filled out the form

---

## Created By

Quentin Nichols  
https://quentinnichols.com
