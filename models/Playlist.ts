// models/Playlist.ts
import mongoose from 'mongoose';

const PlaylistSchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  imageUrl: String,
  tracks: Array,
});

export default mongoose.models.Playlist || mongoose.model("Playlist", PlaylistSchema);
