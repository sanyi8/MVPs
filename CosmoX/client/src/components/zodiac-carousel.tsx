import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ZodiacCard } from "./zodiac-card";
import type { ZodiacProfile } from "@shared/schema";

interface ZodiacCarouselProps {
  zodiacProfile: ZodiacProfile;
  selectedSystems?: Set<string>;
}

export function ZodiacCarousel({ zodiacProfile, selectedSystems }: ZodiacCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const allSystems = selectedSystems || new Set(['western', 'chinese', 'vedic', 'mayan', 'celtic', 'arabic']);
  const [activeIndex, setActiveIndex] = useState(0);

  const systemsArray = [
    { key: 'western', color: '#00f0ff', label: 'Western' },
    { key: 'chinese', color: '#ff0032', label: 'Chinese' },
    { key: 'vedic', color: '#8f00ff', label: 'Vedic' },
    { key: 'arabic', color: '#ffa700', label: 'Arabic' },
    { key: 'mayan', color: '#c6866d', label: 'Mayan' },
    { key: 'celtic', color: '#00ff59', label: 'Celtic' },
  ].filter(system => allSystems.has(system.key));

  const scrollToCard = (index: number) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    // Immediately update the active index
    setActiveIndex(index);

    const cardWidth = 320; // 80 * 4 (w-80 = 320px)
    const gap = 16; // space-x-4 = 16px
    const carouselWidth = carousel.clientWidth;
    const padding = 16; // pl-4 = 16px
    
    // Calculate scroll position to center the card
    const scrollPosition = (index * (cardWidth + gap)) + padding - (carouselWidth / 2) + (cardWidth / 2);
    
    carousel.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    const handleScroll = () => {
      const cardWidth = 320;
      const gap = 16;
      const padding = 16;
      const carouselWidth = carousel.clientWidth;
      const scrollPosition = carousel.scrollLeft;
      
      // Calculate which card is closest to center
      const centerOffset = (carouselWidth / 2) - (cardWidth / 2);
      const adjustedScroll = scrollPosition - padding + centerOffset;
      const currentIndex = Math.max(0, Math.min(
        systemsArray.length - 1,
        Math.round(adjustedScroll / (cardWidth + gap))
      ));
      
      setActiveIndex(currentIndex);
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDown = true;
      startX = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
      carousel.style.cursor = "grabbing";
    };

    const handleMouseLeave = () => {
      isDown = false;
      carousel.style.cursor = "grab";
    };

    const handleMouseUp = () => {
      isDown = false;
      carousel.style.cursor = "grab";
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 2;
      carousel.scrollLeft = scrollLeft - walk;
    };

    // Touch events for mobile
    let touchStartX = 0;
    let touchScrollLeft = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchScrollLeft = carousel.scrollLeft;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartX) return;
      const touchX = e.touches[0].clientX;
      const walk = (touchStartX - touchX) * 1.5;
      carousel.scrollLeft = touchScrollLeft + walk;
    };

    const handleTouchEnd = () => {
      touchStartX = 0;
    };

    carousel.addEventListener("mousedown", handleMouseDown);
    carousel.addEventListener("mouseleave", handleMouseLeave);
    carousel.addEventListener("mouseup", handleMouseUp);
    carousel.addEventListener("mousemove", handleMouseMove);
    carousel.addEventListener("touchstart", handleTouchStart);
    carousel.addEventListener("touchmove", handleTouchMove);
    carousel.addEventListener("touchend", handleTouchEnd);
    carousel.addEventListener("scroll", handleScroll);

    carousel.style.cursor = "grab";

    return () => {
      carousel.removeEventListener("mousedown", handleMouseDown);
      carousel.removeEventListener("mouseleave", handleMouseLeave);
      carousel.removeEventListener("mouseup", handleMouseUp);
      carousel.removeEventListener("mousemove", handleMouseMove);
      carousel.removeEventListener("touchstart", handleTouchStart);
      carousel.removeEventListener("touchmove", handleTouchMove);
      carousel.removeEventListener("touchend", handleTouchEnd);
      carousel.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Your Zodiac Systems</h3>
      </div>

      <div
        ref={carouselRef}
        className="overflow-x-auto pb-4 scroll-smooth scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <motion.div
          className="flex space-x-4 pl-4 pr-8"
          style={{ width: "max-content" }}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {allSystems.has('western') && <ZodiacCard type="western" data={zodiacProfile.western} />}
          {allSystems.has('chinese') && <ZodiacCard type="chinese" data={zodiacProfile.chinese} />}
          {allSystems.has('vedic') && <ZodiacCard type="vedic" data={zodiacProfile.vedic} />}
          {allSystems.has('arabic') && <ZodiacCard type="arabic" data={zodiacProfile.arabic} />}
          {allSystems.has('mayan') && <ZodiacCard type="mayan" data={zodiacProfile.mayan} />}
          {allSystems.has('celtic') && <ZodiacCard type="celtic" data={zodiacProfile.celtic} />}
        </motion.div>
      </div>

      {/* Navigation Dots */}
      <div className="flex items-center justify-center gap-3 mt-4">
        {systemsArray.map((system, index) => (
          <button
            key={system.key}
            onClick={() => scrollToCard(index)}
            className="flex flex-col items-center gap-1 transition-all hover:scale-110"
            aria-label={`Navigate to ${system.label}`}
          >
            <div
              className="rounded-full transition-all duration-300"
              style={{
                width: activeIndex === index ? '12px' : '8px',
                height: activeIndex === index ? '12px' : '8px',
                backgroundColor: system.color,
                opacity: activeIndex === index ? 1 : 0.5,
                boxShadow: activeIndex === index ? `0 0 8px ${system.color}` : 'none'
              }}
            />
            <span 
              className="text-[10px] font-medium transition-opacity"
              style={{ 
                color: system.color,
                opacity: activeIndex === index ? 1 : 0.5
              }}
            >
              {system.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
