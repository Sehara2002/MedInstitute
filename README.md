This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## LMS integration

Everything that belongs to the LMS goes through the LMS backend's API; this site
never connects to the LMS database.

- **Courses** are read live from `GET /public/courses`. Free courses link to the
  LMS's own join page (the backend supplies the link).
- **Course registration and payment** are handled by the backend
  (`/public/course-registrations`): it prices the course (offer price while one
  runs), starts the Commercial Bank checkout, verifies the payment, creates or
  links the student's LMS account, enrolls them and sends the emails.
- **Mock exams** are read and booked through the same backend. Browser code calls
  this site's `/api/lms/public/...` pass-through, so the backend address stays server-only.
- **Dashboard access** to paid course videos combines the backend's paid
  registrations (read with `WEBSITE_API_KEY`) with older registrations still in
  this site's own database.

| Variable | Required | Purpose |
| --- | --- | --- |
| `LMS_BACKEND_URL` | yes | The LMS backend API, including `/api`, e.g. `https://lms.citech.live/api` (https; `http://localhost` allowed for development) |
| `WEBSITE_API_KEY` | yes | Shared secret; must equal `WEBSITE_API_KEY` on the backend. Lets the dashboard read which courses an account has paid for |
| `MPGS_CURRENCY` | no | Currency online payment is taken in (default `LKR`). Courses priced in another currency show "Contact Us to Enroll" |

`DATABASE_URL` (this site's own accounts and video views), `AUTH_SECRET`, `GOOGLE_*`
and `GMAIL_*` (website sign-up emails) are unchanged.

Videos and brochures are this site's own content, kept in `src/data/courses.ts`.
To attach them to a CITech course, set that entry's `citechCourseId`. Students who
paid under the entry's `legacyId` keep their access.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


this is a new branching example
