import "./globals.css";
import RootPage from "./components/rootcomponent/page";

export const metadata = {
  title: "Todo App",
  description: "save and see your todos",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-200 font-sans md:font-serif">
        <RootPage>{children}</RootPage>
      </body>
    </html>
  );
}
