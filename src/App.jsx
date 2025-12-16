import "./index.css";
import { useState, useEffect } from "react";
import Navbar from "./components/navbar";
import Home from "./components/home";
import DeveloperCard from "./components/develperCard";
import Skills from "./components/skill";
import Education from "./components/education";
import Experience from "./components/experience";
import Blog from "./components/blog";
import Projects from "./components/projects";
import CreateAdmin from "./components/createAdmin";
import Footer from "./components/footer";
import SectionDivider from "./components/sectionDivider";
import CustomCursor from "./components/customCursor";

function App() {
  const [isCreateAdminOpen, setIsCreateAdminOpen] = useState(false);
  const [theme, setTheme] = useState("dark");
   const [cursorStyle, setCursorStyle] = useState("custom");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");

  // Open LinkedIn with a pre-written message (copied to clipboard)
  const handleLinkedInContact = async () => {
    const name = "Imran";
    const message = `Hi Syed, this is ${name} from your portfolio website.`;
    const linkedInUrl = "https://www.linkedin.com/in/imranmurtaza110110/";

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(message);
        alert(
          "LinkedIn is opening in a new tab.\n\nThe message has been copied – just paste it into the chat."
        );
      } else {
        alert(
          "LinkedIn is opening in a new tab.\n\nYou can send this message:\n\n" +
            message
        );
      }
    } catch (err) {
      console.debug("Failed to copy contact message:", err);
      alert(
        "LinkedIn is opening in a new tab.\n\nYou can send this message:\n\n" +
          message
      );
    }

    window.open(linkedInUrl, "_blank", "noopener,noreferrer");
  };

  // Keep server awake: ping health endpoint every 10 minutes
  useEffect(() => {
    const HEALTH_URL = `${import.meta.env.VITE_API_URL}/health/`;

    const pingServer = async () => {
      if (!navigator.onLine) return;
      try {
        await fetch(HEALTH_URL, { method: "GET", cache: "no-store" });
      } catch (err) {
        // Silently ignore errors – this is just a keep-alive
        console.debug("Health ping failed (ignored):", err?.message || err);
      }
    };

    // Initial ping on load
    pingServer();

    // Then every 10 minutes
    const intervalId = setInterval(pingServer, 10 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch resume URL from backend API
  useEffect(() => {
    const fetchResumeUrl = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/uploads/active/resume/`);
        if (response.ok) {
          const data = await response.json();
          if (data.file_url) {
            // Construct full URL if it's relative
            const url = data.file_url.startsWith('http') 
              ? data.file_url 
              : `${import.meta.env.VITE_API_URL}${data.file_url}`;
            setResumeUrl(url);
          }
        }
      } catch (error) {
        console.error("Error fetching resume URL:", error);
      }
    };
    fetchResumeUrl();
  }, []);

  // Check URL for admin creation access
  useEffect(() => {
    const checkUrl = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const hash = window.location.hash;
      
      const hasQueryParam = urlParams.get('admin') === 'create';
      const hasHash = hash === '#admin-create' || hash === 'admin-create';
      
      if (hasQueryParam || hasHash) {
        console.log('Opening admin creation modal from URL');
        setIsCreateAdminOpen(true);
        // Clean URL after opening modal
        setTimeout(() => {
          window.history.replaceState({}, '', window.location.pathname);
        }, 500);
      }
    };
    
    // Check immediately
    checkUrl();
    
    // Also listen for hash changes (in case user navigates)
    const handleHashChange = () => {
      checkUrl();
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const toggleCursor = () => {
    setCursorStyle((prev) => (prev === "custom" ? "default" : "custom"));
  };

  return (
    <div
      data-theme={theme}
      className={`min-h-screen transition-colors duration-300 ${
        cursorStyle === "custom" ? "use-custom-cursor" : ""
      }`}
    >
      {cursorStyle === "custom" && <CustomCursor />}
      <Navbar
        onContactClick={handleLinkedInContact}
        theme={theme}
        onToggleTheme={toggleTheme}
        onToggleCursor={toggleCursor}
        isCustomCursor={cursorStyle === "custom"}
        resumeUrl={resumeUrl}
      />
      <Home 
        onContactClick={handleLinkedInContact} 
        resumeUrl={resumeUrl}
      />
      <SectionDivider />
      <DeveloperCard />
      <SectionDivider />
      <Skills />
      <SectionDivider />
      <Education />
      <SectionDivider />
      <Experience />
      <SectionDivider />
      <Blog />
      <SectionDivider />
      <Projects />
      <CreateAdmin isOpen={isCreateAdminOpen} onClose={() => setIsCreateAdminOpen(false)} />
      <SectionDivider />
      <Footer />

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 via-indigo-500 to-purple-500 text-white shadow-lg shadow-sky-500/30 ring-1 ring-sky-300/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-sky-500/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-400"
        >
          <span className="text-xl leading-none">↑</span>
        </button>
      )}
    </div>
  );
}

export default App;
