function Home({ onContactClick }) {
  return (
    <div className="bg-slate-900/95 text-white min-h-screen">
      <section
        id="home"
        className="min-h-screen flex flex-col justify-center items-center text-center px-6"
      >
        {/* Welcome Tag */}
        <span className="px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-sm mb-6">
          👋 Welcome to my portfolio
        </span>

        {/* Name */}
        <h1 className="mb-4 text-4xl lg:text-6xl font-bold">
          I'm{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Syed Imran Murtaza Zaidi
          </span>
        </h1>

        {/* Role */}
        <h2 className="text-2xl lg:text-3xl text-slate-300 mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Full-Stack Software Developer
        </h2>

        {/* Description */}
        <p className="text-slate-400 max-w-2xl mb-8 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          I build scalable web applications and efficient system architectures
          with a focus on functionality, performance, and clean design.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={onContactClick}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-6 h-10 rounded-md text-sm font-medium transition-all"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 7 13.009 12.727a2 2 0 0 1-2.018 0L2 7"></path>
              <rect x="2" y="4" width="20" height="16" rx="2"></rect>
            </svg>
            Get In Touch
          </button>

          <button className="inline-flex items-center gap-2 border border-slate-600 hover:bg-slate-800 px-6 h-10 rounded-md text-sm font-medium transition-all">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 15V3"></path>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <path d="m7 10 5 5 5-5"></path>
            </svg>
            Download CV
          </button>
        </div>

        {/* Social Icons */}
        <div className="flex gap-6 text-slate-400 text-xl mb-12">
          <a
            href="https://github.com"
            className="hover:text-white transition"
            aria-label="GitHub"
          >
            <i className="fab fa-github"></i>
          </a>
          <a
            href="https://linkedin.com"
            className="hover:text-white transition"
            aria-label="LinkedIn"
          >
            <i className="fab fa-linkedin"></i>
          </a>
          <a
            href="https://twitter.com"
            className="hover:text-white transition"
            aria-label="Twitter"
          >
            <i className="fab fa-twitter"></i>
          </a>
        </div>
      </section>
    </div>
  );
}

export default Home;
