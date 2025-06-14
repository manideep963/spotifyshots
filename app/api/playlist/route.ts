// app/api/playlists/route.ts
import { connectToDB } from "@/lib/mongodb";
import Playlist from "@/models/Playlist";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDB();
  const playlists = await Playlist.find();
  return NextResponse.json(playlists);
}
 