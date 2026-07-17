"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Upload, FileText, Sparkles, Loader2, AlertCircle } from "lucide-react";

interface ResumeUploadProps {
  onSessionCreated: (sessionData: {
    sessionId: string;
    token: string;
    roomName: string;
    serverUrl: string;
  }) => void;
}

export default function ResumeUpload({ onSessionCreated }: ResumeUploadProps) {
  const [jobDescription, setJobDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "application/pdf") {
        setError("Only PDF files are supported currently.");
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError("");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type !== "application/pdf") {
        setError("Only PDF files are supported currently.");
        return;
      }
      setFile(droppedFile);
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload your PDF resume.");
      return;
    }
    if (!jobDescription.trim()) {
      setError("Please provide a job description.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Get current auth token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("You must be logged in to create a session.");
      }

      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jobDescription);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const response = await fetch(`${apiUrl}/session/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create interview session.");
      }

      onSessionCreated(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col"
    >
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" /> Start a Mock Interview
      </h2>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Job Description Input */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Target Job Description
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description you are preparing for..."
            className="w-full min-h-[120px] p-4 rounded-xl backdrop-blur-md bg-white/[0.02] border border-white/[0.08] text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-sans text-sm resize-none"
          />
        </div>

        {/* Resume Dropzone */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Upload Resume (PDF)
          </label>
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[150px] ${
              file
                ? "border-primary/50 bg-primary/5"
                : "border-white/[0.08] hover:border-primary/30 hover:bg-white/[0.02]"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf"
              className="hidden"
            />
            {file ? (
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-xl border border-primary/20 text-primary">
                  <FileText className="w-8 h-8" />
                </div>
                <div className="text-white text-sm font-medium truncate max-w-[250px]">
                  {file.name}
                </div>
                <div className="text-slate-500 text-xs font-mono">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-white/[0.03] rounded-xl border border-white/[0.08] text-slate-400">
                  <Upload className="w-8 h-8" />
                </div>
                <div className="text-slate-300 text-sm font-medium">
                  Drag & drop your PDF resume here, or click to upload
                </div>
                <div className="text-slate-500 text-xs">
                  Only PDF files are supported
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl bg-primary text-primary-foreground hover:shadow-glow font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Parsing Resume & Starting...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Start Mock Interview
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
