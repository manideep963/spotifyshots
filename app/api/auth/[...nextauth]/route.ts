import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import User from "@/models/User";
import { connectToDB } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error("Missing credentials");
        }

        await connectToDB();

        const user = await User.findOne({ email: credentials.email });
        if (!user || !await bcrypt.compare(credentials.password, user.password)) {
          throw new Error("Invalid credentials");
        }

        return { id: user._id, name: user.name, email: user.email };
      }
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ]
});

export { handler as GET, handler as POST }