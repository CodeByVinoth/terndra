import React, { useRef, useEffect, useState } from "react";
import { Star } from "lucide-react";

const testimonials = [
  { id: 1, rating: 5, text: "Booking was so simple, and the driver was professional.", author: "Ananya R., Bangalore" },
  { id: 2, rating: 5, text: "Loved the transparency in pricing. No hidden charges.", author: "Rahul S., Chennai" },
  { id: 3, rating: 5, text: "We customized our van with music and lighting — it felt like a party on wheels!", author: "Priya M., Coimbatore" },
  { id: 4, rating: 5, text: "Amazing service, very punctual and courteous staff.", author: "Vikram K., Hyderabad" },
  { id: 5, rating: 5, text: "Highly recommend for family trips, very comfortable journey.", author: "Sana L., Mumbai" },
];

const Testimonials = () => {
  const containerRef = useRef(null);
  const [xPos, setXPos] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const speed = 0.8; // smaller = slower

  const totalWidth = testimonials.length * 370; // width of one card + gap (~370px)

  useEffect(() => {
    let animationFrame;

    const scroll = () => {
      if (!isPaused) {
        setXPos((prev) => {
          let next = prev - speed;
          if (Math.abs(next) >= totalWidth) next = 0; // reset seamlessly
          return next;
        });
      }
      animationFrame = requestAnimationFrame(scroll);
    };

    scroll();

    return () => cancelAnimationFrame(animationFrame);
  }, [isPaused]);

  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-[1300px] mx-auto px-4">
        <h2 className="text-2xl font-medium text-gray-800 mb-8 text-center">
          What Our Travelers Say
        </h2>

        <div
          className="overflow-hidden cursor-pointer"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            ref={containerRef}
            className="flex gap-6"
            style={{ transform: `translateX(${xPos}px)` }}
          >
            {[...testimonials, ...testimonials].map((t, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-xl p-6 w-[350px] min-h-[180px] shadow-sm flex-shrink-0"
              >
                <div className="flex gap-1 mb-2">
                  {[...Array(t.rating)].map((_, idx) => (
                    <Star
                      key={idx}
                      className="w-5 h-4 fill-[#FBB040] text-[#FBB040]"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-2">{t.text}</p>
                <p className="text-gray-800 font-medium">{t.author}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
