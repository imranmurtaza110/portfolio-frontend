function Navbar({
  onContactClick = () => console.warn("onContactClick not provided"),
  theme = "dark",
  onToggleTheme = () => {},
  onToggleCursor = () => {},
  isCustomCursor = true,
}) {
  const isDark = theme === "dark";

  const baseClasses =
    "fixed top-0 left-0 z-50 w-full backdrop-blur-sm border-b transition-colors duration-300";
  const themeClasses = isDark
    ? "bg-slate-900/95 text-white border-slate-800 shadow-md ring-2 ring-blue-500/50"
    : "bg-white/90 text-slate-900 border-slate-200 shadow-sm";

  return (
    <nav className={`${baseClasses} ${themeClasses}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Left side — Name + theme toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleCursor}
            className={`relative inline-flex items-center gap-2 rounded-full border px-3 py-1.5 shadow-sm outline-none transition-colors duration-200 ${
              isCustomCursor
                ? "border-sky-400 bg-slate-900/80 shadow-sky-500/30"
                : "border-slate-700/70 bg-slate-900/60 shadow-slate-900/10"
            }`}
            title="Toggle custom cursor"
          >
            <span
              className={`h-2 w-2 rounded-full transition-all duration-200 ${
                isCustomCursor
                  ? "bg-gradient-to-tr from-emerald-400 via-sky-400 to-indigo-400 shadow-[0_0_10px_rgba(56,189,248,0.9)] opacity-100"
                  : "bg-slate-500 shadow-none opacity-60"
              }`}
            />
            <span className="font-brand text-[11px] font-semibold tracking-[0.3em] text-slate-100 md:text-xs">
              SIMZ
            </span>
          </button>
          {/* Theme toggle next to name (desktop) */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="hidden items-center gap-1 rounded-full border border-slate-600/40 bg-slate-900/40 px-3 py-1 text-xs font-medium text-slate-100 shadow-sm transition-colors duration-200 hover:border-blue-400 hover:text-white md:inline-flex"
          >
            <span>{isDark ? "🌙" : "☀️"}</span>
          </button>
        </div>

        {/* Right side — nav links (desktop) + mobile theme/menu */}
        <div className="flex items-center gap-4">
          {/* Menu links (desktop) */}
          <ul className="hidden space-x-8 text-xs font-nav font-medium md:flex md:text-sm">
            {["Home", "Projects", "Skills", "Resume", "Blog", "Contact"].map(
              (item) => (
                <li key={item}>
                  {item === "Contact" ? (
                    <button
                      onClick={() => {
                        onContactClick();
                      }}
                      className="cursor-pointer transition-colors duration-200 hover:text-blue-400"
                    >
                      {item}
                    </button>
                  ) : (
                    <a
                      href={`#${item.toLowerCase()}`}
                      className="transition-colors duration-200 hover:text-blue-400"
                    >
                      {item}
                    </a>
                  )}
                </li>
              ),
            )}
          </ul>

          {/* Mobile: theme toggle + menu icon */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              type="button"
              onClick={onToggleTheme}
              className="flex items-center gap-1 rounded-full border border-slate-600/40 bg-slate-900/40 px-2.5 py-1 text-xs font-medium text-slate-100 shadow-sm transition-colors duration-200 hover:border-blue-400 hover:text-white"
            >
              <span>{isDark ? "🌙" : "☀️"}</span>
            </button>
            <button className="rounded-lg border p-2 hover:bg-gray-800">☰</button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
