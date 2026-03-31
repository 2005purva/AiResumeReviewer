import { useState, useRef, forwardRef } from "react";
import { Upload, FileText, X, FileUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FileDisplay = forwardRef(({ file, onRemove }, ref) => (
  <motion.div
    ref={ref}
    initial={{ opacity: 0, scale: 0.95, y: 10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95, y: -10 }}
    className="flex items-center gap-4 rounded-2xl glass p-5 glow-sm"
  >
    <div className="rounded-xl bg-primary/15 p-3">
      <FileText className="h-6 w-6 text-primary" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-foreground truncate">
        {file.name}
      </p>
      <p className="text-xs text-muted-foreground mt-0.5">
        {(file.size / 1024).toFixed(1)} KB • Ready to analyze
      </p>
    </div>
    <button
      onClick={onRemove}
      className="p-2 rounded-xl hover:bg-destructive/15 text-muted-foreground hover:text-destructive transition-all duration-200"
    >
      <X className="h-4 w-4" />
    </button>
  </motion.div>
));
FileDisplay.displayName = "FileDisplay";

const DropZone = forwardRef(
  (
    { isDragging, onDragIn, onDragOut, onDrag, onDrop, onClick },
    ref
  ) => (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onDragEnter={onDragIn}
      onDragLeave={onDragOut}
      onDragOver={onDrag}
      onDrop={onDrop}
      onClick={onClick}
      className={`group relative flex flex-col items-center justify-center gap-5 rounded-2xl border-2 border-dashed p-12 cursor-pointer transition-all duration-500 overflow-hidden ${
        isDragging
          ? "border-primary/60 bg-primary/10 scale-[1.01]"
          : "border-border/50 hover:border-primary/30 hover:bg-muted/30"
      }`}
    >
      {/* Animated background orb */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <motion.div
        animate={{ y: isDragging ? -5 : 0 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="relative rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 p-5 group-hover:scale-110 transition-transform duration-500"
      >
        <FileUp className="h-8 w-8 text-primary" />
      </motion.div>

      <div className="relative text-center space-y-2">
        <p className="text-base font-semibold text-foreground">
          Drag & drop your resume
        </p>
        <p className="text-sm text-muted-foreground">
          or{" "}
          <span className="text-primary font-medium cursor-pointer hover:underline underline-offset-4">
            browse files
          </span>
        </p>
        <p className="text-xs text-muted-foreground/50 pt-1">
          Supports PDF, DOC, DOCX, TXT
        </p>
      </div>
    </motion.div>
  )
);
DropZone.displayName = "DropZone";

const ResumeUploader = ({ onFileSelect, file }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragOut = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    if (f) onFileSelect(f);
  };

  const handleChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) onFileSelect(f);
  };

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleChange}
        className="hidden"
      />

      <AnimatePresence mode="wait">
        {file ? (
          <FileDisplay
            key="file"
            file={file}
            onRemove={() => onFileSelect(null)}
          />
        ) : (
          <DropZone
            key="dropzone"
            isDragging={isDragging}
            onDragIn={handleDragIn}
            onDragOut={handleDragOut}
            onDrag={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current && inputRef.current.click()}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResumeUploader;