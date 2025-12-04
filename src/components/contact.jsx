import { motion, AnimatePresence } from "framer-motion";

function Contact({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-xl p-8 shadow-2xl max-w-md w-full relative"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside
          >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-md bg-slate-800 text-gray-300 hover:bg-red-600 hover:text-white transition-colors duration-300"

                >
                ✕
            </button>

            <h2 className="text-2xl font-bold text-indigo-600 mb-2 text-center">
              Contact Me
            </h2>
            <p className="text-sm text-gray-500 mb-4 text-center">
              I'd love to hear from you. Fill in the details below and I'll get back to you.
            </p>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full border border-gray-300 rounded-md px-4 py-2 bg-slate-50 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full border border-gray-300 rounded-md px-4 py-2 bg-slate-50 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
              />
              <input
                type="text"
                placeholder="Subject"
                className="w-full border border-gray-300 rounded-md px-4 py-2 bg-slate-50 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
              />
              <textarea
                placeholder="Your Message"
                rows="4"
                className="w-full border border-gray-300 rounded-md px-4 py-2 bg-slate-50 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
              ></textarea>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-semibold py-2.5 rounded-md shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Send Message
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Contact;
