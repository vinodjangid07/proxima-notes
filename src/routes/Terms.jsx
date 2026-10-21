import { Link } from "react-router-dom";
import Navbar from "../components/Notes/Navbar";
import Footer from "../components/Notes/Footer";
import { ArrowLeft, FileText } from "lucide-react";

const Terms = () => {
  return (
    <div className="relative min-h-screen bg-white dark:bg-[#121214] text-[#171717] dark:text-[#ededed] transition-colors duration-200 flex flex-col font-sans">
      <Navbar />

      <main className="relative z-10 flex-1 max-w-3xl mx-auto w-full px-6 py-12 sm:py-16 flex flex-col gap-10">
        <div>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm font-medium text-[#60646c] hover:text-[#171717] dark:text-[#a0a4ab] dark:hover:text-[#ededed] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-md bg-[#f0f0f3] dark:bg-[#1a1a1e] border border-[#dcdee0] dark:border-[#2e2e34] flex items-center justify-center text-[#171717] dark:text-[#ededed]">
              <FileText className="w-5 h-5" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#171717] dark:text-[#ededed]">
              Terms of Service
            </h1>
          </div>
          <p className="text-xs text-[#60646c] dark:text-[#a0a4ab] font-medium">
            Last updated: October 2026
          </p>
        </div>

        <div className="flex flex-col gap-8 text-base text-[#60646c] dark:text-[#a0a4ab] leading-relaxed font-normal">
          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-[#171717] dark:text-[#ededed]">1. Agreement to Terms</h2>
            <p>
              By accessing or using Proxima, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use the application.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-[#171717] dark:text-[#ededed]">2. Service Description</h2>
            <p>
              Proxima is a minimalist, local-first web application for creating, managing, and synchronizing notes across user devices.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-[#171717] dark:text-[#ededed]">3. User Responsibilities</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree not to misuse the service or attempt unauthorized access to system resources.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-[#171717] dark:text-[#ededed]">4. Intellectual Property</h2>
            <p>
              All content you write and create remains entirely your property. The design, branding, and code of Proxima are protected by copyright and open-source licenses.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-[#171717] dark:text-[#ededed]">5. Disclaimer of Warranties</h2>
            <p>
              Proxima is provided "as is" and "as available" without warranties of any kind. As a local-first workspace, we recommend keeping backups of vital information.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-[#171717] dark:text-[#ededed]">6. Modifications to Terms</h2>
            <p>
              We reserve the right to update or modify these Terms of Service at any time. Continued use of the application constitutes acceptance of the modified terms.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-[#171717] dark:text-[#ededed]">7. Contact</h2>
            <p>
              For any questions regarding these Terms, please contact{" "}
              <a 
                href="https://github.com/vinodjangid07" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="underline text-[#0d74ce] hover:underline font-medium"
              >
                vinodjangid07
              </a>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
