import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 80,
      damping: 20,
      duration: 0.6,
    },
  },
};

const iconVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 200,
      damping: 12,
      duration: 0.8,
    },
  },
};

const pulseVariants = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
};

export default function PrivacyPolicy() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <motion.header
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10"
      >
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <motion.div
              variants={iconVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ rotate: 20, scale: 1.1 }}
              className="w-10 h-10 bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg"
            >
          <span className="text-white text-xl">✨</span>
            </motion.div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              KidSpark
            </span>
          </a>
          <motion.a
            href="/"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
          >
            ← Back to Home
          </motion.a>
        </div>
      </motion.header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-3xl shadow-xl p-8 md:p-12"
        >
          {/* Title */}
          <motion.div variants={itemVariants} className="text-center mb-10">
            <motion.div
              variants={iconVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl mb-4 shadow-lg"
            >
              <span className="text-3xl">🔒</span>
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Privacy Policy
            </h1>
            <p className="text-gray-500">
              Last updated: {currentDate}
            </p>
          </motion.div>

          {/* Policy Content */}
          <div className="space-y-8 text-gray-700">
            
            {/* Introduction */}
            <motion.section variants={itemVariants}>
              <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="text-2xl"
                >
                  👋
                </motion.span> Introduction
              </h2>
              <p className="leading-relaxed">
                Welcome to <strong>KidSpark</strong>! This Privacy Policy explains how Tectonic ("we", "us", or "our") 
                handles information when you use our educational games and learning application designed for children.
                We are committed to protecting the privacy of our young users and their families.
              </p>
            </motion.section>

            {/* Data Collection */}
            <motion.section
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-green-50 rounded-2xl p-6 border-2 border-green-200"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <motion.span
                  variants={pulseVariants}
                  animate="animate"
                  className="text-2xl"
                >
                  🛡️
                </motion.span> Data Collection
              </h2>
              <div className="flex items-start gap-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.3 }}
                  className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                >
                  <span className="text-white text-lg">✓</span>
                </motion.div>
                <div>
                  <p className="leading-relaxed font-semibold text-green-800 text-lg mb-2">
                    We do NOT collect any personal data!
                  </p>
                  <p className="leading-relaxed text-green-700">
                    KidSpark is designed with children's privacy as our top priority. Our app does not collect, 
                    store, or share any personal information from users. This includes:
                  </p>
                  <ul className="mt-3 space-y-2">
                    {[
                      "No names or email addresses",
                      "No location data",
                      "No photos or videos",
                      "No device identifiers",
                      "No analytics or tracking"
                    ].map((item, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="flex items-center gap-2"
                      >
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', delay: 0.5 + index * 0.1 }}
                          className="text-green-500"
                        >
                          ✓
                        </motion.span> {item}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.section>

            {/* Children's Privacy */}
            <motion.section variants={itemVariants}>
              <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <motion.span
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-2xl"
                >
                  👶
                </motion.span> Children's Privacy (COPPA Compliance)
              </h2>
              <p className="leading-relaxed">
                KidSpark is designed for children and complies with the Children's Online Privacy Protection Act (COPPA). 
                Since we do not collect any personal information from any users, including children under 13, 
                parents can feel confident that their children's privacy is protected while using our app.
              </p>
            </motion.section>

            {/* Third Party Services */}
            <motion.section variants={itemVariants}>
              <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-2xl">🔗</span> Third-Party Services
              </h2>
              <p className="leading-relaxed">
                KidSpark does not integrate with any third-party services that collect user data. 
                We do not use advertising networks, analytics tools, or social media integrations 
                that could track our users.
              </p>
            </motion.section>

            {/* App Functionality */}
            <motion.section variants={itemVariants}>
              <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-2xl">📱</span> App Functionality
              </h2>
              <p className="leading-relaxed">
                KidSpark is an educational app that provides fun learning games for children. 
                All game progress and settings are stored locally on your device and are not 
                transmitted to any external servers.
              </p>
            </motion.section>

            {/* Changes to Policy */}
            <motion.section variants={itemVariants}>
              <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-2xl">📝</span> Changes to This Policy
              </h2>
              <p className="leading-relaxed">
                We may update this Privacy Policy from time to time. Any changes will be posted on this page 
                with an updated revision date. We encourage you to review this Privacy Policy periodically 
                for any changes.
              </p>
            </motion.section>

            {/* Contact */}
            <motion.section
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-purple-50 rounded-2xl p-6 border-2 border-purple-200"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-2xl">📧</span> Contact Us
              </h2>
              <p className="leading-relaxed mb-4">
                If you have any questions or concerns about this Privacy Policy or our practices, 
                please contact us:
              </p>
              <div className="space-y-2">
                <motion.p whileHover={{ x: 5 }} className="flex items-center gap-2">
                  <span className="text-purple-500">📧</span>
                  <strong>Email:</strong>{' '}
                  <a href="mailto:sher4z2k@gmail.com" className="text-purple-600 hover:text-purple-700 underline">
                    sher4z2k@gmail.com
                  </a>
                </motion.p>
                <motion.p whileHover={{ x: 5 }} className="flex items-center gap-2">
                  <span className="text-purple-500">🏢</span>
                  <strong>Company:</strong> Tectonic
                </motion.p>
                <motion.p whileHover={{ x: 5 }} className="flex items-center gap-2">
                  <span className="text-purple-500">📍</span>
                  <strong>Location:</strong> Abu Dhabi, UAE
                </motion.p>
              </div>
            </motion.section>

          </div>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-8 text-gray-500"
        >
          <p>© {new Date().getFullYear()} Tectonic. All rights reserved.</p>
          <p className="mt-2">Made with ❤️ for kids everywhere</p>
        </motion.footer>
      </main>
    </div>
  );
}
