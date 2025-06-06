"use client";
import React, { useState, useRef, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import TrackItem from "@/components/TrackItem";
import Navbar from "@/components/Navbar";

type Track = {
  id: string;
  name: string;
  previewUrl: string | null;
  durationMs: number;
  artists: { name?: string }[] | string[];
  spotifyId?: string;
};

type Playlist = {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  tracks: Track[];
};

export default function EnhancedPlaylistPage() {
  const { id } = useParams();
  const router = useRouter();
  const { status } = useSession();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set());
  const audioRef = useRef<HTMLAudioElement>(null);

  // Protect route: redirect unauthenticated users
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  useMemo(() => {
    if (!id || status !== "authenticated") return;
    const fetchPlaylist = async () => {
      try {
        const res = await fetch(`/api/playlist/${id}`);
        const data = await res.json();
        const tracks: Track[] = data.tracks.map((t: {
          _id: string;
          name: string;
          previewUrl: string | null;
          durationMs: number;
          artists: { name?: string }[] | string[];
          spotifyId?: string;
        }) => ({
          id: t._id,
          name: t.name,
          previewUrl: t.previewUrl,
          durationMs: t.durationMs,
          artists: t.artists,
          spotifyId: t.spotifyId,
        }));
        setPlaylist({
          _id: data._id,
          name: data.name,
          description: data.description,
          imageUrl: data.imageUrl,
          tracks,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchPlaylist();
  }, [id, status]);

  useMemo(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onLoadedData = () => setIsLoading(false);
    const onEnded = () => setPlayingUrl(null);

    audio.addEventListener("loadeddata", onLoadedData);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("loadeddata", onLoadedData);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  const playPreview = (url: string | null) => {
    const audio = audioRef.current;
    if (!audio || !url) return;

    if (playingUrl === url) {
      audio.pause();
      setPlayingUrl(null);
      return;
    }

    setPlayingUrl(url);
    setIsLoading(true);

    audio.src = url;
    audio.load();
    audio.play().catch((err) => {
      console.error("Audio playback error:", err);
      setIsLoading(false);
    });
  };

  const toggleLike = (trackId: string) => {
    const next = new Set(likedTracks);
    if (next.has(trackId)) {
      next.delete(trackId);
    } else {
      next.add(trackId);
    }
    setLikedTracks(next);
  };

  if (status === "loading" || !playlist) {
    return <div className="text-white p-10">Loading playlist...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">{playlist.name}</h1>
          <p className="text-white/60 mt-2">{playlist.description}</p>
        </div>

        <div className="space-y-3">
          {playlist.tracks.map((track, idx) => (
            <TrackItem
              key={track.id}
              track={track}
              index={idx}
              isCurrent={playingUrl === track.previewUrl}
              isLoading={isLoading}
              liked={likedTracks.has(track.id)}
              onPlayPause={playPreview}
              onLikeToggle={toggleLike}
            />
          ))}
        </div>

        <audio ref={audioRef} src={playingUrl || undefined} autoPlay className="hidden" />
      </div>
    </>
  );
}