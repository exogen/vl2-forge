import { Lora } from "next/font/google";
import localFont from "next/font/local";

export const departureMono = localFont({
  src: "../public/DepartureMono-Regular.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-departure",
});

export const alagard = localFont({
  src: "../public/alagard.ttf",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-alagard",
});

export const lora = Lora({
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-lora",
});
