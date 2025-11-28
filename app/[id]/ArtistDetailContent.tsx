"use client";
import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import Image from "next/image";
import { CldImage } from 'next-cloudinary';
import NavButton from "../components/NavButton";
import { Saira_Stencil_One } from "next/font/google";
import { useState, useEffect } from "react";
import axios from "axios";
import { socialLinks as defaultSocialLinks } from "@/lib/config";

interface Artist {
  id: string;
  name: string;
  photo: string;
  tagline: string;
  gallery: string[];
}

interface ArtistDetailContentProps {
  initialArtist: Artist | null;
}

const sairaStencilOne = Saira_Stencil_One({ subsets: ['latin'], weight: '400' });

const ArtistDetailContent = ({ initialArtist }: ArtistDetailContentProps) => {
  const reduce = useReducedMotion();
  const [socialLinks, setSocialLinks] = useState<any>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get('/api/config');
        if (response.data.success) {
          setSocialLinks(response.data.data.socialMedia);
        }
      } catch (error) {
        console.error('Failed to fetch config:', error);
        setSocialLinks(defaultSocialLinks);
      }
    };
    fetchConfig();
  }, []);

  if (!initialArtist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl">Artist not found</div>
      </div>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
  };

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
      <div className="relative z-10 flex flex-col md:flex-row min-h-screen gap-8 md:gap-12 lg:gap-16 p-4 sm:p-8 md:p-12 lg:p-16 xl:p-20">
        {/* Left Column - Artist Photo and Name */}
        <motion.div
          className="shrink-0 flex flex-col items-center gap-6 md:w-1/3"
          initial={reduce ? undefined : "hidden"}
          animate={reduce ? undefined : "visible"}
          variants={containerVariants}
        >
          {/* Artist Photo */}
          <motion.div
            className="relative w-full h-96 sm:h-80 md:h-96 lg:h-full rounded-lg overflow-hidden shadow-2xl"
            variants={imageVariants}
            whileHover={reduce ? undefined : { scale: 1.05 }}
          >
            <CldImage
              src={initialArtist.photo}
              alt={initialArtist.name}
              fill
              crop="fill"
              gravity="face"
              className="rounded-lg object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Book Button Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/80 to-transparent flex justify-center">
              <a
                href={`${socialLinks?.whatsapp || "https://wa.me/6287777222020"}?text=${encodeURIComponent(`Hi, I want to book with this artist ${initialArtist.name}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`${sairaStencilOne.className} uppercase bg-transparent border border-white hover:bg-black/30 text-white font-bold py-8 px-4 rounded-md shadow-lg transition-colors flex items-center gap-2 text-sm sm:text-base z-20`}
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src="/images/components/btn_whatsapp.webp"
                  alt="WhatsApp"
                  width={24}
                  height={24}
                  className="w-6 h-6 object-contain"
                />
                Book with this artist
              </a>
            </div>
          </motion.div>

          {/* Artist Name */}
          <motion.div variants={itemVariants} className="text-center">
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold drop-shadow-lg uppercase tracking-wider bg-[url('/images/assets/overlay.webp')] bg-cover bg-center bg-clip-text text-transparent ${sairaStencilOne.className}`}>
              {initialArtist.name}
            </h1>
          </motion.div>

          {/* Tagline */}
          <motion.div variants={itemVariants} className="text-center">
            <p className="text-sm md:text-base lg:text-lg text-gray-300 font-semibold uppercase tracking-widest">
              {initialArtist.tagline}
            </p>
          </motion.div>
        </motion.div>

        {/* Right Column - Gallery Grid and NavButton */}
        <motion.div
          className="flex-1 flex flex-col md:w-2/3"
          initial={reduce ? undefined : "hidden"}
          animate={reduce ? undefined : "visible"}
          variants={containerVariants}
        >
          {/* Gallery Grid */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 flex-1 mb-8"
            variants={itemVariants}
          >
            {initialArtist.gallery.map((imageUrl: string, index: number) => (
              <motion.div
                key={index}
                className="relative w-full aspect-square rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
                whileHover={reduce ? undefined : { scale: 1.05 }}
                whileTap={reduce ? undefined : { scale: 0.95 }}
              >
                <CldImage
                  src={imageUrl}
                  alt={`${initialArtist.name} portfolio ${index + 1}`}
                  fill
                  crop="fill"
                  className="rounded-lg object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom Right - NavButton and Tagline Text */}
          <motion.div
            className="flex flex-col items-end gap-4"
            variants={itemVariants}
          >
            {/* All Pain No Regrets Text */}
            <Image
              src="/images/assets/txt_allPainNoRegrets.webp"
              width={300}
              height={100}
              alt="All Pain No Regrets"
              className="w-auto h-16 md:h-20 lg:h-24 object-contain"
            />

            {/* NavButton */}
            <div className="flex justify-end">
              <NavButton />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ArtistDetailContent;
