/* ------------------------------------------------------------------ */
/*  NutriSync dashboard data — mirrors the platform's real metrics      */
/* ------------------------------------------------------------------ */

export type Meal = {
  id: string;
  name: string;
  time: string;
  slot: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  image?: string;
};

export const USER = {
  name: "Shabari",
  email: "shabarithasan007@gmail.com",
  initials: "S",
  plan: "Pro",
  goal: "Balanced · Maintain",
  targetWeight: 68,
};

export const TODAY = {
  kcalGoal: 2400,
  kcalEaten: 1840,
  proteinGoal: 150,
  proteinEaten: 124,
  carbsGoal: 280,
  carbsEaten: 210,
  fatGoal: 80,
  fatEaten: 62,
  fiberGoal: 35,
  fiberEaten: 24,
  sugarLimit: 50,
  sugarEaten: 31,
  waterGoal: 8,
  waterDrunk: 5,
  streak: 14,
};

/** 7-day series for KPI sparklines (oldest → newest) */
export const KPI_TRENDS = {
  kcal: [2210, 2380, 1980, 2465, 2620, 2140, 1840],
  protein: [118, 132, 105, 141, 96, 128, 124],
  water: [6, 7, 5, 8, 4, 6, 5],
  adherence: [92, 99, 83, 97, 78, 89, 88],
};

export const RECENT_MEALS: Meal[] = [
  {
    id: "m1",
    name: "Pesto Salmon Bowl",
    time: "1:12 PM",
    slot: "Lunch",
    kcal: 520,
    protein: 38,
    carbs: 44,
    fat: 21,
    image: "/images/meal-thumb.jpg",
  },
  {
    id: "m2",
    name: "Berry Overnight Oats",
    time: "8:05 AM",
    slot: "Breakfast",
    kcal: 380,
    protein: 16,
    carbs: 52,
    fat: 9,
    image: "/images/meal-oats.jpg",
  },
  {
    id: "m3",
    name: "Chicken & Quinoa Salad",
    time: "Yesterday",
    slot: "Dinner",
    kcal: 610,
    protein: 47,
    carbs: 48,
    fat: 22,
    image: "/images/meal-salad.jpg",
  },
  {
    id: "m4",
    name: "Greek Yogurt + Honey",
    time: "Yesterday",
    slot: "Snack",
    kcal: 180,
    protein: 14,
    carbs: 22,
    fat: 3,
  },
];

/** Weekly Pulse — 7-day calorie intake vs goal */
export const WEEKLY = [
  { day: "Mon", kcal: 2210, adherence: 0.92 },
  { day: "Tue", kcal: 2380, adherence: 0.99 },
  { day: "Wed", kcal: 1980, adherence: 0.83 },
  { day: "Thu", kcal: 2465, adherence: 0.97 },
  { day: "Fri", kcal: 2620, adherence: 0.78 },
  { day: "Sat", kcal: 2140, adherence: 0.89 },
  { day: "Sun", kcal: 1840, adherence: 0.77 },
];

/** Monthly Trends — weight (kg) over 8 weeks */
export const MONTHLY = [
  { label: "W1", value: 72.4 },
  { label: "W2", value: 71.8 },
  { label: "W3", value: 71.9 },
  { label: "W4", value: 71.1 },
  { label: "W5", value: 70.4 },
  { label: "W6", value: 70.5 },
  { label: "W7", value: 69.8 },
  { label: "W8", value: 69.2 },
];

export type Insight = {
  level: "strong" | "attention" | "opportunity";
  title: string;
  body: string;
};

export const AI_INSIGHTS: Insight[] = [
  {
    level: "strong",
    title: "Protein intake is consistent",
    body: "Averaging 124 g daily — 83% of target. Lunch is carrying most of the load at 38 g per serving.",
  },
  {
    level: "attention",
    title: "Fiber tracking behind goal",
    body: "At 24 g against a 35 g goal. One serving of legumes or berries would close the remaining gap.",
  },
  {
    level: "opportunity",
    title: "Weekend pattern detected",
    body: "Intake runs roughly 9% above goal on Saturdays. A lighter breakfast that day would smooth the week.",
  },
];

export type NavId =
  | "dashboard"
  | "scanner"
  | "calculator"
  | "coach"
  | "meals"
  | "reports";

export const NAV_GROUPS: {
  label: string;
  items: { id: NavId; label: string; icon: string; badge?: string }[];
}[] = [
  {
    label: "Overview",
    items: [
      { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard" },
      { id: "reports", label: "Reports", icon: "ChartNoAxesColumn" },
    ],
  },
  {
    label: "Nutrition",
    items: [
      { id: "scanner", label: "Food Scanner", icon: "ScanBarcode" },
      { id: "meals", label: "My Meals", icon: "Utensils", badge: "24" },
      { id: "calculator", label: "Calculator", icon: "Calculator" },
    ],
  },
  {
    label: "Intelligence",
    items: [{ id: "coach", label: "AI Coach", icon: "Sparkles" }],
  },
];
