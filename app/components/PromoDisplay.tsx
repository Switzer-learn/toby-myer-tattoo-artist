"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CldImage } from 'next-cloudinary';
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Saira_Stencil_One } from "next/font/google";

const sairaStencilOne = Saira_Stencil_One({ subsets: ['latin'], weight: "400" })

interface Promotion {
    _id: string;
    name: string;
    image: string;
    isActive: boolean;
}

interface PromoDisplayProps {
    promotions: Promotion[];
    onClose: () => void;
}

const PromoDisplay = ({ promotions, onClose }: PromoDisplayProps) => {
    // Filter to only show active promotions
    const activePromotions = promotions.filter(p => p.isActive);
    const [currentIndex, setCurrentIndex] = useState(0);
    const hasMultiple = activePromotions.length > 1;

    const handleNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % activePromotions.length);
    }, [activePromotions.length]);

    const handlePrev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + activePromotions.length) % activePromotions.length);
    }, [activePromotions.length]);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft' && hasMultiple) handlePrev();
            if (e.key === 'ArrowRight' && hasMultiple) handleNext();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [hasMultiple, handleNext, handlePrev, onClose]);

    // Touch/swipe support
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!hasMultiple) return;

        if (touchStart - touchEnd > 75) {
            // Swipe left - next
            handleNext();
        }

        if (touchStart - touchEnd < -75) {
            // Swipe right - previous
            handlePrev();
        }
    };

    // If no active promotions, show "NO PROMO AVAILABLE"
    if (activePromotions.length === 0) {
        return (
            <div
                className="fixed inset-0 z-100 flex items-center justify-center"
                onClick={onClose}
            >
                {/* Black transparent background with blur */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="relative z-10 flex flex-col items-center justify-center gap-8"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* X Button - Top Right */}
                    <button
                        onClick={onClose}
                        className="absolute -top-20 right-0 md:-right-12 z-20 p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all duration-200 group"
                        aria-label="Close"
                    >
                        <X className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:rotate-90 transition-transform duration-300" />
                    </button>

                    {/* No Promo Message */}
                    <h1
                        className={`text-7xl font-bold text-center px-8 tracking-wider bg-[url('/images/assets/overlay.webp')] bg-cover bg-center bg-clip-text text-transparent ${sairaStencilOne.className}`}
                    >
                        NO PROMO AVAILABLE
                    </h1>

                    {/* Next Button */}
                    <button
                        onClick={onClose}
                        className="group relative overflow-hidden"
                        aria-label="Close and continue"
                    >
                        <Image
                            src="/images/components/btn_next.webp"
                            width={120}
                            height={60}
                            alt="Next"
                            className="w-auto h-12 md:h-16 object-contain transition-transform duration-300 group-hover:scale-110"
                        />
                    </button>
                </motion.div>
            </div>
        );
    }

    const currentPromotion = activePromotions[currentIndex];

    return (
        <div
            className="fixed inset-0 z-100 flex items-center justify-center"
            onClick={onClose}
        >
            {/* Black transparent background with blur */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative z-10 w-full h-full md:h-auto md:max-w-4xl md:mx-8"
                onClick={(e) => e.stopPropagation()}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* X Button - Top Right */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 md:-top-12 md:-right-12 z-20 p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all duration-200 group"
                    aria-label="Close"
                >
                    <X className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:rotate-90 transition-transform duration-300" />
                </button>

                {/* Carousel Controls - Only show if multiple promotions */}
                {hasMultiple && (
                    <>
                        {/* Left Arrow */}
                        <button
                            onClick={handlePrev}
                            className="absolute left-4 md:-left-16 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all duration-200"
                            aria-label="Previous promotion"
                        >
                            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-white" />
                        </button>

                        {/* Right Arrow */}
                        <button
                            onClick={handleNext}
                            className="absolute right-4 md:-right-16 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all duration-200"
                            aria-label="Next promotion"
                        >
                            <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-white" />
                        </button>
                    </>
                )}

                {/* Promotion Image with Animation */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3 }}
                        className="relative w-full h-full md:h-auto md:aspect-video rounded-none md:rounded-lg overflow-hidden shadow-2xl cursor-pointer flex items-center justify-center"
                        onClick={() => window.open('https://drive.google.com/file/d/1Csq9L81fkcs6zBQwwhgxUJeKyA0GCeNL/view?usp=drivesdk', '_blank')}
                    >
                        <CldImage
                            src={currentPromotion.image}
                            width={1200}
                            height={675}
                            alt={currentPromotion.name}
                            className="w-full h-full object-contain"
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Pagination Dots */}
                {hasMultiple && (
                    <div className="flex justify-center gap-2 mt-4 md:mt-6">
                        {activePromotions.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                    ? 'bg-white w-8'
                                    : 'bg-white/40 hover:bg-white/60'
                                    }`}
                                aria-label={`Go to promotion ${index + 1}`}
                            />
                        ))}
                    </div>
                )}

                {/* Next Button - Bottom Center */}
                <div className="flex justify-center mt-4 md:mt-8 pb-4 md:pb-0">
                    <button
                        onClick={onClose}
                        className="group relative overflow-hidden"
                        aria-label="Close and continue"
                    >
                        <Image
                            src="/images/components/btn_next.webp"
                            width={120}
                            height={60}
                            alt="Next"
                            className="w-auto h-12 md:h-16 object-contain transition-transform duration-300 group-hover:scale-110"
                        />
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default PromoDisplay;
