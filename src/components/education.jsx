import { useState, useEffect } from "react";
import { motion } from "framer-motion";

function Education() {
  const [educationData, setEducationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Format year range from start_year and end_year
  const formatYearRange = (startYear, endYear) => {
    if (!endYear) {
      return `${startYear} – Present`;
    }
    return `${startYear} – ${endYear}`;
  };

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/education/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log("Education API Response:", responseData);

        // Handle paginated response (DRF might paginate)
        const data = Array.isArray(responseData)
          ? responseData
          : responseData.results || responseData;

        if (!Array.isArray(data)) {
          throw new Error("Invalid API response format");
        }

        // Transform API data to match component structure
        const transformedData = data.map((edu) => ({
          id: edu.id || edu.uuid,
          degree: edu.degree,
          institution: edu.institution,
          year: formatYearRange(edu.start_year, edu.end_year),
          grade: edu.grade || "",
          description: edu.description || "",
          courses: edu.courses || [],
          skills: edu.skills || [],
        }));

        setEducationData(transformedData);
        setError(null);
      } catch (err) {
        console.error("Education API Error:", err);
        let errorMessage = "Failed to load education data";

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
        setEducationData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, []);

  return (
    <section
      id="education"
      className="bg-slate-950 text-slate-100 py-24 px-6 border-t border-slate-800"
    >
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <div className="mb-14 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="mb-4 inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-200"
          >
            Academic Journey
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-indigo-400 via-sky-400 to-purple-400 bg-clip-text text-3xl font-bold text-transparent md:text-4xl"
          >
            Education
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            viewport={{ once: true }}
            className="mx-auto mt-3 max-w-2xl text-sm text-slate-400 md:text-base"
          >
            A strong academic foundation in computer science, with emphasis on
            advanced software engineering, systems, and real-world problem
            solving.
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
            {[1, 2].map((_, index) => (
              <div key={index} className="relative ml-2 md:ml-4">
                <div className="absolute -left-[18px] top-2 flex h-4 w-4 items-center justify-center rounded-full bg-slate-950 md:-left-[22px]">
                  <div className="h-2.5 w-2.5 rounded-full bg-slate-800 animate-pulse" />
                </div>
                <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-slate-800/80 mb-2" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-slate-800/80 mb-2" />
                  <div className="h-4 w-1/3 animate-pulse rounded bg-slate-800/80" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Timeline */}
        {!loading && !error && (
          <div className="relative mt-4 space-y-10 border-l border-slate-800 pl-6 md:pl-8">
            {/* Vertical line gradient accent */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-indigo-500 via-slate-700 to-transparent" />

            {educationData.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 px-6 py-10 text-center text-sm text-slate-400"
              >
                No education entries published yet. Add some in your backend to see them
                showcased here.
              </motion.div>
            ) : (
              educationData.map((edu, index) => (
                <motion.article
                  key={edu.id || index}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  viewport={{ once: true }}
                  className="relative ml-2 md:ml-4"
                >
                  {/* Dot */}
                  <div className="absolute -left-[18px] top-2 flex h-4 w-4 items-center justify-center rounded-full bg-slate-950 md:-left-[22px]">
                    <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-tr from-indigo-400 via-sky-400 to-purple-400 shadow-[0_0_20px_rgba(79,70,229,0.6)]" />
                  </div>

                  {/* Card */}
                  <div className="group cursor-pointer rounded-2xl border border-slate-800/80 bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-950/95 p-[1px] shadow-sm ring-1 ring-slate-900/60 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/60 hover:ring-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/25">
                    <div className="flex flex-col gap-3 rounded-2xl bg-slate-950/95 p-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                      <div>
                        <h3 className="bg-gradient-to-r from-indigo-200 via-sky-200 to-purple-200 bg-clip-text text-base font-semibold text-transparent md:text-lg">
                          {edu.degree}
                        </h3>
                        <p className="mt-1 text-sm font-medium text-slate-200 md:text-base">
                          {edu.institution}
                        </p>
                        {edu.grade && (
                          <p className="mt-1 text-xs text-slate-400 md:text-sm">
                            {edu.grade}
                          </p>
                        )}
                        {edu.description && (
                          <p className="mt-2 text-xs text-slate-400 md:text-sm">
                            {edu.description}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col items-end justify-between gap-2 text-right text-xs text-slate-400 md:text-sm">
                        <span className="rounded-full bg-slate-900/90 px-3 py-1 font-medium text-slate-200 ring-1 ring-slate-700/80">
                          {edu.year}
                        </span>
                        <span className="text-[11px] uppercase tracking-wide text-slate-500">
                          {edu.year.includes("Present") ? "Ongoing" : "Completed"}
                        </span>
                      </div>
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


export default Education;