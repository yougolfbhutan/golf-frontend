import type { GolfSet } from "../interface";

export const DEFAULT_SETS: GolfSet[] = [
  // ---------------------------------------------------------------------
  // MENS — PREMIUM ($60) — your original tour-level sets
  // ---------------------------------------------------------------------
  {
    id: "qi10-ls",
    brand: "TaylorMade",
    name: "Qi10 LS",
    description:
      "Tour-level 10-piece set, ultra-low spin driver for fast swingers.",
    price: 60,
    tag: "new",
    category: "mens",
    tier: "premium",
  },
  {
    id: "paradym-ai-smoke",
    brand: "Callaway",
    name: "Paradym Ai Smoke",
    description: "AI-optimised irons for maximum distance and forgiveness.",
    price: 60,
    tag: "new",
    category: "mens",
    tier: "premium",
  },
  {
    id: "tsr4-collection",
    brand: "Titleist",
    name: "TSR4 Collection",
    description: "Elite player set with tour-preferred compact shaping.",
    price: 60,
    tag: "new",
    category: "mens",
    tier: "premium",
  },
  {
    id: "g430-lst",
    brand: "Ping",
    name: "G430 LST Set",
    description: "High MOI design with lightweight tech shaft package.",
    price: 60,
    tag: "new",
    category: "mens",
    tier: "premium",
  },
  {
    id: "aerojet-ls-tour",
    brand: "Cobra",
    name: "AEROJET LS Tour",
    description: "Speed-optimised aerodynamic crown for maximum ball speed.",
    price: 60,
    tag: "new",
    category: "mens",
    tier: "premium",
  },
  {
    id: "qi10-ls-lefty",
    brand: "TaylorMade",
    name: "Qi10 LS — Lefty",
    description: "Left-handed version of the tour-level set.",
    price: 60,
    tag: "lefty",
    category: "mens",
    tier: "premium",
    // lefty: true,
  },
  {
    id: "paradym-ai-lefty",
    brand: "Callaway",
    name: "Paradym Ai — Lefty",
    description: "Left-handed AI-optimised full set for southpaw players.",
    price: 60,
    tag: "lefty",
    category: "mens",
    tier: "premium",
    // lefty: true,
  },

  // ---------------------------------------------------------------------
  // MENS — REGULAR ($40) — used, good condition
  // ---------------------------------------------------------------------
  {
    id: "sim2-max",
    brand: "TaylorMade",
    name: "SIM2 Max",
    description: "Well-maintained forgiving set, great for mid handicaps.",
    price: 40,
    category: "mens",
    tier: "regular",
  },
  {
    id: "rogue-st-max",
    brand: "Callaway",
    name: "Rogue ST Max",
    description: "Reliable game-improvement set in good used condition.",
    price: 40,
    category: "mens",
    tier: "regular",
  },
  {
    id: "t300-set",
    brand: "Titleist",
    name: "T300 Set",
    description: "Classic mid-handicap irons paired with a forgiving driver.",
    price: 40,
    category: "mens",
    tier: "regular",
  },

  // ---------------------------------------------------------------------
  // LADIES — PREMIUM ($60)
  // ---------------------------------------------------------------------
  {
    id: "cobra-air-x-ladies",
    brand: "Cobra",
    name: "Air-X Ladies Pro",
    description: "Lightweight tour set built on a women's flex profile.",
    price: 60,
    tag: "new",
    category: "ladies",
    tier: "premium",
  },
  {
    id: "callaway-rogue-ladies",
    brand: "Callaway",
    name: "Rogue ST Ladies",
    description: "AI-optimised distance set tuned for women's swing speeds.",
    price: 60,
    tag: "new",
    category: "ladies",
    tier: "premium",
  },
  {
    id: "taylormade-stealth-ladies-lefty",
    brand: "TaylorMade",
    name: "Stealth Ladies — Lefty",
    description: "Left-handed premium set designed for women players.",
    price: 60,
    tag: "lefty",
    category: "ladies",
    tier: "premium",
    // lefty: true,
  },

  // ---------------------------------------------------------------------
  // LADIES — REGULAR ($40)
  // ---------------------------------------------------------------------
  {
    id: "wilson-ladies-set",
    brand: "Wilson",
    name: "Wilson Ladies Set",
    description: "Comfortable, forgiving used set for casual rounds.",
    price: 40,
    category: "ladies",
    tier: "regular",
  },
  {
    id: "cleveland-ladies-set",
    brand: "Cleveland",
    name: "Cleveland Ladies Halo",
    description: "Easy-launch irons, great for beginners and high handicaps.",
    price: 40,
    category: "ladies",
    tier: "regular",
  },

  // ---------------------------------------------------------------------
  // JUNIORS — PREMIUM ($60)
  // ---------------------------------------------------------------------
  {
    id: "us-kids-tour-series",
    brand: "US Kids Golf",
    name: "Tour Series Junior",
    description: "Premium lightweight junior set, sized to age and height.",
    price: 60,
    tag: "new",
    category: "juniors",
    tier: "premium",
  },
  {
    id: "callaway-junior-xj",
    brand: "Callaway",
    name: "XJ Junior Set",
    description: "High-performance junior set with adult-mirrored styling.",
    price: 60,
    tag: "new",
    category: "juniors",
    tier: "premium",
  },

  // ---------------------------------------------------------------------
  // JUNIORS — REGULAR ($40)
  // ---------------------------------------------------------------------
  {
    id: "us-kids-starter",
    brand: "US Kids Golf",
    name: "Starter Junior Set",
    description: "Well-loved starter set, perfect for first-time juniors.",
    price: 40,
    category: "juniors",
    tier: "regular",
  },
  {
    id: "wilson-junior-set",
    brand: "Wilson",
    name: "Wilson Junior Set",
    description: "Durable used junior clubs, lightweight and easy to swing.",
    price: 40,
    category: "juniors",
    tier: "regular",
  },
];