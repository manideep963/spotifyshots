import mongoose from 'mongoose';
import { connectToDB } from '@/lib/mongodb';
import Album from '@/models/Album';

const seedAlbums = [
  {
    title: 'Echoes of Now',
    artist: 'Synthwave Dreams',
    genre: 'Synthwave',
    coverUrl: '/covers/echoes.jpg',
    tracks: [
      { title: 'Neon Rush', duration: '3:45', audioUrl: '/tracks/neon.mp3' },
      { title: 'Cyber Breeze', duration: '4:12', audioUrl: '/tracks/cyber.mp3' }
    ]
  },
  {
    title: 'LoFi Universe',
    artist: 'Chillmatic',
    genre: 'Lo-Fi',
    coverUrl: '/covers/lofi.jpg',
    tracks: [
      { title: 'Rainy Notes', duration: '2:54', audioUrl: '/tracks/rainy.mp3' }
    ]
  }
];

async function seed() {
  await connectToDB();
  await Album.deleteMany();
  await Album.insertMany(seedAlbums);
  console.log('Albums Seeded');
  mongoose.connection.close();
}

seed();
