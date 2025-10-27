import localFont from "next/font/local";
import "./globals.css";
import Navbar from "../../components/Navbar";
import { ThemeProvider } from "next-themes";

const poppins = localFont({
  src: [
    { path: "../../public/fonts/Poppins-Regular.ttf", weight: "400" },
    { path: "../../public/fonts/Poppins-Medium.ttf", weight: "500" },
    { path: "../../public/fonts/Poppins-SemiBold.ttf", weight: "600" },
    { path: "../../public/fonts/Poppins-Bold.ttf", weight: "700" },
  ],
  variable: "--font-poppins",
});


export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <title>Sipandai</title>
      </head>
      <body
        className={`${poppins.variable} font-poppins antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
