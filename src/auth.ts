import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { sendWelcomeEmail } from "@/lib/mailer";
import { authConfig } from "@/auth.config";
import { signInWithGoogle, verifyCredentials } from "@/lib/websiteUsers";

// Website accounts live in the LMS database and are reached through the LMS
// backend (src/lib/websiteUsers.ts). Sessions are JWTs, so this site keeps no
// database: the token carries the account id the backend issued.

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await verifyCredentials(String(credentials.email), String(credentials.password));
        if (!user) return null;
        return { id: user.id, name: user.name, email: user.email, image: user.image };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, account, profile }) {
      if (account?.provider === "google" && profile?.email) {
        // The backend account for this Google login, created on first sign-in
        const { user: websiteUser, created } = await signInWithGoogle({
          providerAccountId: account.providerAccountId,
          email: profile.email,
          name: profile.name ?? user?.name ?? null,
          image: (profile.picture as string | undefined) ?? user?.image ?? null,
          emailVerified: profile.email_verified === true,
        });
        token.id = websiteUser.id;
        token.name = websiteUser.name ?? token.name;
        token.picture = websiteUser.image ?? token.picture;
        if (created) {
          sendWelcomeEmail({ name: websiteUser.name, email: websiteUser.email }).catch((err) =>
            console.error("[auth] Failed to send welcome email:", err)
          );
        }
        return token;
      }
      if (user) token.id = user.id;
      return token;
    },
  },
});
