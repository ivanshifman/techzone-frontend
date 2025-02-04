import { Provider } from "@/context";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </Provider>
  );
}
