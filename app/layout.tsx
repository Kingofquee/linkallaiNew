export const metadata = {
  title: "LinkAllAI",
  description: "Compare AI models in one place",
};

import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
