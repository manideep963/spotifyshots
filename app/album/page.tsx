// app/coming-soon/page.tsx
'use client';

import React from 'react';

import Navbar from '@/components/Navbar';

const ComingSoonPage = () => {
  return (
    <>
    <Navbar/>
     <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">

      {/* Main Text */}
      <div className='text-center'>
      <h2 className="text-4xl font-extrabold mb-4">Coming Soon</h2>
      <p className="text-gray-400 text-center max-w-md mb-6">
        We’re working hard to bring you the best music experience. Stay tuned!
      </p>
      </div>
    </div>
    </>
   
  );
};

export default ComingSoonPage;
