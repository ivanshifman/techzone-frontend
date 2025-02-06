import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { Provider } from "@/app/context";
import { Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import TopHead from "@/app/components/shared/TopHead";

export const metadata = {
  title: "TechZone",
  description: "TechZone - Get Instant License In a Click",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Provider>
          <Container>
            <ToastContainer />
            <TopHead />
            {children}
          </Container>
        </Provider>
      </body>
    </html>
  );
}
