"use client";

import { Label } from "@/components/ui/label";
// import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { CART_FEE_PER_PLAYER } from "./types";

interface RoundOptionsProps {
  players: number;
  holes: "9" | "18";
  cartRental: boolean;
  courseHoles?: number | string;
  onPlayersChange: (n: number) => void;
  onHolesChange: (h: "9" | "18") => void;
  onCartChange: (v: boolean) => void;
}

export default function RoundOptions({
  players,

  courseHoles,
  onPlayersChange,
//   onCartChange,
}: RoundOptionsProps) {
  const canPlay18 = Number(courseHoles ?? 18) >= 18;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="players">Players</Label>
          <Select value={String(players)} onValueChange={(v) => onPlayersChange(Number(v))}>
            <SelectTrigger id="players" className="rounded-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} {n === 1 ? "player" : "players"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

      </div>


    </div>
  );
}