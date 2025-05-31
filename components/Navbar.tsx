// components/Navbar.tsx
'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <div className="text-xl font-bold">
        <Link href="/">Spotify Shots</Link>
      </div>
      <div className="space-x-4">
        <Link href="/browse" className="hover:underline">Browse</Link>
        <Link href="/playlist" className="hover:underline">Playlists</Link>
        <Link href="/album" className="hover:underline">Albums</Link>
        <Link href="/" >
        <button
          className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded"
        >
          Logout
        </button>
        </Link>
      </div>
    </nav>
  );
}
