import React from 'react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
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
            Privacy Policy
          </h1>
          <p className="text-slate-400 text-sm mb-8">Last Updated: May 20, 2026</p>

          <div className="space-y-6 text-slate-300 leading-relaxed text-sm md:text-base">
            <section>
              <h2 className="text-lg md:text-xl font-semibold text-purple-300 mb-2">1. Overview</h2>
              <p>
                Welcome to Expense Tracker. We respect your privacy and are committed to protecting your personal data. 
                This Privacy Policy explains how our application collects, uses, stores, and handles your information 
                when you use our service, including our Gmail-based transaction auto-detection feature.
              </p>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-semibold text-purple-300 mb-2">2. Information We Collect</h2>
              <p className="mb-2">We collect and process the following information:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Account Information:</strong> Name, email address, password, and profile preferences when you register.</li>
                <li><strong>Transaction Records:</strong> Amount, description, category, date, and source of expenses/incomes you enter manually or approve.</li>
                <li><strong>Gmail Integration Data:</strong> If you connect your Gmail account, our application retrieves list information and email metadata (specifically filtering for transaction alerts from financial institutions). We temporarily load the message body to parse transaction amounts, merchants, and dates.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-semibold text-purple-300 mb-2">3. Google User Data Disclosures & Limited Use</h2>
              <p className="mb-2">
                Our application accesses Google APIs to read transaction-related emails. We take our responsibilities regarding this data very seriously:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>We only request read-only access (<code>https://www.googleapis.com/auth/gmail.readonly</code>) to parse bank-issued payment alerts. We do not edit, send, delete, or modify your emails.</li>
                <li>Your raw email contents are parsed locally/on our servers to extract transactions. Only the extracted transaction details (amount, vendor, date) are stored in your database upon your explicit approval. The raw email text is not shared with any third party.</li>
                <li>
                  <strong>Limited Use Policy:</strong> Expense Tracker's use and transfer to any other app of information received from Google APIs will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Google API Services User Data Policy</a>, including the Limited Use requirements.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-semibold text-purple-300 mb-2">4. Data Sharing & Security</h2>
              <p>
                We do not sell, trade, rent, or transfer your personal data or Google OAuth tokens to third parties. 
                All tokens stored in our database are encrypted using industry-standard AES-256-GCM encryption algorithms. 
                Your data is stored securely and accessed only by the application to populate your dashboard.
              </p>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-semibold text-purple-300 mb-2">5. User Control & Data Deletion</h2>
              <p>
                You can disconnect Gmail at any time through the Profile or Sync settings page. 
                Once disconnected, your authentication tokens are immediately deleted from our database. 
                If you choose to delete your account, all your stored transactions, income lists, expenses, and credentials will be permanently erased from our systems.
              </p>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-semibold text-purple-300 mb-2">6. Changes to this Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page.
              </p>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-semibold text-purple-300 mb-2">7. Contact Us</h2>
              <p>
                If you have any questions or suggestions about this Privacy Policy, please contact us at support@expensetracker-xldf.onrender.com.
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

export default PrivacyPolicy;
