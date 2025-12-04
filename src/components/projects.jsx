import { useState, useEffect } from "react";
import { motion } from "framer-motion";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fallback image generator for projects without images
  const getFallbackImage = (title) => {
    // Split title into words and wrap to multiple lines if needed
    const words = title.split(' ');
    const maxCharsPerLine = 20;
    const lines = [];
    let currentLine = '';
    
    words.forEach((word) => {
      if (currentLine.length + word.length + 1 <= maxCharsPerLine) {
        currentLine = currentLine ? `${currentLine} ${word}` : word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    });
    if (currentLine) lines.push(currentLine);
    
    // Allow up to 3 lines, adjust font size based on number of lines
    const fontSize = lines.length > 2 ? 16 : lines.length > 1 ? 18 : 22;
    const lineHeight = fontSize + 6;
    
    // Calculate starting Y position to center all lines vertically
    const totalHeight = (lines.length - 1) * lineHeight;
    const startY = 50 - (totalHeight / 2) / 1.5; // Adjust for better centering
    
    // Generate multiple text elements for each line
    const textElements = lines.map((line, index) => {
      const yPos = `${startY + (index * lineHeight / 1.5)}%`;
      return `<text x="50%" y="${yPos}" font-family="Arial, sans-serif" font-size="${fontSize}" fill="white" text-anchor="middle" dominant-baseline="middle" style="font-weight: 600;">${line}</text>`;
    }).join('');
    
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#a855f7;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)"/>
        ${textElements}
      </svg>
    `)}`;
  };

  // Construct full image URL if it's a relative path
  const getImageUrl = (imageUrl, imageField, title) => {
    // Prefer image_url from serializer, then direct image field
    const imageSource = imageUrl || imageField;
    
    if (!imageSource) {
      return getFallbackImage(title);
    }
    
    // If it's already a full URL, return it
    if (imageSource.startsWith("http://") || imageSource.startsWith("https://")) {
      return imageSource;
    }
    
    // If it's a relative path, construct full URL
    if (imageSource.startsWith("/")) {
      return `${import.meta.env.VITE_API_URL}${imageSource}`;
    }
    
    return `${import.meta.env.VITE_API_URL}/${imageSource}`;
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log("Projects API Response:", responseData);

        // Handle paginated response (DRF might paginate)
        const data = Array.isArray(responseData)
          ? responseData
          : responseData.results || responseData;

        if (!Array.isArray(data)) {
          throw new Error("Invalid API response format");
        }

        // Transform API data to match component structure
        const transformedProjects = data.map((project) => {
          // Build image URL: prefer image_url from serializer, then direct image field
          let imageSrc;
          if (project.image_url) {
            // If DRF returns absolute URL, use as-is; otherwise prefix backend base
            imageSrc = project.image_url.startsWith("http")
              ? project.image_url
              : `${import.meta.env.VITE_API_URL}${project.image_url}`;
          } else if (project.image) {
            // Handle direct image field (relative path)
            imageSrc = project.image.startsWith("http")
              ? project.image
              : `${import.meta.env.VITE_API_URL}${project.image}`;
          } else {
            imageSrc = getFallbackImage(project.name || project.title);
          }

          return {
            id: project.id || project.uuid,
            title: project.name || project.title || "Untitled Project",
            description: project.description || "",
            tech: project.tech || [],
            image: imageSrc,
            github: project.github_url || project.github || "#",
            demo: project.demo_url || project.demo || "#",
          };
        });

        setProjects(transformedProjects);
        setError(null);
      } catch (err) {
        console.error("Projects API Error:", err);
        let errorMessage = "Failed to load projects";

        if (
          err.message.includes("Failed to fetch") ||
          err.message.includes("NetworkError")
        ) {
          errorMessage =
            `Cannot connect to backend server. Please make sure the Django server is running on ${import.meta.env.VITE_API_URL}`;
        } else {
          errorMessage = `Error: ${err.message}`;
        }

        setError(errorMessage);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const skeletonCards = Array.from({ length: 3 });

  return (
    <section
      id="projects"
      className="bg-slate-950 text-slate-100 py-24 px-6 border-t border-slate-800"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 mb-4"
          >
            Selected Work
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-indigo-400 via-sky-400 to-purple-400 bg-clip-text text-transparent"
          >
            Projects I&apos;ve Built
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto"
          >
            A collection of real-world projects showcasing my experience across
            full-stack development, APIs, and modern front-end engineering.
          </motion.p>
        </div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 rounded-xl border border-red-500/40 bg-red-500/10 text-red-100 px-4 py-3 text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {skeletonCards.map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 shadow-sm"
              >
                <div className="h-40 w-full animate-pulse bg-slate-800/80" />
                <div className="space-y-3 p-5">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-slate-700/80" />
                  <div className="h-4 w-full animate-pulse rounded bg-slate-800/80" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-slate-800/80" />
                  <div className="flex gap-2 pt-2">
                    <div className="h-6 w-16 animate-pulse rounded-full bg-slate-800/80" />
                    <div className="h-6 w-20 animate-pulse rounded-full bg-slate-800/80" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Projects Grid */}
        {!loading && projects.length > 0 && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <motion.article
                key={project.id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.12 }}
                viewport={{ once: true }}
                className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-950/80 shadow-sm ring-1 ring-slate-900/40 transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-500/70 hover:shadow-2xl hover:shadow-indigo-500/20"
              >
                {/* Project Image */}
                <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-fill transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/0 to-slate-900/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <h3 className="text-lg font-semibold text-slate-50">
                      {project.title}
                    </h3>
                  </div>

                  {project.description && (
                    <p className="mb-4 text-sm text-slate-400">
                      {project.description}
                    </p>
                  )}

                  {/* Tech Stack */}
                  {project.tech?.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {project.tech.map((tech, i) => (
                        <span
                          key={i}
                          className="rounded-full bg-slate-900/80 px-3 py-1 text-xs font-medium text-slate-200 ring-1 ring-slate-700/80"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="mt-auto flex gap-3 pt-3 text-sm">
                    {project.github && project.github !== "#" && (
                      <a
                        href={project.github}
                        className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/80 px-4 py-1.5 font-medium text-slate-100 ring-1 ring-slate-700 transition-colors duration-200 hover:bg-slate-800 hover:text-white hover:ring-indigo-400"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span>Code</span>
                        <span aria-hidden="true">↗</span>
                      </a>
                    )}
                    {project.demo && project.demo !== "#" && (
                      <a
                        href={project.demo}
                        className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600/90 px-4 py-1.5 font-medium text-white shadow-sm shadow-indigo-500/30 transition-colors duration-200 hover:bg-indigo-500"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span>Live Demo</span>
                        <span aria-hidden="true">▶</span>
                      </a>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && projects.length === 0 && !error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 px-6 py-10 text-center text-sm text-slate-400"
          >
            No projects are published yet. Add some in your backend to see them
            showcased here.
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default Projects;
