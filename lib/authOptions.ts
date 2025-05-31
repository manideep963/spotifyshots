// lib/authOptions.ts
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import { connectToDB } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
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
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
