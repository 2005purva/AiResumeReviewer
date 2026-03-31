import { useState, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileSearch, Briefcase, Sparkles, Loader2, Target, RotateCcw, ArrowRight } from "lucide-react";
import ResumeUploader from "@/components/ResumeUploader";
import ScoreDisplay from "@/components/ScoreDisplay";

const TABS = [
  { id: "direct", label: "Resume Score", icon: FileSearch, desc: "Upload your resume and get an instant AI-powered quality score" },
  { id: "job", label: "Job Match", icon: Briefcase, desc: "See how well your resume matches a specific job description" },
];

const FEATURES = [
  { icon: "⚡", title: "Instant Analysis", desc: "Get results in seconds" },
  { icon: "🎯", title: "Smart Scoring", desc: "AI-powered evaluation" },
  { icon: "💡", title: "Actionable Tips", desc: "Clear improvement steps" },
];

const mockAnalyze = (mode) =>
  new Promise((resolve) =>
    setTimeout(() => {
      const score = Math.floor(Math.random() * 40) + 55;
      resolve({
        score,
        feedback:
          mode === "direct"
            ? "Your resume has a solid structure with clear section headings. Consider adding more quantified achievements and action verbs to strengthen impact."
            : "Your resume partially matches the job requirements. Key skills align well, but some required qualifications are missing from your experience section.",
        suggestions: [
          "Add measurable achievements (e.g., 'Increased sales by 30%')",
          "Use stronger action verbs at the start of bullet points",
          "Include relevant keywords from the industry",
          mode === "job" && "Tailor your summary to match the job requirements",
          mode === "job" && "Highlight transferable skills that align with the role",
        ].filter(Boolean),
      });
    }, 2000)
  );

const JobDescriptionField = forwardRef(({ value, onChange }, ref) => (
  <motion.div
    ref={ref}
    initial={{ opacity: 0, height: 0, marginTop: 0 }}
    animate={{ opacity: 1, height: "auto", marginTop: 20 }}
    exit={{ opacity: 0, height: 0, marginTop: 0 }}
    className="overflow-hidden"
  >
    <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3 font-display">
      <Target className="h-4 w-4 text-secondary" />
      Job Description
    </label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Paste the job description here to get a tailored match score..."
      rows={5}
      className="w-full rounded-xl border border-border/50 bg-muted/30 px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 resize-none transition-all backdrop-blur-sm"
    />
  </motion.div>
));
JobDescriptionField.displayName = "JobDescriptionField";

const ResultCard = forwardRef(({ activeTab, result }, ref) => (
  <motion.div
    ref={ref}
    initial={{ opacity: 0, y: 30, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="rounded-3xl glass-strong p-8 relative overflow-hidden"
  >
    {/* Top accent bar */}
    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
    <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3 font-display">
      <div className="rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 p-2">
        <Sparkles className="h-5 w-5 text-primary" />
      </div>
      {activeTab === "direct" ? "Resume Score" : "Job Match Score"}
    </h3>
    <ScoreDisplay score={result.score} feedback={result.feedback} suggestions={result.suggestions} />
  </motion.div>
));
ResultCard.displayName = "ResultCard";

const Index = () => {
  const [activeTab, setActiveTab] = useState("direct");
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const canSubmit = file && (activeTab === "direct" || jobDescription.trim().length > 20);

  const handleAnalyze = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await mockAnalyze(activeTab);
      setResult(data);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setJobDescription("");
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-primary/[0.04] blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-secondary/[0.03] blur-[100px]" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-accent/[0.03] blur-[100px]" />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* Header */}
      <header className="relative border-b border-border/30">
        <div className="mx-auto max-w-2xl px-5 py-8">
          <div className="flex items-center gap-5">
            <motion.div
              initial={{ rotate: -10, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              className="rounded-2xl bg-gradient-to-br from-primary to-secondary p-3.5 shadow-lg glow-primary"
            >
              <Sparkles className="h-7 w-7 text-primary-foreground" />
            </motion.div>
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl font-black font-display tracking-tight gradient-text"
              >
                AI Resume Reviewer
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-sm text-muted-foreground mt-1"
              >
                Smart insights to land your dream job
              </motion.p>
            </div>
          </div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-3 mt-6"
          >
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-2 rounded-full glass px-4 py-2 text-xs">
                <span>{f.icon}</span>
                <span className="text-muted-foreground font-medium">{f.title}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </header>

      <main className="relative mx-auto max-w-2xl px-5 py-8 space-y-6">
        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-1.5 rounded-2xl glass p-1.5"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setResult(null); }}
              className={`relative flex-1 flex items-center justify-center gap-2.5 rounded-xl px-4 py-3.5 text-sm font-bold transition-all duration-300 ${
                activeTab === tab.id ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="tab-bg"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary to-secondary glow-primary"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Description */}
        <motion.p
          key={activeTab}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-muted-foreground text-center px-4"
        >
          {TABS.find((t) => t.id === activeTab)?.desc}
        </motion.p>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-3xl glass-strong p-7 space-y-5 relative overflow-hidden"
        >
          {/* Subtle gradient overlay */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/[0.03] to-transparent pointer-events-none" />

          <div className="relative">
            <ResumeUploader file={file} onFileSelect={setFile} />

            <AnimatePresence>
              {activeTab === "job" && (
                <JobDescriptionField value={jobDescription} onChange={setJobDescription} />
              )}
            </AnimatePresence>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAnalyze}
                disabled={!canSubmit || loading}
                className="group flex-1 flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-4 text-sm font-bold text-primary-foreground glow-primary transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing your resume...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Analyze Resume
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              {(file || result) && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={handleReset}
                  className="rounded-xl glass px-5 py-4 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
                >
                  <RotateCcw className="h-4 w-4" />
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {result && <ResultCard activeTab={activeTab} result={result} />}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-border/20 mt-16">
        <div className="mx-auto max-w-2xl px-5 py-6 text-center">
          <p className="text-xs text-muted-foreground/50">
            • Your resume data is not stored
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
