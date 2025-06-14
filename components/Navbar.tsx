// components/Navbar.tsx
'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-black text-white px-8 py-4 flex justify-between items-center shadow-md">
      <div className="flex items-center space-x-6">
        <Link href="/" className="text-2xl font-extrabold tracking-tight text-[#1DB954] hover:text-white transition-colors">
          <span>Spotify Shots</span>
        </Link>
        {session && (
          <>
            <Link href="/browse" className="hover:text-[#1DB954] transition-colors font-medium">Browse</Link>
            <Link href="/album" className="hover:text-[#1DB954] transition-colors font-medium">Songs</Link>
            <Link href="/album" className="hover:text-[#1DB954] transition-colors font-medium">Albums</Link>
          </>
        )}
      </div>
      <div className="flex items-center space-x-4">
        {!session ? (
          <>
            <Link href="/signin" className="hover:text-[#1DB954] transition-colors font-medium">Sign In</Link>
            <Link href="/signup" className="hover:text-[#1DB954] transition-colors font-medium">Sign Up</Link>
          </>
        ) : (
          <>
            <span className="text-white/80 font-medium">{session.user?.name || 'Guest'}</span>
            <button
              className="bg-[#1DB954] hover:bg-[#169c46] text-black font-semibold px-4 py-2 rounded-full transition-colors"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
