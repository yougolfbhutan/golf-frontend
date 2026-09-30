"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Expand } from "lucide-react";

// ---------- Types ----------
interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption?: string;
}

interface Course {
  id: string;
  name: string;
  // Exactly 3 images per course, used for the collage: [large, small-top, small-bottom]
  images: [GalleryImage, GalleryImage, GalleryImage];
}

// ---------- Sample data (replace with your real courses/images) ----------
const courses: Course[] = [
  {
    id: "web-development",
    name: "Web Development",
    images: [
      { id: "wd-1", src: "/gallery-4.jpg", alt: "Students coding on laptops", caption: "HTML & CSS Basics" },
      { id: "wd-2", src: "/gallery-4.jpg", alt: "JavaScript workshop", caption: "JavaScript Workshop" },
      { id: "wd-3", src: "/gallery-4.jpg", alt: "React project demo", caption: "React Project Demo" },
    ],
  },
  {
    id: "ui-ux-design",
    name: "UI/UX Design",
    images: [
      { id: "ux-1", src: "/gallery-4.jpg", alt: "Wireframing session", caption: "Wireframing Basics" },
      { id: "ux-2", src: "/gallery-4.jpg", alt: "Figma prototyping", caption: "Figma Prototyping" },
      { id: "ux-3", src: "/gallery-4.jpg", alt: "User research interview", caption: "User Research" },
    ],
  },
];

// ---------- Reusable collage tile ----------
function CollageTile({
  image,
  className,
  onOpen,
  priority = false,
}: {
  image: GalleryImage;
  className?: string;
  onOpen: (img: GalleryImage) => void;
  priority?: boolean;
}) {
  return (
    <Card
      className={`group overflow-hidden border-0 shadow-md hover:shadow-xl transition-shadow duration-300 py-0 rounded-xl sm:rounded-2xl ${className ?? ""}`}
    >
      <CardContent className="p-0 h-full">
        <button
          type="button"
          onClick={() => onOpen(image)}
          className="relative w-full h-full overflow-hidden block cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 rounded-xl sm:rounded-2xl"
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/0 to-emerald-950/0 group-hover:from-emerald-950/30 transition-colors duration-300" />

          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-1.5 sm:p-2 shadow-sm">
              <Expand className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-800" />
            </div>
          </div>

          {image.caption && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-2 sm:p-3 pt-8">
              <p className="text-white text-xs sm:text-sm font-medium text-left truncate">
                {image.caption}
              </p>
            </div>
          )}
        </button>
      </CardContent>
    </Card>
  );
}

// ---------- Component ----------
export default function CourseGalleryTabs() {
  const [activeTab, setActiveTab] = useState(courses[0].id);
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);

  // Animated underline indicator for the active tab
  const tabListRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });

  useEffect(() => {
    const updateIndicator = () => {
      const activeEl = triggerRefs.current[activeTab];
      const listEl = tabListRef.current;
      if (activeEl && listEl) {
        const listRect = listEl.getBoundingClientRect();
        const elRect = activeEl.getBoundingClientRect();
        setIndicatorStyle({
          left: elRect.left - listRect.left,
          width: elRect.width,
        });
      }
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeTab]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Tabs
        defaultValue={courses[0].id}
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList
          ref={tabListRef}
          className="relative flex w-full sm:w-auto sm:inline-flex gap-1 h-auto p-1.5 bg-emerald-50/80 backdrop-blur-sm border border-emerald-100 rounded-full shadow-sm mx-auto"
        >
          {/* Sliding active-tab pill */}
          <div
            className="absolute top-1.5 bottom-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 shadow-md transition-all duration-300 ease-out"
            style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
            aria-hidden="true"
          />

          {courses.map((course) => (
            <TabsTrigger
              key={course.id}
              value={course.id}
              ref={(el) => {
                triggerRefs.current[course.id] = el;
              }}
              className="relative z-10 flex-1 sm:flex-none px-4 sm:px-6 py-2.5 text-sm sm:text-base font-medium rounded-full text-emerald-900 transition-colors duration-300 whitespace-nowrap data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              {course.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {courses.map((course) => (
          <TabsContent key={course.id} value={course.id} className="mt-6 sm:mt-8 focus-visible:outline-none">
            {/* 3-image collage: large left tile + two stacked right tiles.
                Stacks into a simple column on very small screens. */}
            <div
              className="
                grid grid-cols-1 grid-rows-3 gap-3
                sm:grid-cols-2 sm:grid-rows-2 sm:gap-4
                h-[560px] sm:h-[420px] md:h-[480px] lg:h-[520px]
                animate-in fade-in duration-500
              "
            >
              <CollageTile
                image={course.images[0]}
                onOpen={setLightboxImage}
                priority
                className="row-span-1 sm:row-span-2"
              />
              <CollageTile image={course.images[1]} onOpen={setLightboxImage} />
              <CollageTile image={course.images[2]} onOpen={setLightboxImage} />
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Lightbox */}
      <Dialog open={!!lightboxImage} onOpenChange={(open) => !open && setLightboxImage(null)}>
        <DialogContent className="max-w-3xl w-[95vw] sm:w-full p-0 overflow-hidden bg-black border-0 rounded-xl sm:rounded-2xl">
          {lightboxImage && (
            <div className="relative w-full aspect-square sm:aspect-video md:aspect-[4/3]">
              <Image
                src={lightboxImage.src}
                alt={lightboxImage.alt}
                fill
                sizes="100vw"
                className="object-contain"
              />
              {lightboxImage.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                  <p className="text-white text-sm font-medium">{lightboxImage.caption}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}