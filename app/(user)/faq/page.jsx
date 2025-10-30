import FAQContent from "../../components/user/FAQContent";


export const metadata = {
  title: "FAQ | E-Commerces",
  description: "Frequently Asked Questions about our e-commerce platform.",
};

export default function FAQPage() {
  return (
    <main className="min-h-screen px-6 py-12 md:px-20 lg:px-32">
      <FAQContent />
    </main>
  );
}
