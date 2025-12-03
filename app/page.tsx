'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Mr_Dafoe, Caveat, Blaka } from 'next/font/google';

const mrDafoe = Mr_Dafoe({ subsets: ['latin'], weight: ['400'] });
const caveat = Caveat({ subsets: ['latin'], weight: ['400'] });
const frederickaTheGreat = Blaka({ subsets: ['latin'], weight: ['400'] });

export default function Home() {
  return (
    <main className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/assets/wall_bg_tattoo.webp"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-12 px-4 text-center">
        {/* Welcome Text with Metal Gradient and Outline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-tight"
          style={{
            background: 'linear-gradient(to bottom, #C0C0C0 0%, #E8E8E8 25%, #808080 50%, #E8E8E8 75%, #C0C0C0 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            WebkitTextStroke: '1px rgba(255, 255, 255, 0.3)',
            filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.8))'
          }}
        >
          <span className={`text-white ${caveat.className}`}>Welcome to</span><br /><span className={`text-white tracking-widest font-extrabold`}>BALI TATTOO HEROES</span>
        </motion.h1>

        {/* Enter Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Link
            href="/artists"
            className="group relative inline-flex animate-bounce items-center justify-center px-12 py-4 text-xl font-bold text-white transition-all duration-300 ease-in-out bg-red-900/80 hover:bg-red-800 border-2 border-red-700/50 hover:border-red-600 rounded-sm tracking-[0.2em]"
          >
            <span className="relative z-10 group-hover:scale-105 transition-transform duration-300">ENTER</span>
            <div className="absolute inset-0 h-full w-full scale-0 rounded-sm transition-all duration-300 group-hover:scale-100 group-hover:bg-red-800/50" />
          </Link>
        </motion.div>
      </div>
    </main>
  );
}