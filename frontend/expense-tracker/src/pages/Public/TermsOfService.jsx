import React from 'react';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between font-sans selection:bg-purple-500 selection:text-white">
      {/* Background Gradient Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-900/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-900/10 blur-[120px]"></div>
      </div>

      {/* Navigation header */}
      <header className="relative z-10 border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Expense Tracker
          </span>
          <button 
            onClick={() => navigate('/login')}
            className="text-sm font-medium px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/50 transition-all cursor-pointer"
          >
            Back to App
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12 flex-grow w-full">
        <div className="card bg-slate-800/40 backdrop-blur-md border border-slate-700/40 rounded-2xl p-8 md:p-10 shadow-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-slate-400 text-sm mb-8">Last Updated: May 20, 2026</p>

          <div className="space-y-6 text-slate-300 leading-relaxed text-sm md:text-base">
            <section>
              <h2 className="text-lg md:text-xl font-semibold text-purple-300 mb-2">1. Acceptance of Terms</h2>
              <p>
                By creating an account or accessing the Expense Tracker application ("Service"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you are prohibited from using the Service.
              </p>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-semibold text-purple-300 mb-2">2. Eligibility & Account Security</h2>
              <p>
                You must be at least 13 years of age to use this Service. You are responsible for maintaining the confidentiality of your account login credentials, including passwords, and are fully responsible for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-semibold text-purple-300 mb-2">3. Description of Service & Integrations</h2>
              <p>
                Expense Tracker is a personal finance management tool that allows users to record, categorize, and track incomes and expenses. 
                Our Service includes an optional integration with Google Gmail APIs to detect transaction alerts. 
                You acknowledge that connecting your Gmail account is entirely voluntary and that you authorize our Service to read and parse email alerts sent to you by financial institutions to pre-populate transaction cards.
              </p>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-semibold text-purple-300 mb-2">4. User Responsibilities & Acceptable Use</h2>
              <p className="mb-2">You agree NOT to use the Service to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Submit false, inaccurate, or misleading financial records.</li>
                <li>Attempt to bypass any security protections or decrypt other users' tokens.</li>
                <li>Reverse-engineer or exploit the application's underlying code or architecture.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-semibold text-purple-300 mb-2">5. Disclaimer of Warranties</h2>
              <p>
                THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. EXPENSE TRACKER DISCLAIMS ALL WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE ERROR-FREE, SECURE, OR UNINTERRUPTED.
              </p>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-semibold text-purple-300 mb-2">6. Limitation of Liability</h2>
              <p>
                IN NO EVENT SHALL EXPENSE TRACKER OR ITS DEVELOPERS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR LOSS OF DATA, PROFITS, OR REVENUE ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
              </p>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-semibold text-purple-300 mb-2">7. Termination</h2>
              <p>
                We reserve the right to suspend or terminate your access to the Service at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users or our business interests.
              </p>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-semibold text-purple-300 mb-2">8. Contact Us</h2>
              <p>
                For any questions or support requests concerning these Terms of Service, please contact us at support@expensetracker-xldf.onrender.com.
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800 bg-slate-950 px-6 py-6 text-center text-slate-500 text-xs">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} Expense Tracker. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-300 cursor-pointer" onClick={() => navigate('/terms-of-service')}>Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer" onClick={() => navigate('/privacy-policy')}>Privacy Policy</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TermsOfService;
