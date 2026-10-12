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

## Course catalogue (CITech LMS)

Courses are not edited here: they are read from the CITech LMS public catalogue
(`GET /api/public/courses`) and refreshed every 5 minutes. Free LMS courses are
shown as offers and joined on the LMS; paid courses are registered and paid for
here, priced from the live catalogue at registration time.

| Variable | Required | Purpose |
| --- | --- | --- |
| `CITECH_API_URL` | yes | Base URL of the CITech LMS API (https; `http://localhost` allowed for development) |
| `CITECH_LMS_URL` | no | Base URL of the CITech LMS website, where free courses are joined. Defaults to `https://lms.mrcgpfasttrack.com` |
| `MPGS_CURRENCY` | no | Payment gateway currency (default `LKR`). Only courses priced in this currency can be paid online; others show "Contact Us to Enroll" |

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
