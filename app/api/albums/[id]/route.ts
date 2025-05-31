// app/api/albums/[id]/route.ts
import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongodb'
import mongoose from 'mongoose'
import Album from '@/models/Album'
import Track from '@/models/Track'

export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params
    await connectToDB()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid album ID' }, { status: 400 })
    }

    const album = await Album.findById(id)
    if (!album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 })
    }

    const trackIds = album.tracks.map((tid: string | mongoose.Types.ObjectId) =>
      typeof tid === 'string' ? new mongoose.Types.ObjectId(tid) : tid
    )

    const tracks = await Track.find({ _id: { $in: trackIds } })

    const albumWithTracks = {
      ...album.toObject(),
      tracks,
    }

    return NextResponse.json(albumWithTracks)
  } catch (error) {
    console.error('Error fetching album:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
