"use client";
import { getProviders, signIn, type ClientSafeProvider } from "next-auth/react";
import { useEffect, useState } from "react";

export default function SignInPage() {
  const [providers, setProviders] = useState<Record<string, ClientSafeProvider> | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    getProviders().then(setProviders);
  }, []);

  if (!providers) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">Sign In</h1>

      {Object.values(providers).map((provider: ClientSafeProvider) => {
        if (provider.id === "credentials") {
          return (
            <form
              key={provider.name}
              className="flex flex-col gap-4 w-full max-w-sm mb-6"
              onSubmit={(e) => {
                e.preventDefault();
                signIn("credentials", {
                  username,
                  password,
                  redirect: true,
                  callbackUrl: "/browse",
                });
              }}
            >
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="border p-2 rounded"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border p-2 rounded"
              />
              <button type="submit" className="bg-black text-white p-2 rounded">
                Sign in with Credentials
              </button>
            </form>
          );
        }

        return (
          <button
            key={provider.name}
            onClick={() => signIn(provider.id)}
            className="bg-gray-100 hover:bg-gray-200 text-black p-2 rounded w-full max-w-sm mb-2"
          >
            Sign in with {provider.name}
          </button>
        );
      })}
    </div>
  );
}