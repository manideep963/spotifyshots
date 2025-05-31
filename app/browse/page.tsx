'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Play, Heart, MoreHorizontal, Calendar } from 'lucide-react';
import Navbar from '@/components/Navbar';

type Playlist = {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
};

type Album = {
  _id: string;
  name: string;
  imageUrl: string;
  releaseDate: string;
  artist: string;
};

function getTimeOfDayGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function HomePage() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);

  const toggleLike = (id: string) => {
    const newLiked = new Set(likedItems);
    newLiked.has(id) ? newLiked.delete(id) : newLiked.add(id);
    setLikedItems(newLiked);
  };

  useEffect(() => {
    const fetchData = async () => {
      const [playlistsRes, albumsRes] = await Promise.all([
        fetch('/api/playlist'),
        fetch('/api/albums'),
      ]);

      const [playlistsData, albumsData] = await Promise.all([
        playlistsRes.json(),
        albumsRes.json(),
      ]);

      setPlaylists(playlistsData);
      setAlbums(albumsData);
    };

    fetchData();
  }, []);

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <header className="p-8 pb-6">
        <h1 className="text-4xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          {getTimeOfDayGreeting()}
        </h1>
        <p className="text-gray-400 text-lg">Let’s find something amazing to listen to</p>
      </header>

     
<Section title="Featured Playlists">
  {playlists.map((playlist) => (
    <Link key={playlist._id} href={`/playlist/${playlist._id}`}>
      <Card
        id={`playlist-${playlist._id}`}
        name={playlist.name}
        imageUrl={playlist.imageUrl}
        description={playlist.description}
        isLiked={likedItems.has(playlist._id)}
        onLike={() => toggleLike(playlist._id)}
        hoveredItem={hoveredItem}
        setHoveredItem={setHoveredItem}
      />
    </Link>
  ))}
</Section>

<Section title="New Releases">
  {albums.map((album) => (
    <Link key={album._id} href={`/album/${album._id}`}>
      <Card
        id={`album-${album._id}`}
        name={album.name}
        imageUrl={album.imageUrl}
        description={album.artist}
        extraInfo={formatDate(album.releaseDate)}
        isLiked={likedItems.has(`album-${album._id}`)}
        onLike={() => toggleLike(`album-${album._id}`)}
        hoveredItem={hoveredItem}
        setHoveredItem={setHoveredItem}
      />
    </Link>
  ))}
</Section>


      <div className="h-24" />
    </div>
    </>
    
  );
}

type CardProps = {
  id: string;
  name: string;
  imageUrl: string;
  description?: string;
  extraInfo?: string;
  isLiked: boolean;
  onLike: () => void;
  hoveredItem: string | null;
  setHoveredItem: (id: string | null) => void;
};

function Card({
  id,
  name,
  imageUrl,
  description,
  extraInfo,
  isLiked,
  onLike,
  hoveredItem,
  setHoveredItem,
}: CardProps) {
  const isHovered = hoveredItem === id;

  return (
    <div
      className="group cursor-pointer"
      onMouseEnter={() => setHoveredItem(id)}
      onMouseLeave={() => setHoveredItem(null)}
    >
      <div className="bg-gray-800/40 p-4 rounded-xl hover:bg-gray-700/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
        <div className="relative mb-4">
          <img
            src={imageUrl}
            alt={name}
            className="w-full aspect-square object-cover rounded-lg shadow-lg"
          />
          <div
            className={`absolute bottom-2 right-2 transition-all duration-300 ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            <button className="bg-green-500 text-black p-3 rounded-full hover:bg-green-400 hover:scale-110 transition">
              <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
            </button>
          </div>
        </div>

        <h3 className="font-semibold text-white group-hover:text-green-400 line-clamp-1">
          {name}
        </h3>
        {description && (
          <p className="text-sm text-gray-400 group-hover:text-gray-300 line-clamp-2">{description}</p>
        )}
        {extraInfo && (
          <div className="flex items-center text-xs text-gray-500 mt-1">
            <Calendar className="w-3 h-3 mr-1" />
            {extraInfo}
          </div>
        )}

        <div
          className={`flex items-center justify-between mt-4 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLike();
            }}
            className={`p-2 rounded-full ${
              isLiked ? 'text-green-400 hover:text-green-300' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Heart className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} />
          </button>
          <button className="text-gray-400 hover:text-white p-2 rounded-full">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

function Section({ title, children }: SectionProps) {
  return (
    <section className="px-8 mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">{title}</h2>
        <button className="text-sm text-gray-400 hover:text-white font-medium hover:underline">
          Show all
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {children}
      </div>
    </section>
  );
}
