import { Link } from "react-router-dom";
import Navbar from "../components/Notes/Navbar";
import Footer from "../components/Notes/Footer";
import { ArrowLeft, Shield } from "lucide-react";

const Privacy = () => {
  return (
    <div className="relative min-h-screen bg-white dark:bg-[#121214] text-[#18181b] dark:text-[#f4f4f5] transition-colors duration-200 flex flex-col font-sans">
      <Navbar />

      <main className="relative z-10 flex-1 max-w-3xl mx-auto w-full px-6 py-12 sm:py-16 flex flex-col gap-10">
        <div>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm font-medium text-[#52525b] hover:text-[#18181b] dark:text-[#a1a1aa] dark:hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-md bg-[#e0e7ff] dark:bg-[#202024] flex items-center justify-center text-[#5645d4]">
              <Shield className="w-5 h-5" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#18181b] dark:text-[#f4f4f5]">
              Privacy Policy
            </h1>
          </div>
          <p className="text-xs text-[#71717a] dark:text-[#a1a1aa] font-medium">
            Last updated: October 2026
          </p>
        </div>

        <div className="flex flex-col gap-8 text-base text-[#37352f] dark:text-[#d4d4d8] leading-relaxed font-normal">
          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">1. Introduction</h2>
            <p>
              Proxima Notes ("we", "our", or "us") respects your privacy. This Privacy Policy outlines how your personal data and note content are handled when using our local-first workspace application.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">2. Information We Collect</h2>
            <p>
              We prioritize data minimization and user privacy:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-2">
              <li>
                <strong className="text-zinc-800 dark:text-zinc-200">Account Information:</strong> When you sign in using Email or Google OAuth, we receive basic profile data (such as your Name, Email address, and User ID) managed securely via Google Firebase Authentication.
              </li>
              <li>
                <strong className="text-zinc-800 dark:text-zinc-200">Note Content:</strong> Your note titles and body content are stored locally on your device inside your browser's IndexedDB database. When authenticated, notes automatically sync to Google Cloud Firestore over encrypted SSL/TLS channels.
              </li>
            </ul>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">3. How Your Data Is Used</h2>
            <p>
              Your data is strictly used to provide, sync, and persist your personal note workspace across your devices. We do not track your browsing activity, sell your personal data, or serve advertisements.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">4. Data Ownership & Control</h2>
            <p>
              You own 100% of the content you create. You can edit or permanently delete your notes at any time. Deleting a note instantly purges it from your browser's local cache and Cloud Firestore database.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">5. Third-Party Infrastructure</h2>
            <p>
              We utilize Google Firebase for authentication and database persistence. Security and data processing standards strictly follow Google's Cloud Security Policies.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">6. Contact</h2>
            <p>
              If you have any questions regarding this Privacy Policy or your data, feel free to reach out to the author at{" "}
              <a 
                href="https://github.com/vinodjangid07" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="underline text-zinc-900 dark:text-zinc-100 font-medium"
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

export default Privacy;
