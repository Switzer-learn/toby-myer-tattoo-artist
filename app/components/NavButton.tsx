"use client";

import Image from "next/image";
import { socialLinks } from "@/lib/config";
import axios from 'axios';
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PromoDisplay from "./PromoDisplay";

interface NavButtonProps {
    /**
     * Layout type for responsive behavior:
     * - 'flexible': Uses flex-row at xl (for full-width containers like Gallery, Merchandise, About, FAQ, Our Artists)
     * - 'constrained': Stays flex-col at xl, only flex-row at 2xl (for Contact)
     * - 'column-only': Always stays flex-col at all breakpoints (for Menu)
     */
    layout?: 'flexible' | 'constrained' | 'column-only';
}

const NavButton = ({ layout = 'flexible' }: NavButtonProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [socialLinks, setSocialLinks] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showPromo, setShowPromo] = useState(false);
    const [promotions, setPromotions] = useState<any[]>([]);

    const toggleMenu = () => setIsOpen(!isOpen);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    // Fetch social links and promotions from database
    useEffect(() => {
        fetchConfig();
        fetchPromotions();
    }, []);

    const fetchConfig = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/config');
            if (response.data.success) {
                setSocialLinks(response.data.data.socialMedia);
            }
        } catch (error) {
            console.error('Failed to fetch config:', error);
            // Fallback to static config
            setSocialLinks(socialLinks);
        } finally {
            setLoading(false);
        }
    };

    const fetchPromotions = async () => {
        try {
            const response = await axios.get('/api/promotion');
            if (response.data.success && response.data.data.length > 0) {
                setPromotions(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch promotions:', error);
        }
    };

    const handlePromoClick = () => {
        setShowPromo(true);
    };

    const handleClosePromo = () => {
        setShowPromo(false);
    };

    const primaryGroup1 = [
        { menu: "BOOK NOW", link: "/contact", imageName: "btn_bookNow.webp", target: "_blank" },
        { menu: "TATTOO NEWS", link: "https://balitattoonews.com", imageName: "btn_tattooNews.webp", target: "_blank" },
        { menu: "PROMO", action: handlePromoClick, imageName: "btn_Promo.webp", isButton: true },
    ];

    const primaryGroup2 = [
        { menu: "HOME", link: "/menu", imageName: "btn_home.webp", target: "_self" },
        { menu: "WHATSAPP", link: socialLinks?.whatsapp || "https://wa.me/6287777222020", imageName: "btn_whatsapp.webp", target: "_blank" },
        { menu: "EMAIL", link: socialLinks?.email, imageName: "btn_email.webp", target: "_blank" },
    ];

    const secondaryMenu = [
        { menu: "FACEBOOK", link: socialLinks?.facebook || "https://facebook.com/profile.php?id=61584087054163", imageName: "btn_fb.webp" },
        { menu: "INSTAGRAM", link: socialLinks?.instagram || "https://instagram.com/commandos18tattoobali", imageName: "btn_ig.webp" },
        { menu: "WEBSITE", link: socialLinks?.website || "https://commandos18tattoo.com", imageName: "btn_web.webp" },
        { menu: "YOUTUBE", link: socialLinks?.youtube || "https://www.youtube.com/@commandos18tattoobali", imageName: "btn_yt.webp" },
        { menu: "TIKTOK", link: socialLinks?.tiktok || "https://www.tiktok.com/@commandos18tattoobali", imageName: "btn_tiktok.webp" },
        { menu: "LinkTree", link: socialLinks?.linktree || "/", imageName: "btn_linktree.webp" },
    ];

    // Determine flex classes based on layout type
    const flexClasses = layout === 'flexible'
        ? "relative flex flex-col md:flex-row gap-2 justify-center items-center flex-wrap"
        : layout === 'constrained'
            ? "relative flex flex-col md:flex-row gap-2 justify-center items-center flex-wrap"
            : "relative flex flex-col gap-2 3xl:flex-row justify-center items-center"; // column-only

    return (
        <div className={flexClasses} ref={menuRef}>
            {/* Group 1: Book Now, Tattoo News, Promo */}
            <div className="flex flex-row gap-2 justify-center items-center">
                {primaryGroup1.map((item, index) => (
                    item.isButton ? (
                        <button
                            key={`g1-${index}`}
                            onClick={item.action}
                            className={`relative h-12 md:h-14 xl:h-16 shrink-0 hover:scale-110 transition-transform cursor-pointer ${item.menu === "PROMO" ? "drop-shadow-[0_0_10px_rgba(225,0,0,1)] animate-bounce" : ""
                                }`}
                        >
                            <Image
                                src={`/images/components/${item.imageName}`}
                                alt={item.menu}
                                width={200}
                                height={200}
                                className="w-auto h-full object-contain relative z-10"
                            />
                        </button>
                    ) : (
                        <a
                            key={`g1-${index}`}
                            href={item.link}
                            target={item.target}
                            rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
                            className="relative h-12 md:h-14 xl:h-16 shrink-0 hover:scale-110 transition-transform"
                        >
                            <Image
                                src={`/images/components/${item.imageName}`}
                                alt={item.menu}
                                width={200}
                                height={200}
                                className="w-auto h-full object-contain"
                            />
                        </a>
                    )
                ))}
            </div>

            {/* Group 2: Home, WA, Email, Hamburger */}
            <div className="flex flex-row gap-2 justify-center items-center">
                {primaryGroup2.map((item, index) => (
                    <a
                        key={`g2-${index}`}
                        href={item.link}
                        target={item.target}
                        rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
                        className="relative h-12 md:h-14 xl:h-16 shrink-0 hover:scale-110 transition-transform"
                    >
                        <Image
                            src={`/images/components/${item.imageName}`}
                            alt={item.menu}
                            width={200}
                            height={200}
                            className="w-auto h-full object-contain"
                        />
                    </a>
                ))}

                {/* Hamburger Button */}
                <button
                    onClick={toggleMenu}
                    className="relative h-12 md:h-14 xl:h-16 shrink-0 hover:scale-110 transition-transform focus:outline-none"
                >
                    <Image
                        src={`/images/components/${isOpen ? "btn_x.webp" : "btn_hamburger.webp"}`}
                        alt="Menu"
                        width={200}
                        height={200}
                        className="w-auto h-full object-contain"
                    />
                </button>
            </div>

            {/* Drop Up Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl z-50 min-w-[280px]"
                    >
                        <div className="flex flex-wrap justify-center gap-4">
                            {secondaryMenu.map((item, index) => (
                                <a
                                    key={index}
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="relative w-14 h-14 hover:scale-110 transition-transform"
                                >
                                    <Image
                                        src={`/images/components/${item.imageName}`}
                                        alt={item.menu}
                                        width={100}
                                        height={100}
                                        className="w-full h-full object-contain"
                                    />
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* PromoDisplay Modal */}
            {showPromo && promotions.length > 0 && (
                <PromoDisplay
                    promotions={promotions}
                    onClose={handleClosePromo}
                />
            )}
        </div>
    );
};

export default NavButton;
