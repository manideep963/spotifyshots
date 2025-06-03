// models/song.ts
import mongoose, { Schema, models, model } from 'mongoose';

const SongSchema = new Schema({
  title: { type: String, required: true },
  artist: String,
  album: String,
  duration: Number,
  previewUrl: String, // URL to the audio preview
  imageUrl: String,
  spotifyUrl: String,
}, { timestamps: true }); 

const Song = models.Song || model('Song', SongSchema);

export default Song;
