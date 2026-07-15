export default function PrivacyPolicy() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">✨</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              KidSpark
            </span>
          </a>
          <a
            href="/"
            className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          {/* Title */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl mb-4 shadow-lg">
              <span className="text-3xl">🔒</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Privacy Policy
            </h1>
            <p className="text-gray-500">
              Last updated: {currentDate}
            </p>
          </div>

          {/* Policy Content */}
          <div className="space-y-8 text-gray-700">
            
            {/* Introduction */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-2xl">👋</span> Introduction
              </h2>
              <p className="leading-relaxed">
                Welcome to <strong>KidSpark</strong>! This Privacy Policy explains how Tectonic ("we", "us", or "our") 
                handles information when you use our educational games and learning application designed for children.
                We are committed to protecting the privacy of our young users and their families.
              </p>
            </section>

            {/* Data Collection */}
            <section className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
              <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-2xl">🛡️</span> Data Collection
              </h2>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-lg">✓</span>
                </div>
                <div>
                  <p className="leading-relaxed font-semibold text-green-800 text-lg mb-2">
                    We do NOT collect any personal data!
                  </p>
                  <p className="leading-relaxed text-green-700">
                    KidSpark is designed with children's privacy as our top priority. Our app does not collect, 
                    store, or share any personal information from users. This includes:
                  </p>
                  <ul className="mt-3 space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> No names or email addresses
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> No location data
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> No photos or videos
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> No device identifiers
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> No analytics or tracking
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-2xl">👶</span> Children's Privacy (COPPA Compliance)
              </h2>
              <p className="leading-relaxed">
                KidSpark is designed for children and complies with the Children's Online Privacy Protection Act (COPPA). 
                Since we do not collect any personal information from any users, including children under 13, 
                parents can feel confident that their children's privacy is protected while using our app.
              </p>
            </section>

            {/* Third Party Services */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-2xl">🔗</span> Third-Party Services
              </h2>
              <p className="leading-relaxed">
                KidSpark does not integrate with any third-party services that collect user data. 
                We do not use advertising networks, analytics tools, or social media integrations 
                that could track our users.
              </p>
            </section>

            {/* App Functionality */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-2xl">📱</span> App Functionality
              </h2>
              <p className="leading-relaxed">
                KidSpark is an educational app that provides fun learning games for children. 
                All game progress and settings are stored locally on your device and are not 
                transmitted to any external servers.
              </p>
            </section>

            {/* Changes to Policy */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-2xl">📝</span> Changes to This Policy
              </h2>
              <p className="leading-relaxed">
                We may update this Privacy Policy from time to time. Any changes will be posted on this page 
                with an updated revision date. We encourage you to review this Privacy Policy periodically 
                for any changes.
              </p>
            </section>

            {/* Contact */}
            <section className="bg-purple-50 rounded-2xl p-6 border-2 border-purple-200">
              <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-2xl">📧</span> Contact Us
              </h2>
              <p className="leading-relaxed mb-4">
                If you have any questions or concerns about this Privacy Policy or our practices, 
                please contact us:
              </p>
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <span className="text-purple-500">📧</span>
                  <strong>Email:</strong>{' '}
                  <a href="mailto:sher4z2k@gmail.com" className="text-purple-600 hover:text-purple-700 underline">
                    sher4z2k@gmail.com
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-purple-500">🏢</span>
                  <strong>Company:</strong> Tectonic
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-purple-500">📍</span>
                  <strong>Location:</strong> Abu Dhabi, UAE
                </p>
              </div>
            </section>

          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-8 text-gray-500">
          <p>© {new Date().getFullYear()} Tectonic. All rights reserved.</p>
          <p className="mt-2">Made with ❤️ for kids everywhere</p>
        </footer>
      </main>
    </div>
  );
}
