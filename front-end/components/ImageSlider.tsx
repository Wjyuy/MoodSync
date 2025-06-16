import { useEffect, useState } from "react";

const images = [
  "/images/banner1.png",
  "/images/banner2.png",
  "/images/banner3.png",
];

export default function ImageSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 6000); // 8초마다 슬라이드

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`slide-${index}`}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            current === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}
