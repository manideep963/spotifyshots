'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Play, Pause, ExternalLink } from 'lucide-react';
import Navbar from '@/components/Navbar';

type Track = {
  _id: string;
  name: string;
  previewUrl: string;
  durationMs: number;
  spotifyId: string;
};

type Album = {
  _id: string;
  name: string;
  imageUrl: string;
  releaseDate: string;
  totalTracks: number;
  albumType: string;
  artists: string[];
  tracks: Track[];
};

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

export default function EnhancedAlbumPage() {
  const { id } = useParams();
  const router = useRouter();
  const { status } = useSession();
  const [album, setAlbum] = useState<Album | null>(null);
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Redirect unauthenticated users
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (!id || status !== "authenticated") return;

    const fetchAlbum = async () => {
      try {
        const res = await fetch(`/api/albums/${id}`);
        if (!res.ok) throw new Error('Album fetch failed');
        const data = await res.json();
        setAlbum(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAlbum();
  }, [id, status]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => setPlayingUrl(null);

    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const playPreview = (url: string | null) => {
    if (!url) return;
    if (playingUrl === url) {
      setPlayingUrl(null);
      audioRef.current?.pause();
    } else {
      setPlayingUrl(url);
      setIsLoading(true);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playingUrl) {
      audio.src = playingUrl;
      audio.play();
    }
  }, [playingUrl]);

  if (status === "loading" || !album) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        Loading album...
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white p-8">
        <div className="flex space-x-6 mb-8">
          <Image src={album.imageUrl} alt={album.name} width={240} height={240} className="rounded-lg shadow-lg" />
          <div>
            <p className="uppercase text-sm text-white/60">{album.albumType}</p>
            <h1 className="text-4xl font-bold mb-2">{album.name}</h1>
            <p className="text-white/70">{album.artists.join(', ')}</p>
            <p className="text-white/60 mt-2">
              {album.releaseDate} • {album.totalTracks} track{album.totalTracks > 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <div className="space-y-4">
          {album.tracks.map((track) => {
            const isCurrent = playingUrl === track.previewUrl;
            return (
              <div
                key={track._id}
                className="flex items-center justify-between px-4 py-3 hover:bg-white/10 rounded-lg transition"
              >
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => playPreview(track.previewUrl)}
                    disabled={!track.previewUrl}
                    className="text-white"
                  >
                    {isLoading && isCurrent ? (
                      <div className="w-4 h-4 border-b-2 border-green-400 rounded-full animate-spin" />
                    ) : isCurrent ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </button>
                  <div>
                    <p className="font-medium">{track.name}</p>
                    <p className="text-sm text-white/60">{formatDuration(track.durationMs)}</p>
                  </div>
                </div>
                {track.spotifyId && (
                  <a
                    href={`https://open.spotify.com/track/${track.spotifyId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-white"
                    title="Open in Spotify"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            );
          })}
        </div>
        <audio ref={audioRef} className="hidden" />
      </div>
    </>
  );
}