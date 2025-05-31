import mongoose from "mongoose";

const albumSchema = new mongoose.Schema({
  name: String,
  imageUrl: String,
  releaseDate: String,
  totalTracks: Number,
  albumType: String,
  spotifyId: String,
  artists: [String],
  tracks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Track" }],
});

export default mongoose.models.Album || mongoose.model("Album", albumSchema);
