import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ExamplesView from "@/components/examples-view";

export const metadata: Metadata = {
  title: "Resume Examples by Job Title — 500+ Industry Samples",
  description: "Browse 500+ professionally written resume examples across every industry and experience level. Find your job title and build a better resume in minutes.",
  alternates: { canonical: "https://gethiretoday.com/resume-examples" },
  openGraph: {
    title: "Resume Examples by Job Title — 500+ Industry Samples",
    description: "Find real resume examples for your industry. Software engineers, nurses, teachers, marketers, and 50+ more job titles.",
    url: "https://gethiretoday.com/resume-examples",
  },
};

export default function ExamplesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-1">
        <ExamplesView />
      </main>
      <Footer />
    </div>
  );
}
