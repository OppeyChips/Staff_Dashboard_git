"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function ResearchPage() {
  const [formData, setFormData] = useState({
    commands: "",
    module: "",
    suggestions: "",
    workflow: "",
    ideas: "",
    channelId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/discord/send-research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✓ Research data sent successfully!");
        // Clear form
        setFormData({
          commands: "",
          module: "",
          suggestions: "",
          workflow: "",
          ideas: "",
          channelId: "",
        });
      } else {
        setMessage(`✗ Error: ${data.error || "Failed to send data"}`);
      }
    } catch (error) {
      setMessage("✗ Error: Failed to send data");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="relative w-full h-full overflow-auto">
      {/* Purple glow from top right */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 p-8 md:p-12 max-w-5xl mx-auto">
        <h1 className="text-3xl font-light text-white/90 mb-2 tracking-tight">
          Research & Development
        </h1>
        <p className="text-white/40 mb-12 text-sm">
          Document your research findings and send them to Discord
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Commands Section */}
          <div className="group">
            <label className="block text-sm font-light text-white/60 mb-2 uppercase tracking-wider">
              Commands
            </label>
            <textarea
              name="commands"
              value={formData.commands}
              onChange={handleChange}
              placeholder="Enter command details..."
              className="w-full h-32 bg-white/[0.02] border border-white/10 rounded-md px-4 py-3 text-white/90 placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.03] transition-all resize-none"
            />
          </div>

          {/* Module Section */}
          <div className="group">
            <label className="block text-sm font-light text-white/60 mb-2 uppercase tracking-wider">
              Module
            </label>
            <textarea
              name="module"
              value={formData.module}
              onChange={handleChange}
              placeholder="Enter module information..."
              className="w-full h-32 bg-white/[0.02] border border-white/10 rounded-md px-4 py-3 text-white/90 placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.03] transition-all resize-none"
            />
          </div>

          {/* Suggestions Section */}
          <div className="group">
            <label className="block text-sm font-light text-white/60 mb-2 uppercase tracking-wider">
              Suggestions
            </label>
            <textarea
              name="suggestions"
              value={formData.suggestions}
              onChange={handleChange}
              placeholder="Enter your suggestions..."
              className="w-full h-32 bg-white/[0.02] border border-white/10 rounded-md px-4 py-3 text-white/90 placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.03] transition-all resize-none"
            />
          </div>

          {/* Workflow Section */}
          <div className="group">
            <label className="block text-sm font-light text-white/60 mb-2 uppercase tracking-wider">
              Workflow
            </label>
            <textarea
              name="workflow"
              value={formData.workflow}
              onChange={handleChange}
              placeholder="Enter workflow details..."
              className="w-full h-32 bg-white/[0.02] border border-white/10 rounded-md px-4 py-3 text-white/90 placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.03] transition-all resize-none"
            />
          </div>

          {/* Ideas Section */}
          <div className="group">
            <label className="block text-sm font-light text-white/60 mb-2 uppercase tracking-wider">
              Ideas
            </label>
            <textarea
              name="ideas"
              value={formData.ideas}
              onChange={handleChange}
              placeholder="Enter your ideas..."
              className="w-full h-32 bg-white/[0.02] border border-white/10 rounded-md px-4 py-3 text-white/90 placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.03] transition-all resize-none"
            />
          </div>

          {/* Channel ID and Send Button */}
          <div className="pt-4 border-t border-white/5">
            <label className="block text-sm font-light text-white/60 mb-2 uppercase tracking-wider">
              Channel ID
            </label>
            <div className="flex gap-3 flex-col sm:flex-row">
              <input
                type="text"
                name="channelId"
                value={formData.channelId}
                onChange={handleChange}
                placeholder="Enter Discord Channel ID"
                required
                className="flex-1 bg-white/[0.02] border border-white/10 rounded-md px-4 py-3 text-white/90 placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.03] transition-all"
              />
              <button
                type="submit"
                disabled={isSubmitting || !formData.channelId}
                className="bg-purple-500/90 hover:bg-purple-500 disabled:bg-white/5 disabled:cursor-not-allowed text-white disabled:text-white/30 font-light px-8 py-3 rounded-md transition-all flex items-center gap-2 justify-center"
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? "Sending..." : "Send"}
              </button>
            </div>
          </div>

          {/* Message Display */}
          {message && (
            <div
              className={`p-4 rounded-md text-sm ${
                message.startsWith("✓")
                  ? "bg-purple-500/10 text-purple-300 border border-purple-500/20"
                  : "bg-red-500/10 text-red-300 border border-red-500/20"
              }`}
            >
              {message}
            </div>
          )}
        </form>

        {/* Discord Markdown Help */}
        <div className="mt-16 pt-8 border-t border-white/5">
          <h3 className="text-sm font-light text-white/60 mb-4 uppercase tracking-wider">
            Discord Markdown Support
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-white/40">
            <div>
              <code className="text-purple-400/80 bg-white/[0.02] px-2 py-1 rounded">*italic*</code> or{" "}
              <code className="text-purple-400/80 bg-white/[0.02] px-2 py-1 rounded">_italic_</code>
            </div>
            <div>
              <code className="text-purple-400/80 bg-white/[0.02] px-2 py-1 rounded">**bold**</code>
            </div>
            <div>
              <code className="text-purple-400/80 bg-white/[0.02] px-2 py-1 rounded">***bold italic***</code>
            </div>
            <div>
              <code className="text-purple-400/80 bg-white/[0.02] px-2 py-1 rounded">__underline__</code>
            </div>
            <div>
              <code className="text-purple-400/80 bg-white/[0.02] px-2 py-1 rounded">~~strikethrough~~</code>
            </div>
            <div>
              <code className="text-purple-400/80 bg-white/[0.02] px-2 py-1 rounded">## Subheading</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
