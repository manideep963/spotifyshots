"use client";
import React, { useState } from "react";
import { Play, Pause, Heart, ExternalLink } from "lucide-react";

type Track = {
  id: string;
  name: string;
  previewUrl: string | null;
  artists: { name?: string }[] | string[];
  spotifyId?: string;
};

type Props = {
  track: Track;
  index: number;
  isCurrent: boolean;
  isLoading: boolean;
  liked: boolean;
  onPlayPause: (url: string | null) => void;
  onLikeToggle: (id: string) => void;
};

export default function TrackItem({
  track,
  index,
  isCurrent,
  isLoading,
  liked,
  onPlayPause,
  onLikeToggle,
}: Props) {
  const [hovered, setHovered] = useState(false);

  const getArtistNames = (artists: { name?: string }[] | string[]) =>
    Array.isArray(artists)
      ? artists.map((a) => (typeof a === "string" ? a : a.name || "Unknown")).join(", ")
      : "Unknown";

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-md ${
        isCurrent ? "bg-white/10" : "hover:bg-white/5"
      } transition`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center space-x-4">
        {hovered && track.previewUrl ? (
          <button
            onClick={() => onPlayPause(track.previewUrl)}
            disabled={isLoading}
            className="text-white hover:text-green-400"
          >
            {isLoading && isCurrent ? (
              <div className="animate-spin w-4 h-4 border-b-2 border-green-400 rounded-full" />
            ) : isCurrent ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </button>
        ) : (
          <span className="text-white/60">{index + 1}</span>
        )}
        <div>
          <div className="font-medium">{track.name}</div>
          <div className="text-sm text-white/60">{getArtistNames(track.artists)}</div>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => onLikeToggle(track.id)}
          className={`text-white/60 hover:text-white ${
            liked ? "text-green-400" : ""
          } transition-colors`}
        >
          <Heart fill={liked ? "currentColor" : "none"} className="w-4 h-4" />
        </button>
        {track.spotifyId && (
          <a
            href={`https://open.spotify.com/track/${track.spotifyId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 hover:text-white transition"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
}
