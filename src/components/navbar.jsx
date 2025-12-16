import { useState } from "react";

function Navbar({
  onContactClick = () => console.warn("onContactClick not provided"),
  theme = "dark",
  onToggleTheme = () => {},
  onToggleCursor = () => {},
  isCustomCursor = true,
  resumeUrl = "",
}) {
  const isDark = theme === "dark";
  const [downloadError, setDownloadError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleDownloadResume = async () => {
    setIsDownloading(true);
    setDownloadError(null);

    try {
      // Use backend proxy endpoint to avoid CORS issues
      const apiUrl = import.meta.env.VITE_API_URL;
      
      if (!apiUrl) {
        throw new Error("API URL not configured");
      }

      const downloadUrl = `${apiUrl}/api/uploads/download/resume/`;
      console.log("Attempting to download from:", downloadUrl);
      
      // Try to fetch the file first to check if it's available
      const response = await fetch(downloadUrl);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Resume not found");
        } else if (response.status >= 500) {
          throw new Error("Server error");
        } else {
          throw new Error("Download failed");
        }
      }

      // Get the blob from response
      const blob = await response.blob();
      
      // Create blob URL and trigger download
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "resume.docx";
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up blob URL
      window.URL.revokeObjectURL(blobUrl);

      // Clear error after successful download
      setIsDownloading(false);
    } catch (error) {
      console.error("Error downloading resume:", error);
      setDownloadError(error.message || "Download failed");
      setIsDownloading(false);
      
      // Auto-hide error after 3 seconds
      setTimeout(() => setDownloadError(null), 3000);
    }
  };

  const baseClasses =
    "fixed top-0 left-0 z-50 w-full backdrop-blur-sm border-b transition-colors duration-300";
  const themeClasses = isDark
    ? "bg-slate-900/95 text-white border-slate-800 shadow-md ring-2 ring-blue-500/50"
    : "bg-white/90 text-slate-900 border-slate-200 shadow-sm";

  return (
    <nav className={`${baseClasses} ${themeClasses}`}>
      {/* Error Toast */}
      {downloadError && (
        <div className="fixed top-20 right-6 z-[100] px-4 py-3 bg-red-500/90 border border-red-500 rounded-lg text-white text-sm shadow-lg">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{downloadError}</span>
          </div>
        </div>
      )}
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
                  ) : item === "Resume" && resumeUrl ? (
                    <button
                      onClick={handleDownloadResume}
                      disabled={isDownloading}
                      className="cursor-pointer transition-colors duration-200 hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      title={isDownloading ? "Downloading..." : "Download Resume"}
                    >
                      {isDownloading ? "Downloading..." : item}
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
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="rounded-lg border border-slate-600/60 bg-slate-900/60 p-2 text-sm hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile dropdown menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-700/60 bg-slate-900/95">
          <div className="mx-auto max-w-7xl px-6 py-3">
            <ul className="space-y-2 text-sm font-nav">
              {["Home", "Projects", "Skills", "Resume", "Blog", "Contact"].map(
                (item) => (
                  <li key={item}>
                    {item === "Contact" ? (
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          onContactClick();
                        }}
                        className="w-full text-left py-2 text-slate-100 hover:text-blue-400"
                      >
                        {item}
                      </button>
                    ) : item === "Resume" && resumeUrl ? (
                      <button
                        onClick={async () => {
                          setIsMobileMenuOpen(false);
                          await handleDownloadResume();
                        }}
                        disabled={isDownloading}
                        className="w-full text-left py-2 text-slate-100 hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        title={isDownloading ? "Downloading..." : "Download Resume"}
                      >
                        {isDownloading ? "Downloading..." : item}
                      </button>
                    ) : (
                      <a
                        href={`#${item.toLowerCase()}`}
                        className="block py-2 text-slate-100 hover:text-blue-400"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item}
                      </a>
                    )}
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
