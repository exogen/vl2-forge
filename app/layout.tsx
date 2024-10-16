import { alagard, departureMono, lora } from "../src/fonts";
import "./global.css";

export const metadata = {
  title: "VL2 Forge",
  description: "Create .vl2 files for Tribes 2",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${departureMono.variable} ${alagard.variable} ${lora.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
