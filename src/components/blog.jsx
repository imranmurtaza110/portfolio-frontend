import { useState, useEffect } from "react";
import { motion } from "framer-motion";

function Blog() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fallback image generator for posts without images
  const getFallbackImage = (title) => {
    // Create a simple gradient placeholder based on title
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="600" height="300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#a855f7;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="600" height="300" fill="url(#grad)"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle">${title}</text>
      </svg>
    `)}`;
  };

  // Format date from backend
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
  };

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const responseData = await response.json();
        console.log("Blog API Response:", responseData);

        // Handle paginated response (DRF might paginate)
        const data = Array.isArray(responseData) 
          ? responseData 
          : (responseData.results || responseData);

        if (!Array.isArray(data)) {
          throw new Error("Invalid API response format");
        }

        // Transform API data to match component structure
        const transformedPosts = data.map((post) => {
          // Build image URL: prefer uploaded file, then image_url, then fallback
          let imageSrc;
          if (post.image) {
            // If DRF returns absolute URL, use as-is; otherwise prefix backend base
            imageSrc = post.image.startsWith("http")
              ? post.image
              : `${import.meta.env.VITE_API_URL}${post.image}`;
          } else if (post.image_url) {
            imageSrc = post.image_url;
          } else {
            imageSrc = getFallbackImage(post.title);
          }

          return {
            id: post.id || post.uuid,
            title: post.title,
            date: formatDate(post.date),
            summary: post.summary,
            image: imageSrc,
            link: post.link || "#",
          };
        });

        setBlogPosts(transformedPosts);
        setError(null);
      } catch (err) {
        console.error("Blog API Error:", err);
        let errorMessage = "Failed to load blog posts";
        
        if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
          errorMessage = `Cannot connect to backend server. Please make sure the Django server is running on ${import.meta.env.VITE_API_URL}`;
        } else {
          errorMessage = `Error: ${err.message}`;
        }
        
        setError(errorMessage);
        setBlogPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  // Handle image loading errors
  const handleImageError = (e, title) => {
    e.target.src = getFallbackImage(title);
  };

  const skeletonCards = Array.from({ length: 3 });

  return (
    <section
      id="blog"
      className="bg-slate-950 text-slate-100 py-24 px-6 border-t border-slate-800 font-blog-body"
    >
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="mb-14 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="mb-4 inline-flex items-center rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1.5 text-xs font-medium text-sky-200"
          >
            Writing & Insights
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="font-blog-heading bg-gradient-to-r from-indigo-400 via-sky-400 to-purple-400 bg-clip-text text-3xl font-bold leading-tight text-transparent md:text-4xl md:pb-1"
          >
            Blog
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            viewport={{ once: true }}
            className="mx-auto mt-3 max-w-2xl text-sm text-slate-400 md:text-base"
          >
            Short write-ups on engineering challenges, backend design, and
            lessons learned while building real-world projects.
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
                className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-sm"
              >
                <div className="h-40 w-full animate-pulse bg-slate-800/80" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-20 animate-pulse rounded bg-slate-700/80" />
                  <div className="h-5 w-3/4 animate-pulse rounded bg-slate-700/80" />
                  <div className="h-4 w-full animate-pulse rounded bg-slate-800/80" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-slate-800/80" />
                  <div className="h-4 w-24 animate-pulse rounded bg-slate-700/80" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Blog grid */}
        {!loading && !error && (
          <>
            {blogPosts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 px-6 py-10 text-center text-sm text-slate-400"
              >
                No blog posts published yet. Once you add posts in your backend,
                they will appear here.
              </motion.div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {blogPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.12 }}
                    viewport={{ once: true }}
                    className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-950/90 shadow-sm ring-1 ring-slate-900/40 transition-all duration-300 hover:-translate-y-1.5 hover:border-sky-500/70 hover:shadow-2xl hover:shadow-sky-500/20"
                  >
                    <div className="relative h-40 w-full overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => handleImageError(e, post.title)}
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/0 to-slate-900/0 opacity-80" />
                      {post.date && (
                        <span className="absolute bottom-3 left-3 rounded-full bg-slate-950/90 px-3 py-1 text-xs font-medium text-slate-200 ring-1 ring-slate-700/80">
                          {post.date}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="mb-2 text-base font-semibold text-slate-50 md:text-lg font-blog-heading">
                        {post.title}
                      </h3>
                      {post.summary && (
                        <p className="mb-4 text-sm text-slate-400 line-clamp-4">
                          {post.summary}
                        </p>
                      )}

                      {post.link && post.link !== "#" && (
                        <a
                          href={post.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-sky-300 transition-colors duration-200 hover:text-sky-100"
                        >
                          <span>Read article</span>
                          <span aria-hidden="true">↗</span>
                        </a>
                      )}
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

export default Blog;
