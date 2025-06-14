// 'use client';

// import { useEffect, useState, useCallback, useRef } from 'react';
// import Navbar from '../../components/Navbar';

// interface Track {
//   _id: string;
//   name: string;
//   artists: string[];
//   previewUrl?: string;
// }

// export default function AllSongsPage() {
//   const [tracks, setTracks] = useState<Track[]>([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const loaderRef = useRef<HTMLDivElement | null>(null);

//   const loadTracks = useCallback(async () => {
//     if (!hasMore) return;

//     try {
//       const res = await fetch(`/api/tracks?page=${page}`);
//       const data: Track[] = await res.json();

//       console.log('API response:', data);

//       if (res.ok) {
//         setTracks(prev => [...prev, ...data]);

//         // Stop if no more tracks are returned
//         if (data.length === 0) {
//           setHasMore(false);
//         }
//       } else {
//         console.error('API error:', data);
//         setHasMore(false);
//       }
//     } catch (error) {
//       console.error('Fetch error:', error);
//       setHasMore(false);
//     }
//   }, [page, hasMore]);

//   useEffect(() => {
//     loadTracks();
//   }, [loadTracks]);

//   useEffect(() => {
//     const observer = new IntersectionObserver(entries => {
//       if (entries[0].isIntersecting && hasMore) {
//         setPage(prev => prev + 1);
//       }
//     });

//     const currentLoader = loaderRef.current;
//     if (currentLoader) {
//       observer.observe(currentLoader);
//     }

//     return () => {
//       if (currentLoader) {
//         observer.unobserve(currentLoader);
//       }
//     };
//   }, [hasMore]);

//   return (
//     <>
//       <Navbar />
//       <main className="p-6 max-w-3xl mx-auto">
//         <h1 className="text-2xl font-bold mb-6">All Songs</h1>
//         <ul className="space-y-4">
//           {tracks.map(track => (
//             <li key={track._id} className="border p-4 rounded-lg shadow-sm">
//               <p className="font-medium">{track.name}</p>
//               <p className="text-sm text-gray-500">By: {track.artists.join(', ')}</p>
//               {track.previewUrl ? (
//                 <audio controls src={track.previewUrl} className="mt-2 w-full" />
//               ) : (
//                 <p className="text-sm text-red-500 mt-2">No preview available</p>
//               )}
//             </li>
//           ))}
//         </ul>
//         {hasMore && (
//           <div ref={loaderRef} className="text-center mt-6 text-gray-500">
//             Loading more...
//           </div>
//         )}
//       </main>
//     </>
//   );
// }



