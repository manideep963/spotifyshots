// app/api/playlists/[id]/route.ts
import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongodb'
import mongoose from 'mongoose'
import Playlist from '@/models/Playlist'
import Track from '@/models/Track'

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    await connectToDB()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid playlist ID' }, { status: 400 })
    }

    const playlist = await Playlist.findById(id)
    if (!playlist) {
      return NextResponse.json({ error: 'Playlist not found' }, { status: 404 })
    }    // Convert track IDs to ObjectId if needed
    const trackIds = playlist.tracks.map((tid: string | mongoose.Types.ObjectId) =>
      typeof tid === 'string' ? new mongoose.Types.ObjectId(tid) : tid
    )

    const tracks = await Track.find({ _id: { $in: trackIds } })

    // Attach full tracks to playlist
    const playlistWithTracks = {
      ...playlist.toObject(),
      tracks,
    }

    return NextResponse.json(playlistWithTracks)
  } catch (error) {
    console.error('Error fetching playlist:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}