import { Separator } from "@/components/ui/separator";
import { CART_FEE_PER_PLAYER } from "./types";

interface BookingSummaryProps {
  feePerRound: number;
  players: number;
  holes: "9" | "18";
  cartRental: boolean;
}

export function calculateTotal({ feePerRound, players, holes, cartRental }: BookingSummaryProps) {
  // 9-hole rounds are charged at 60% of the full green fee
  const greenFee = feePerRound * (holes === "9" ? 0.6 : 1) * players;
  const cart = cartRental ? CART_FEE_PER_PLAYER * players : 0;
  return { greenFee, cart, total: greenFee + cart };
}

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function BookingSummary(props: BookingSummaryProps) {
  const { greenFee, cart, total } = calculateTotal(props);

  return (
    <div className="rounded-sm bg-neutral-50 px-4 py-3 text-sm">
      <div className="flex justify-between text-neutral-600">
        <span>
          Green fee · {props.holes} holes × {props.players}
        </span>
        <span>{money(greenFee)}</span>
      </div>
      {props.cartRental && (
        <div className="mt-1 flex justify-between text-neutral-600">
          <span>Golf cart × {props.players}</span>
          <span>{money(cart)}</span>
        </div>
      )}
      <Separator className="my-2" />
      <div className="flex items-baseline justify-between">
        <span className="font-medium text-neutral-900">Total</span>
        <span className="font-serif text-xl font-bold text-[#10B759]">{money(total)}</span>
      </div>
    </div>
  );
}