import localFont from "next/font/local";

export const departureMono = localFont({
  src: "../public/DepartureMono-Regular.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-departure",
});
