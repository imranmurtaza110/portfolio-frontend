import { useState, useEffect } from "react";
import { motion } from "framer-motion";

function Experience() {
  const [experienceData, setExperienceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Format date range from start_date and end_date
  const formatDateRange = (startDate, endDate) => {
    if (!startDate) return "";
    
    const start = new Date(startDate);
    const startYear = start.getFullYear();
    
    if (!endDate) {
      return `${startYear} – Present`;
    }
    
    const end = new Date(endDate);
    const endYear = end.getFullYear();
    
    // If same year, show just the year
    if (startYear === endYear) {
      return `${startYear}`;
    }
    
    return `${startYear} – ${endYear}`;
  };

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/experience/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log("Experience API Response:", responseData);

        // Handle paginated response (DRF might paginate)
        const data = Array.isArray(responseData)
          ? responseData
          : responseData.results || responseData;

        if (!Array.isArray(data)) {
          throw new Error("Invalid API response format");
        }

        // Transform API data to match component structure
        const transformedData = data.map((exp) => ({
          id: exp.id || exp.uuid,
          role: exp.title,
          company: exp.company,
          location: exp.location || "",
          work_mode: exp.work_mode || "remote",
          duration: formatDateRange(exp.start_date, exp.end_date),
          responsibilities: Array.isArray(exp.responsibilities) ? exp.responsibilities : (exp.responsibilities ? [exp.responsibilities] : []),
          tech_stack: exp.tech_stack || [],
        }));

        setExperienceData(transformedData);
        setError(null);
      } catch (err) {
        console.error("Experience API Error:", err);
        let errorMessage = "Failed to load experience data";

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
        setExperienceData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, []);

  return (
    <section
      id="experience"
      className="bg-slate-950 text-slate-100 py-24 px-6 border-t border-slate-800"
    >
      <div className="mx-auto max-w-5xl">
        {/* Section heading */}
        <div className="mb-14 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="mb-4 inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-medium text-purple-200"
          >
            Professional Experience
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-300 bg-clip-text text-3xl font-bold text-transparent md:text-4xl"
          >
            Experience
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            viewport={{ once: true }}
            className="mx-auto mt-3 max-w-2xl text-sm text-slate-400 md:text-base"
          >
            Roles where I&apos;ve built real products, supported teams, and
            delivered value with modern tools and engineering best practices.
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
          <div className="relative mt-4 space-y-10 border-l border-slate-800 pl-6 md:pl-8">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="relative ml-2 md:ml-4">
                <div className="absolute -left-[18px] top-2 flex h-4 w-4 items-center justify-center rounded-full bg-slate-950 md:-left-[22px]">
                  <div className="h-2.5 w-2.5 rounded-full bg-slate-800 animate-pulse" />
                </div>
                <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-slate-800/80 mb-2" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-slate-800/80 mb-2" />
                  <div className="h-4 w-full animate-pulse rounded bg-slate-800/80" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Timeline */}
        {!loading && !error && (
          <div className="relative mt-4 space-y-10 border-l border-slate-800 pl-6 md:pl-8">
            {/* Vertical line gradient accent */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-purple-500 via-slate-700 to-transparent" />

            {experienceData.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 px-6 py-10 text-center text-sm text-slate-400"
              >
                No experience entries published yet. Add some in your backend to see them
                showcased here.
              </motion.div>
            ) : (
              experienceData.map((exp, index) => (
                <motion.article
                  key={exp.id || index}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  viewport={{ once: true }}
                  className="relative ml-2 md:ml-4"
                >
                  {/* Dot */}
                  <div className="absolute -left-[18px] top-2 flex h-4 w-4 items-center justify-center rounded-full bg-slate-950 md:-left-[22px]">
                    <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-tr from-purple-400 via-pink-400 to-indigo-400 shadow-[0_0_20px_rgba(147,51,234,0.6)]" />
                  </div>

                  {/* Card */}
                  <div className="group cursor-pointer rounded-2xl border border-slate-800/80 bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-950/95 p-[1px] shadow-sm ring-1 ring-slate-900/60 transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/60 hover:ring-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/25">
                    <div className="rounded-2xl bg-slate-950/95 p-5 space-y-4">
                      {/* Header Section */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="space-y-1.5">
                          <h3 className="bg-gradient-to-r from-purple-200 via-pink-200 to-indigo-200 bg-clip-text text-base font-semibold text-transparent md:text-lg">
                            {exp.role}
                          </h3>
                          <p className="text-sm font-medium text-slate-200 md:text-base">
                            {exp.company}
                          </p>
                          <div className="flex flex-wrap gap-3 text-xs text-slate-400 md:text-sm">
                            {exp.location && <span>{exp.location}</span>}
                            {exp.work_mode && <span className="capitalize">{exp.work_mode}</span>}
                            <span>{exp.duration}</span>
                          </div>
                        </div>
                      </div>

                      {/* Responsibilities Section */}
                      {exp.responsibilities && exp.responsibilities.length > 0 && (
                        <div className="space-y-3 pt-3 border-t border-slate-800/50">
                          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Key Responsibilities
                          </h4>
                          <ul className="space-y-2.5">
                            {exp.responsibilities.map((responsibility, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-3 text-xs leading-relaxed text-slate-300 md:text-sm"
                              >
                                <span className="mt-1.5 flex-shrink-0 h-1.5 w-1.5 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 shadow-[0_0_8px_rgba(147,51,234,0.5)]" />
                                <span className="flex-1">{responsibility}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Tech Stack Section */}
                      {exp.tech_stack && exp.tech_stack.length > 0 && (
                        <div className="pt-3 border-t border-slate-800/50">
                          <div className="flex flex-wrap gap-2">
                            {exp.tech_stack.map((tech, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center rounded-md border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 text-[10px] font-medium text-purple-200 md:text-xs"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default Experience;
