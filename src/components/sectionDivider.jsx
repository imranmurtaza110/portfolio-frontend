import { motion } from "framer-motion";

function SectionDivider() {
  return (
    <div className="relative my-10 flex items-center justify-center">
      {/* Main subtle line */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0.7 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="h-px w-full max-w-5xl bg-gradient-to-r from-transparent via-slate-500/40 to-transparent"
      />

      {/* Center glow pill (very soft, neutral) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="absolute flex items-center justify-center"
      >
        <div className="h-2 w-20 rounded-full bg-gradient-to-r from-slate-500 via-slate-400 to-slate-500 blur-[1px]" />
        <div className="absolute h-6 w-28 rounded-full bg-slate-500/10 blur-2xl" />
      </motion.div>
    </div>
  );
}

export default SectionDivider;


