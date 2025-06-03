// import { connectToDB } from '@/lib/mongodb';
// import Track from '@/models/Track';
// import { NextResponse } from 'next/server';

// export async function GET(req: Request) {
//   await connectToDB();

//   const { searchParams } = new URL(req.url);
//   const page = parseInt(searchParams.get('page') || '1');
//   const limit = 20;
//   const skip = (page - 1) * limit;

//   try {
//     const tracks = await Track.find()
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit);

//     const total = await Track.countDocuments();
//     const hasMore = skip + tracks.length < total;

//     return NextResponse.json({
//       tracks,
//       hasMore, // ✅ include this
//     });

//   } catch (error) {
//     return NextResponse.json({ error: 'Failed to fetch tracks' }, { status: 500 });
//   }
// }
