import "./globals.css";
import Header from "@/components/Header/Header";

export const metadata = {
  title: "Number Plate Search",
  description: "Search for vehicle information using Danish number plates",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
