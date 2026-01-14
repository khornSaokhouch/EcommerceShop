import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function UserLayout({ children }) {
  return (
    <div>
      <div className="flex-grow pt-24 "> <Navbar /></div>
      <div>{children}</div>
      <Footer />
    </div>
  );
}
