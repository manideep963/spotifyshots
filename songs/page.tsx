'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

export default function AllSongsPage() {
  type Song = {
    _id: string;
    title: string;
    previewUrl: string;
    // add other properties if needed
  };

  const [songs, setSongs] = useState<Song[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Use a ref to always have the latest page value in the observer callback
  const pageRef = useRef(page);
  pageRef.current = page;

  const loadSongs = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/songs?page=${pageRef.current}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();

      setSongs(prev => [...prev, ...data.songs]);
      setHasMore(data.hasMore);
      setPage(prev => prev + 1);
    } catch (err) {
      setHasMore(false);
    }
    setLoading(false);
  }, [hasMore, loading]);

  useEffect(() => {
    loadSongs(); // initial load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          loadSongs();
        }
      },
      { threshold: 1.0 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [loadSongs, hasMore, loading]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Songs</h1>
      <ul className="space-y-4">
        {songs.map(song => (
          <li key={song._id} className="border p-2 rounded shadow">
            <p>{song.title}</p>
            <audio controls src={song.previewUrl} className="w-full mt-2" />
          </li>
        ))}
      </ul>
      {loading && <p className="mt-4 text-center">Loading more...</p>}
      <div ref={loaderRef} className="h-10" />
    </div>
  );
}
