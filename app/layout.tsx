// app/layout.tsx
export const metadata = {
  title: "LinkAllAI",
  description: "Compare the top AI models easily",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
