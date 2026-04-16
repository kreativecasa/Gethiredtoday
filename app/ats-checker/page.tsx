import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import AtsCheckerView from "@/components/ats-checker-view";

export const metadata: Metadata = {
  title: "Free ATS Resume Checker — Score Your Resume Instantly",
  description: "Paste your resume and get an instant ATS compatibility score. Find missing keywords, formatting issues, and get actionable fixes in seconds. 100% free.",
  alternates: { canonical: "https://gethiretoday.com/ats-checker" },
  openGraph: {
    title: "Free ATS Resume Checker — Score Your Resume Instantly",
    description: "Get an instant ATS score, keyword gap analysis, and actionable fixes. Free — no signup required.",
    url: "https://gethiretoday.com/ats-checker",
  },
};

export default function ATSCheckerPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1">
        <AtsCheckerView />
      </main>
      <Footer />
    </div>
  );
}
