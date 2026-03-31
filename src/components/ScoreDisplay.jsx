import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle, XCircle, TrendingUp, Lightbulb } from "lucide-react";

const ScoreDisplay = ({ score, feedback, suggestions }) => {
  const getScoreColor = () => {
    if (score >= 75) return "text-accent";
    if (score >= 50) return "text-score-good";
    return "text-destructive";
  };

  const getScoreGradient = () => {
    if (score >= 75) return "from-accent to-primary";
    if (score >= 50) return "from-score-good to-primary";
    return "from-destructive to-score-good";
  };

  const getScoreStroke = () => {
    if (score >= 75) return "url(#gradient-excellent)";
    if (score >= 50) return "url(#gradient-good)";
    return "url(#gradient-poor)";
  };

  const getScoreLabel = () => {
    if (score >= 75) return "Excellent";
    if (score >= 50) return "Good";
    return "Needs Work";
  };

  const getScoreIcon = () => {
    if (score >= 75) return <CheckCircle className="h-4 w-4" />;
    if (score >= 50) return <AlertTriangle className="h-4 w-4" />;
    return <XCircle className="h-4 w-4" />;
  };

  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Score Circle */}
      <div className="flex flex-col items-center gap-5">
        <div className="relative w-44 h-44">
          <div className={`absolute inset-4 rounded-full bg-gradient-to-br ${getScoreGradient()} opacity-20 blur-2xl`} />

          <svg className="w-full h-full -rotate-90 relative z-10" viewBox="0 0 120 120">
            <defs>
              <linearGradient id="gradient-excellent" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(160, 84%, 39%)" />
                <stop offset="100%" stopColor="hsl(199, 89%, 48%)" />
              </linearGradient>
              <linearGradient id="gradient-good" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(45, 93%, 47%)" />
                <stop offset="100%" stopColor="hsl(199, 89%, 48%)" />
              </linearGradient>
              <linearGradient id="gradient-poor" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(0, 72%, 51%)" />
                <stop offset="100%" stopColor="hsl(45, 93%, 47%)" />
              </linearGradient>
            </defs>

            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="hsl(230, 15%, 18%)"
              strokeWidth="5"
            />

            <motion.circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke={getScoreStroke()}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.8, ease: "easeOut" }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <motion.span
              className={`text-5xl font-black font-display ${getScoreColor()}`}
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, type: "spring", stiffness: 150 }}
            >
              {score}
            </motion.span>
            <span className="text-xs text-muted-foreground font-medium mt-1">
              out of 100
            </span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className={`flex items-center gap-2 font-bold text-sm ${getScoreColor()} px-5 py-2 rounded-full glass`}
        >
          {getScoreIcon()}
          {getScoreLabel()}
        </motion.div>
      </div>

      {/* Feedback */}
      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl glass p-5"
        >
          <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2 font-display">
            <TrendingUp className="h-4 w-4 text-primary" />
            Analysis Summary
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {feedback}
          </p>
        </motion.div>
      )}

      {/* Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-foreground flex items-center gap-2 font-display">
            <Lightbulb className="h-4 w-4 text-score-good" />
            Improvement Tips
          </h4>

          <div className="space-y-2">
            {suggestions.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 + i * 0.12 }}
                className="flex items-start gap-3 text-sm text-muted-foreground rounded-xl glass p-4"
              >
                <span
                  className={`mt-1 h-2 w-2 rounded-full bg-gradient-to-r ${getScoreGradient()} shrink-0`}
                />
                {s}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ScoreDisplay;