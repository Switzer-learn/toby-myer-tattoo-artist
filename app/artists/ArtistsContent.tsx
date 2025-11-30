"use client";
import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import ArtistFrame from "../components/ArtistFrame";
import NavButton from "../components/NavButton";

interface Artist {
  id: string;
  name: string;
  photo: string;
  tagline: string;
}

interface ArtistsContentProps {
  artists: Artist[];
}

const ArtistsContent = ({ artists }: ArtistsContentProps) => {
  const reduce = useReducedMotion();
  const [columns, setColumns] = useState(2);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleResize = () => {
      const width = window.innerWidth;
      let newCols = 2;
      if (width >= 1280) {
        newCols = 5; // xl
      } else if (width >= 1024) {
        newCols = 4; // lg
      } else if (width >= 768) {
        newCols = 3; // md
      }

      setColumns(newCols);
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Animation variants for header elements
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  };

  // Animation variants for artist frames
  const artistVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 }
  };

  // Animation variants for navigation button
  const navVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Transform artists data for ArtistFrame component
  const artistsForDisplay = artists.map((artist) => ({
    image: artist.photo,
    name: artist.name,
    link: `/${artist.id}`,
  }));

  // Calculate empty slots
  const totalRows = Math.ceil(artistsForDisplay.length / columns);
  const totalSlots = totalRows * columns;
  const emptySlotsCount = totalSlots - artistsForDisplay.length;
  const emptySlots = Array.from({ length: emptySlotsCount });

  return (
    <section className="min-h-screen min-w-screen relative">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/assets/bg-5.webp"
          fill
          objectFit="cover"
          alt="Background Image"
          className="z-0 absolute"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/80" />
      </div>

      {/* Main Content Container */}
      <div className="flex flex-col w-full h-full min-h-screen items-center relative z-10 justify-between">
        {/* Header Section */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-5 py-4 md:py-8 w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 overflow-hidden"
          initial={reduce ? undefined : "hidden"}
          animate={reduce ? undefined : "visible"}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Page Title - Order 3 on mobile, Order 1 on desktop */}
          <motion.div
            variants={headerVariants}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-3 md:order-1"
          >
            <Image
              src="/images/assets/txt_ourArtist.webp"
              width={500}
              height={500}
              className="w-auto h-12 md:h-16 lg:h-24 xl:h-32 2xl:h-48 object-contain shrink-0"
              alt="Our Artists Text"
            />
          </motion.div>

          {/* Logo - Order 1 on mobile, Order 2 on desktop */}
          <motion.div
            variants={headerVariants}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={reduce ? undefined : { scale: 1.05, rotate: 2 }}
            whileTap={reduce ? undefined : { scale: 0.95 }}
            className="order-1 md:order-2"
          >
            <Image
              src="/images/logo_tattoo_noBG.webp"
              width={500}
              height={500}
              className="w-auto h-24 md:h-32 lg:h-48 xl:h-64 2xl:h-80 object-contain shrink-0"
              alt="Tattoo Logo"
            />
          </motion.div>

          {/* Slogan - Order 2 on mobile, Order 3 on desktop */}
          <motion.div
            variants={headerVariants}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="order-2 md:order-3"
          >
            <Image
              src="/images/assets/txt_allPainNoRegrets.webp"
              width={500}
              height={500}
              className="w-auto h-12 md:h-16 lg:h-24 xl:h-32 2xl:h-48 object-contain shrink-0"
              alt="Slogan"
            />
          </motion.div>
        </motion.div>

        {/* Artists Grid - Optimized for ArtistFrame component */}
        <div className="flex-1 flex items-center justify-center w-full px-2 sm:px-6 md:px-8 lg:px-10 xl:px-12 pb-24">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-10 justify-items-center w-full max-w-md md:max-w-none"
            initial={reduce ? undefined : "hidden"}
            animate={reduce ? undefined : "visible"}
            transition={{ staggerChildren: 0.1, delayChildren: 0.6 }}
          >
            {artistsForDisplay.map((artist, index) => (
              <motion.div key={index} variants={artistVariants} className="w-full">
                <ArtistFrame artist={artist} />
              </motion.div>
            ))}
            {/* Render Empty Frames */}
            {emptySlots.map((_, index) => (
              <motion.div
                key={`empty-${index}`}
                variants={artistVariants}
                initial="visible"
                animate="visible"
                className="w-full"
              >
                <ArtistFrame isEmpty={true} />
              </motion.div>
            ))}
          </motion.div>
        </div>


        {/* Navigation Button */}
        <motion.div
          className="flex justify-center lg:justify-end w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 pb-4"
          initial={reduce ? undefined : "hidden"}
          animate={reduce ? undefined : "visible"}
          variants={navVariants}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <NavButton />
        </motion.div>

      </div>
    </section>
  );
};

export default ArtistsContent;
