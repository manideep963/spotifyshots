// app/api/albums/route.ts
import { connectToDB } from "@/lib/db";
import Track from "@/models/Track";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDB();
  const tracks = await Track.find();
  return NextResponse.json(tracks);
}
