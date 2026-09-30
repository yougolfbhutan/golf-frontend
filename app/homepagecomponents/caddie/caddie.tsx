import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type Caddie = {
  name: string;
  role: string;
  course: string;
  years: number;
  languages: string[];
  image: string;
};

const caddies: Caddie[] = [
  {
    name: "Tashi Dorji",
    role: "Head Caddie",
    course: "Chubachu Course",
    years: 12,
    languages: ["Dzongkha", "English"],
    image: "/gallery-1.jpg",
  },
  {
    name: "Pema Wangmo",
    role: "Course Specialist",
    course: "Dechen Phodrang",
    years: 8,
    languages: ["Dzongkha", "English", "Hindi"],
    image: "/gallery-1.jpg",
  },
  {
    name: "Karma Tenzin",
    role: "Caddie",
    course: "Chubachu Course",
    years: 5,
    languages: ["Dzongkha", "English"],
    image: "/gallery-1.jpg",
  },
  {
    name: "Sonam Choden",
    role: "Caddie",
    course: "Dechen Phodrang",
    years: 6,
    languages: ["Dzongkha", "English"],
    image: "/gallery-1.jpg",
  },
  {
    name: "Ugyen Rinzin",
    role: "Junior Caddie",
    course: "Chubachu Course",
    years: 2,
    languages: ["Dzongkha", "English"],
    image: "/gallery-1.jpg",
  },
  {
    name: "Dechen Lhamo",
    role: "Caddie",
    course: "Dechen Phodrang",
    years: 4,
    languages: ["Dzongkha", "English", "Nepali"],
    image: "/gallery-1.jpg",
  },
];

function CaddieCard({ caddie }: { caddie: Caddie }) {
  return (
    <div className="group">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm">
        <Image
          src={caddie.image}
          alt={caddie.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-900/70 to-transparent p-4">
          <p className="text-xs font-semibold tracking-[0.14em] text-cream/90">
            {caddie.years} {caddie.years === 1 ? "YEAR" : "YEARS"} EXPERIENCE
          </p>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="font-display text-xl italic text-ink-900">
          {caddie.name}
        </h4>
        <p className="mt-1 text-sm text-moss-600">{caddie.role}</p>
        <p className="mt-2 text-sm text-slate-600">{caddie.course}</p>

        <ul className="mt-3 flex flex-wrap gap-2">
          {caddie.languages.map((lang) => (
            <li
              key={lang}
              className="rounded-full border border-hairline px-3 py-1 text-xs text-ink-700"
            >
              {lang}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function CaddieRoster() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-6xl px-6 py-14 sm:px-8 sm:py-20 lg:px-12">
        {/* Header */}
        <header className="flex flex-col gap-6 border-b border-hairline pb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-clay">
              THE TEAM
            </p>
            <h2 className="mt-2 font-display text-4xl italic text-ink-900 sm:text-5xl">
              Meet Your Caddies
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-slate-600 sm:text-right">
            Local guides who know every willow root and river bend on the
            Thimphu Chu courses by heart.
          </p>
        </header>

        {/* Caddie slider */}
        <div className="pt-14 lg:pt-20">
          <Carousel opts={{ align: "start", loop: false }} className="w-full">
            <CarouselContent className="-ml-6">
              {caddies.map((caddie) => (
                <CarouselItem
                  key={caddie.name}
                  className="basis-[85%] pl-6 sm:basis-1/2 lg:basis-1/3"
                >
                  <CaddieCard caddie={caddie} />
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className="mt-8 flex items-center justify-end gap-3">
              <CarouselPrevious className="static translate-y-0 border-hairline text-ink-700 hover:bg-ink-700/5" />
              <CarouselNext className="static translate-y-0 border-hairline text-ink-700 hover:bg-ink-700/5" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}