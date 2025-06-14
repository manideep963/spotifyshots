// app/api/albums/route.ts
import { connectToDB} from "@/lib/mongodb";
import Album from "@/models/Album";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDB();
  const albums = await Album.find();
  return NextResponse.json(albums);
}
