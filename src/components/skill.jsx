import { useState, useEffect } from "react";
import { motion } from "framer-motion";

function Skills() {
  const [hovered, setHovered] = useState(null);
  const [skillCategories, setSkillCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Map category names to colors
  const categoryColorMap = {
    Frontend: "indigo",
    Backend: "purple",
    "Cloud / DevOps": "pink",
    Cloud: "pink",
    DevOps: "pink",
    Tools: "blue",
    Other: "gray",
  };

  // Default color if category not found
  const getDefaultColor = (index) => {
    const colors = ["indigo", "purple", "pink", "blue", "green"];
    return colors[index % colors.length];
  };

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/skills/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log("Skills API Response:", responseData);

        // Handle paginated response (DRF might paginate)
        const data = Array.isArray(responseData)
          ? responseData
          : responseData.results || responseData;

        if (!Array.isArray(data)) {
          throw new Error("Invalid API response format");
        }

        // Transform API data to match component structure
        // Group skills by category
        const groupedByCategory = {};

        data.forEach((skill) => {
          // Get category name from nested object or direct field
          const categoryName =
            skill.category?.category_name ||
            skill.category_name ||
            "Other";

          if (!groupedByCategory[categoryName]) {
            groupedByCategory[categoryName] = {
              title: categoryName,
              color:
                categoryColorMap[categoryName] ||
                getDefaultColor(Object.keys(groupedByCategory).length),
              skills: [],
            };
          }

          groupedByCategory[categoryName].skills.push({
            name: skill.name,
            proficiency: skill.proficiency_percent || 0,
          });
        });

        // Convert object to array
        const categoriesArray = Object.values(groupedByCategory);
        setSkillCategories(categoriesArray);
        setError(null);
      } catch (err) {
        console.error("Skills API Error:", err);
        let errorMessage = "Failed to load skills";

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
        setSkillCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  // Tailwind-safe color map
  const colorMap = {
    indigo: "from-indigo-500/40 via-indigo-400/20 to-slate-900/40 border-indigo-500/40",
    purple: "from-purple-500/40 via-purple-400/20 to-slate-900/40 border-purple-500/40",
    pink: "from-pink-500/40 via-pink-400/20 to-slate-900/40 border-pink-500/40",
    blue: "from-sky-500/40 via-sky-400/20 to-slate-900/40 border-sky-500/40",
    green:
      "from-emerald-500/40 via-emerald-400/20 to-slate-900/40 border-emerald-500/40",
    gray: "from-slate-500/40 via-slate-400/20 to-slate-900/40 border-slate-500/40",
  };

  const getPillColorClasses = (color) => {
    const textClasses = {
      indigo: "text-indigo-200",
      purple: "text-purple-200",
      pink: "text-pink-200",
      blue: "text-sky-200",
      green: "text-emerald-200",
      gray: "text-slate-200",
    };

    return (
      colorMap[color] ||
      "from-indigo-500/40 via-indigo-400/20 to-slate-900/40 border-indigo-500/40"
    ) +
      " " +
      (textClasses[color] || "text-indigo-200");
  };

  const getHeadingAccentColor = (color) => {
    const accent = {
      indigo: "from-indigo-400 via-sky-400 to-indigo-300",
      purple: "from-purple-400 via-pink-400 to-purple-300",
      pink: "from-pink-400 via-rose-400 to-pink-200",
      blue: "from-sky-400 via-cyan-400 to-sky-300",
      green: "from-emerald-400 via-lime-400 to-emerald-300",
      gray: "from-slate-300 via-slate-400 to-slate-200",
    };

    return (
      accent[color] || "from-indigo-400 via-sky-400 to-indigo-300"
    );
  };

  const handleMouseEnter = (skillName) => {
    setHovered(skillName);
  };

  const handleMouseLeave = (skillName) => {
    // Reset after a brief delay so the percentage lingers a bit
    setTimeout(() => {
      setHovered((prev) => (prev === skillName ? null : prev));
    }, 800);
  };

  const skeletonCards = Array.from({ length: 3 });

  return (
    <section
      id="skills"
      className="bg-slate-950 text-slate-100 py-24 px-6 border-t border-slate-800"
    >
      <div className="mx-auto max-w-6xl">
        {/* Section Heading */}
        <div className="mb-14 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="mb-4 inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-200"
          >
            Skills & Tooling
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-indigo-400 via-sky-400 to-purple-400 bg-clip-text text-3xl font-bold text-transparent md:text-4xl"
          >
            What I Work With
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            viewport={{ once: true }}
            className="mx-auto mt-3 max-w-2xl text-sm text-slate-400 md:text-base"
          >
            A balanced mix of front-end, back-end, and cloud tooling I use to
            build reliable, production-ready applications.
          </motion.p>
        </div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100"
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
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm"
              >
                <div className="mb-4 h-5 w-1/2 animate-pulse rounded bg-slate-700/80" />
                <div className="space-y-3">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-slate-800/80" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-slate-800/80" />
                  <div className="flex flex-wrap gap-2 pt-2">
                    <div className="h-7 w-16 animate-pulse rounded-full bg-slate-800/80" />
                    <div className="h-7 w-20 animate-pulse rounded-full bg-slate-800/80" />
                    <div className="h-7 w-14 animate-pulse rounded-full bg-slate-800/80" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && (
          <>
            {skillCategories.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 px-6 py-10 text-center text-sm text-slate-400"
              >
                No skills are configured yet. Add skills in your backend to see
                them visualised here.
              </motion.div>
            ) : (
              <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                {skillCategories.map((category, catIndex) => (
                  <motion.article
                    key={category.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: catIndex * 0.12 }}
                    viewport={{ once: true }}
                    className={`flex flex-col cursor-pointer rounded-2xl border bg-gradient-to-br ${getPillColorClasses(
                      category.color,
                    )} p-[1px] shadow-sm ring-1 ring-slate-900/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/25`}
                  >
                    <div className="flex h-full flex-col rounded-2xl bg-slate-950/90 p-5">
                      <header className="mb-4 flex items-center justify-between gap-2">
                        <h3 className="bg-gradient-to-r from-indigo-200 via-sky-200 to-purple-200 bg-clip-text text-base font-semibold text-transparent md:text-lg">
                          {category.title}
                        </h3>
                        <span
                          className={`rounded-full bg-gradient-to-r ${getHeadingAccentColor(
                            category.color,
                          )} px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-900`}
                        >
                          Core
                        </span>
                      </header>

                      <div className="space-y-2.5">
                        {category.skills.map((skill) => {
                          const isHovered = hovered === skill.name;

                          return (
                            <button
                              key={skill.name}
                              type="button"
                              onMouseEnter={() =>
                                handleMouseEnter(skill.name)
                              }
                              onMouseLeave={() =>
                                handleMouseLeave(skill.name)
                              }
                              className="group relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-xl bg-slate-900/80 px-3.5 py-2 text-left text-xs text-slate-100 ring-1 ring-slate-800 transition-all duration-300 hover:-translate-y-0.5 hover:ring-indigo-400/70 md:text-sm"
                            >
                              {/* Background proficiency bar */}
                              <div
                                className="pointer-events-none absolute inset-y-0 left-0 w-0 bg-gradient-to-r from-indigo-500/30 via-sky-400/30 to-emerald-400/20 transition-all duration-500 ease-out group-hover:w-full"
                                style={{
                                  width: isHovered
                                    ? `${Math.max(
                                        20,
                                        Math.min(skill.proficiency, 100),
                                      )}%`
                                    : "0%",
                                }}
                              />

                              <span className="relative z-10 font-medium">
                                {skill.name}
                              </span>

                              <span
                                className={`relative z-10 flex items-center gap-1 text-[11px] font-semibold text-slate-300 md:text-xs transition-all duration-300 ${
                                  isHovered
                                    ? "opacity-100 translate-y-0"
                                    : "pointer-events-none opacity-0 translate-y-1"
                                }`}
                              >
                                <span className="h-1.5 w-10 overflow-hidden rounded-full bg-slate-800">
                                  <span
                                    className="block h-full rounded-full bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 transition-all duration-500"
                                    style={{
                                      width: `${Math.max(
                                        isHovered ? 15 : 0,
                                        Math.min(skill.proficiency, 100),
                                      )}%`,
                                    }}
                                  />
                                </span>
                                <span>{skill.proficiency}%</span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default Skills;
