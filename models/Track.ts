import mongoose from "mongoose";

const trackSchema = new mongoose.Schema({
  name: String,
  previewUrl: String,
  durationMs: Number,
  spotifyId: String,
});

export default mongoose.models.Track || mongoose.model("Track", trackSchema);
