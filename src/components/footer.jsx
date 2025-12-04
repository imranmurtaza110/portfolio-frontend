import { motion } from "framer-motion";

function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-slate-950 text-white py-12 px-6 border-t border-slate-800"
    >
      <div className="max-w-7xl mx-auto">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Left: About */}
          <div>
            <h3 className="mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent text-lg font-semibold">
              Syed Imran Murtaza Zaidi
            </h3>
            <p className="text-slate-400">
              Full-Stack Software Developer specializing in building exceptional
              digital experiences.
            </p>
          </div>

          {/* Middle: Quick Links */}
          <div>
            <h4 className="mb-4 text-slate-300 font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: "Projects", href: "#projects" },
                { label: "Skills", href: "#skills" },
                { label: "Resume", href: "#cv" },
                { label: "Blog", href: "#blog" },
                { label: "Contact", href: "#contact" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Contact Info & Icons */}
          <div>
            <h4 className="mb-4 text-slate-300 font-semibold">Connect</h4>
            <div className="space-y-2 text-slate-400 mb-4">
              <p>
                <span className="font-medium text-slate-300">Email:</span>{" "}
                imranmurtaza110110@gmail.com
              </p>
              <p>
                <span className="font-medium text-slate-300">Phone:</span>{" "}
                +44 7761 843752
              </p>
              <p>
                <span className="font-medium text-slate-300">Location:</span>{" "}
                Manchester, UK
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex gap-4 mt-4 text-xl">
              <a
                href="https://github.com/imranmurtaza110"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-slate-800 hover:bg-indigo-600 transition-colors"
              >
                <i className="fab fa-github"></i>
              </a>
              <a
                href="https://linkedin.com/in/imranmurtaza110110"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-slate-800 hover:bg-indigo-600 transition-colors"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 text-center text-slate-400 text-sm">
          <p>© 2025 Syed Imran Murtaza Zaidi. All rights reserved.</p>
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer;
