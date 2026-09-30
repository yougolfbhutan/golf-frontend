/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Flag,
  MapPin,
  Clock,
  User,
  ShoppingBag,
  CheckCircle2,
  Trophy,
  CalendarDays,
  X,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const COURSES = [
  {
    id: "emerald-hollow",
    name: "Emerald Hollow",
    tagline: "Championship parkland",
    holes: 18,
    par: 72,
    yardage: 7142,
    price: 120,
    level: "Championship",
    accent: "from-[#1B4332] to-[#2D6A4F]",
  },
  {
    id: "sandpiper-dunes",
    name: "Sandpiper Dunes",
    tagline: "Coastal links",
    holes: 18,
    par: 71,
    yardage: 6890,
    price: 95,
    level: "Links",
    accent: "from-[#2D6A4F] to-[#40765A]",
  },
  {
    id: "highland-ridge",
    name: "Highland Ridge",
    tagline: "Executive mountain nine",
    holes: 9,
    par: 36,
    yardage: 3210,
    price: 60,
    level: "Executive",
    accent: "from-[#3A5A40] to-[#588157]",
  },
];

const CADDIES = [
  {
    id: "none",
    name: "No caddie — self carry",
    years: null,
    rating: null,
    fee: 0,
    blurb: "Carry or push your own bag.",
  },
  {
    id: "elena",
    name: "Elena Reyes",
    years: 8,
    rating: 4.8,
    fee: 35,
    blurb: "Great with new golfers, calm and encouraging on the greens.",
  },
  {
    id: "marcus",
    name: "Marcus Whitfield",
    years: 15,
    rating: 4.9,
    fee: 45,
    blurb: "Sharp club selection and precise yardage calls.",
  },
  {
    id: "sam",
    name: "Sam Okafor",
    years: 20,
    rating: 5.0,
    fee: 55,
    blurb: "Master caddie — reads every green on the property.",
  },
];

const TIME_SLOTS = [
  "6:40 AM", "7:00 AM", "7:20 AM", "7:40 AM",
  "8:00 AM", "8:20 AM", "9:00 AM", "9:40 AM",
  "10:20 AM", "11:00 AM", "12:20 PM", "1:00 PM",
  "1:40 PM", "2:20 PM", "3:00 PM",
];

const EQUIPMENT = [
  { id: "clubs", label: "Premium club set rental", price: 40 },
  { id: "cart", label: "Golf cart (18 holes)", price: 35 },
  { id: "trolley", label: "Push trolley", price: 12 },
  { id: "balls", label: "Sleeve of balls (3)", price: 8 },
  { id: "shoes", label: "Golf shoe rental", price: 15 },
  { id: "rain", label: "Rain gear + umbrella", price: 10 },
  { id: "rangefinder", label: "Laser rangefinder", price: 18 },
  { id: "gloves", label: "Golf glove", price: 6 },
];

const todayISO = () => new Date().toISOString().split("T")[0];

type BookingDialogProps = {
  course: typeof COURSES[number] | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (booking: {
    id: string;
    course: string;
    date: string;
    time: string;
    players: string;
    caddie: string;
    equipment: Array<string | undefined>;
    total: number;
  }) => void;
};

// ---------------------------------------------------------------------------
// Booking dialog
// ---------------------------------------------------------------------------

function BookingDialog({ course, open, onOpenChange, onConfirm }: BookingDialogProps) {
  const [date, setDate] = useState(todayISO());
  const [time, setTime] = useState(TIME_SLOTS[3]);
  const [players, setPlayers] = useState("2");
  const [caddieId, setCaddieId] = useState("none");
  const [equipment, setEquipment] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState(false);

  const caddie = CADDIES.find((c) => c.id === caddieId);

  const equipmentTotal = useMemo(
    () =>
      equipment.reduce((sum, id) => {
        const item = EQUIPMENT.find((e) => e.id === id);
        return sum + (item ? item.price : 0);
      }, 0),
    [equipment]
  );

  const roundTotal = course ? course.price * Number(players) : 0;
  const caddieTotal = caddie ? caddie.fee : 0;
  const grandTotal = roundTotal + caddieTotal + equipmentTotal;

  const toggleEquipment = (id:any) => {
    setEquipment((prev:any) =>
      prev.includes(id) ? prev.filter((e:any) => e !== id) : [...prev, id]
    );
  };

  const reset = () => {
    setDate(todayISO());
    setTime(TIME_SLOTS[3]);
    setPlayers("2");
    setCaddieId("none");
    setEquipment([]);
    setConfirmed(false);
  };

  const handleConfirm = () => {
    if (!course) return;
    onConfirm({
      id: `${course.id}-${Date.now()}`,
      course: course.name,
      date,
      time,
      players,
      caddie: caddie?.name ?? "No caddie",
      equipment: equipment.map((id) => EQUIPMENT.find((e) => e.id === id)?.label),
      total: grandTotal,
    });
    setConfirmed(true);
  };

  const handleClose = (next:any) => {
    onOpenChange(next);
    if (!next) setTimeout(reset, 200);
  };

  if (!course) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto p-0 gap-0 bg-[#F6F3EA] border-[#D9D2BE]">
        {confirmed ? (
          <div className="p-8 text-center space-y-4">
            <div className="mx-auto w-14 h-14 rounded-full bg-[#1B4332] flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-white" />
            </div>
            <h2 className="font-serif text-2xl text-[#1B4332]">Tee time booked</h2>
            <p className="text-sm text-[#4A4A42]">
              {course.name} · {date} · {time}
            </p>
            <p className="text-xs text-[#8A8677]">
              A confirmation has been added to your tee sheet below.
            </p>
            <Button
              className="mt-2 bg-[#1B4332] hover:bg-[#153728] text-white"
              onClick={() => handleClose(false)}
            >
              Done
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader className="px-6 pt-6 pb-4 border-b border-dashed border-[#C9C2AB]">
              <DialogTitle className="font-serif text-2xl text-[#1B4332] flex items-center gap-2">
                <Flag className="w-5 h-5" />
                Book your round
              </DialogTitle>
              <DialogDescription className="text-[#6B6858]">
                {course.name} &middot; {course.holes} holes &middot; Par {course.par}
              </DialogDescription>
            </DialogHeader>

            <div className="px-6 py-5 space-y-6">
              {/* Date + time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wide text-[#6B6858] flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5" /> Date
                  </Label>
                  <Input
                    type="date"
                    value={date}
                    min={todayISO()}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-white border-[#D9D2BE]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wide text-[#6B6858] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Tee time
                  </Label>
                  <Select value={time} onValueChange={setTime}>
                    <SelectTrigger className="bg-white border-[#D9D2BE]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Players */}
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wide text-[#6B6858]">
                  Players
                </Label>
                <RadioGroup
                  value={players}
                  onValueChange={setPlayers}
                  className="flex gap-2"
                >
                  {["1", "2", "3", "4"].map((n) => (
                    <div key={n}>
                      <RadioGroupItem
                        value={n}
                        id={`players-${n}`}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`players-${n}`}
                        className="w-10 h-10 rounded-full border border-[#D9D2BE] bg-white flex items-center justify-center text-sm cursor-pointer peer-data-[state=checked]:bg-[#1B4332] peer-data-[state=checked]:text-white peer-data-[state=checked]:border-[#1B4332] transition-colors"
                      >
                        {n}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Separator className="bg-[#D9D2BE]" />

              {/* Caddie */}
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wide text-[#6B6858] flex items-center gap-1">
                  <User className="w-3.5 h-3.5" /> Caddie
                </Label>
                <Select value={caddieId} onValueChange={setCaddieId}>
                  <SelectTrigger className="bg-white border-[#D9D2BE]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CADDIES.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} {c.fee ? `— $${c.fee}` : "— free"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {caddie && caddie.id !== "none" && (
                  <div className="text-xs text-[#6B6858] bg-white border border-[#E4DFCF] rounded-md px-3 py-2 flex justify-between items-center">
                    <span>
                      {caddie.blurb} &middot; {caddie.years} yrs &middot; {caddie.rating}★
                    </span>
                    <Badge className="bg-[#EFE9D6] text-[#8A6D1D] hover:bg-[#EFE9D6]">
                      ${caddie.fee}
                    </Badge>
                  </div>
                )}
              </div>

              <Separator className="bg-[#D9D2BE]" />

              {/* Equipment */}
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wide text-[#6B6858] flex items-center gap-1">
                  <ShoppingBag className="w-3.5 h-3.5" /> Golf equipment (optional)
                </Label>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {EQUIPMENT.map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <Checkbox
                        id={item.id}
                        checked={equipment.includes(item.id)}
                        onCheckedChange={() => toggleEquipment(item.id)}
                      />
                      <Label
                        htmlFor={item.id}
                        className="text-sm font-normal text-[#3A3A32] cursor-pointer flex-1"
                      >
                        {item.label}
                      </Label>
                      <span className="text-xs text-[#8A8677]">${item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Scorecard-style total */}
            <div className="px-6 py-4 border-t border-dashed border-[#C9C2AB] bg-[#EFE9D6]/60 space-y-1.5">
              <div className="flex justify-between text-sm text-[#4A4A42]">
                <span>Round ({players} {Number(players) === 1 ? "player" : "players"})</span>
                <span>${roundTotal}</span>
              </div>
              {caddieTotal > 0 && (
                <div className="flex justify-between text-sm text-[#4A4A42]">
                  <span>Caddie</span>
                  <span>${caddieTotal}</span>
                </div>
              )}
              {equipmentTotal > 0 && (
                <div className="flex justify-between text-sm text-[#4A4A42]">
                  <span>Equipment</span>
                  <span>${equipmentTotal}</span>
                </div>
              )}
              <div className="flex justify-between font-serif text-lg text-[#1B4332] pt-1.5 border-t border-[#D9D2BE]">
                <span>Total</span>
                <span>${grandTotal}</span>
              </div>
            </div>

            <DialogFooter className="px-6 pb-6 pt-2">
              <Button
                className="w-full bg-[#1B4332] hover:bg-[#153728] text-white"
                onClick={handleConfirm}
              >
                Confirm booking — ${grandTotal}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Main app
// ---------------------------------------------------------------------------

export default function GolfBookingApp() {
  const [activeCourse, setActiveCourse] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);

  const openBooking = (course: any) => {
    setActiveCourse(course);
    setDialogOpen(true);
  };

  const addBooking = (booking:any) => {
    setBookings((prev: any[]) => [booking, ...prev]);
  };

  const removeBooking = (id:any) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#F6F3EA] text-[#1E2420]">
      {/* Header */}
      <header className="border-b border-[#D9D2BE] bg-[#F6F3EA]/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-[#1B4332]" />
            <span className="font-serif text-lg tracking-tight text-[#1B4332]">
              Fairway &amp; Co.
            </span>
          </div>
          <span className="text-xs uppercase tracking-widest text-[#8A8677]">
            Tee sheet
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-14 pb-10">
        <p className="text-xs uppercase tracking-[0.2em] text-[#8A8677] mb-3">
          Book a round in under a minute
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#1B4332] leading-[1.1] max-w-xl">
          Pick a course, a caddie, and a tee time.
        </h1>
        <p className="mt-4 text-[#4A4A42] max-w-md">
          Three courses, hand-picked caddies, and every piece of gear you
          might have left at home — all in one booking.
        </p>
      </section>

      {/* Courses */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="grid sm:grid-cols-3 gap-5">
          {COURSES.map((course) => (
            <Card
              key={course.id}
              className="overflow-hidden border-[#D9D2BE] bg-white pt-0 gap-0"
            >
              <div
                className={`h-28 bg-gradient-to-br ${course.accent} flex items-end p-4`}
              >
                <Badge className="bg-white/90 text-[#1B4332] hover:bg-white/90">
                  {course.level}
                </Badge>
              </div>
              <CardHeader className="pt-4 pb-0">
                <h3 className="font-serif text-xl text-[#1B4332]">
                  {course.name}
                </h3>
                <p className="text-sm text-[#8A8677] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {course.tagline}
                </p>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="flex justify-between text-sm text-[#4A4A42] border-y border-[#EFE9D6] py-2">
                  <span>{course.holes} holes</span>
                  <span>Par {course.par}</span>
                  <span>{course.yardage.toLocaleString()} yd</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-serif text-2xl text-[#1B4332]">
                    ${course.price}
                    <span className="text-xs text-[#8A8677] font-sans ml-1">
                      / player
                    </span>
                  </span>
                  <Button
                    onClick={() => openBooking(course)}
                    className="bg-[#1B4332] hover:bg-[#153728] text-white"
                  >
                    Book tee time
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Your bookings */}
      {bookings.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 pb-20">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-4 h-4 text-[#1B4332]" />
            <h2 className="font-serif text-xl text-[#1B4332]">
              Your tee times
            </h2>
          </div>
          <div className="space-y-3">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="bg-white border border-[#D9D2BE] rounded-lg px-5 py-4 flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <p className="font-medium text-[#1E2420]">{b.course}</p>
                  <p className="text-sm text-[#6B6858]">
                    {b.date} &middot; {b.time} &middot; {b.players}{" "}
                    {Number(b.players) === 1 ? "player" : "players"} &middot;{" "}
                    {b.caddie}
                  </p>
                  {b.equipment.length > 0 && (
                    <p className="text-xs text-[#8A8677]">
                      Equipment: {b.equipment.join(", ")}
                    </p>
                  )}
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <span className="font-serif text-lg text-[#1B4332]">
                    ${b.total}
                  </span>
                  <button
                    onClick={() => removeBooking(b.id)}
                    className="text-[#8A8677] hover:text-[#4A4A42]"
                    aria-label="Remove booking"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <BookingDialog
        course={activeCourse}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={addBooking}
      />
    </div>
  );
}