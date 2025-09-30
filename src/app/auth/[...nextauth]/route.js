import CredentialsProvider from "next-auth/providers/credentials";

// Minimal NextAuth config export for build to succeed
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Replace with your own user lookup logic
        if (credentials.email === "test@example.com" && credentials.password === "password") {
          return { id: 1, name: "Test User", email: "test@example.com" };
        }
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/auth/signin"
  }
  // ...add more options as needed...
};
