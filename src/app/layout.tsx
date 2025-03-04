import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { Provider } from "../context";
import { Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import TopHead from "../components/shared/TopHead";
import Footer from "../components/shared/Footer";
import { Suspense } from "react";
import ProgressBarProvider from "../components/ProgressBar/ProgressBar";

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
            <Suspense>
              <ProgressBarProvider>
                <main>{children}</main>
              </ProgressBarProvider>
            </Suspense>
            <Footer />
          </Container>
        </Provider>
      </body>
    </html>
  );
}
