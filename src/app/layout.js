import "./globals.css";
import Navbar from "./components/topbar/navbar";

export const metadata = {
  title: "Todo App",
  description: "save and see your todos ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-200 font-sans md:font-serif">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
