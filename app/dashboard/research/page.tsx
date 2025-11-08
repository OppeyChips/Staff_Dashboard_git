"use client";

import { useState } from "react";
import { Send, Mic, Volume2, Highlighter } from "lucide-react";
import { ActionSearchBar } from "@/components/ui/action-search-bar";

export default function ResearchPage() {
  const [selectedCommand, setSelectedCommand] = useState<string>("");
  const [formData, setFormData] = useState({
    commands: "",
    module: "",
    suggestions: "",
    workflow: "",
    ideas: "",
    tags: [] as string[],
    channelId: "",
  });
  const [images, setImages] = useState<{
    commands: File | null;
    module: File | null;
    suggestions: File | null;
    workflow: File | null;
    ideas: File | null;
  }>({
    commands: null,
    module: null,
    suggestions: null,
    workflow: null,
    ideas: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // Define command actions for ActionSearchBar
  const commandActions = [
    {
      id: "1",
      label: "AFK",
      icon: <Mic className="h-4 w-4 text-blue-500" />,
      description: "Away From Keyboard Command",
      short: "",
      end: "Command",
    },
    {
      id: "2",
      label: "Tempvoice",
      icon: <Volume2 className="h-4 w-4 text-green-500" />,
      description: "Temporary Voice Channel",
      short: "",
      end: "Command",
    },
    {
      id: "3",
      label: "Highlight",
      icon: <Highlighter className="h-4 w-4 text-yellow-500" />,
      description: "Message Highlighting System",
      short: "",
      end: "Command",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      // Create FormData to handle file uploads
      const formDataToSend = new FormData();

      // Add text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'tags') {
          formDataToSend.append(key, JSON.stringify(value));
        } else {
          formDataToSend.append(key, value as string);
        }
      });

      // Add selected command
      formDataToSend.append('selectedCommand', selectedCommand);

      // Add image files
      Object.entries(images).forEach(([key, file]) => {
        if (file) {
          formDataToSend.append(`${key}_image`, file);
        }
      });

      const response = await fetch("/api/discord/send-research", {
        method: "POST",
        body: formDataToSend,
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
          tags: [],
          channelId: "",
        });
        setImages({
          commands: null,
          module: null,
          suggestions: null,
          workflow: null,
          ideas: null,
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

  const handleImageChange = (
    field: keyof typeof images,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;
    setImages({
      ...images,
      [field]: file,
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
        <p className="text-white/40 mb-8 text-sm">
          Document your research findings and send them to Discord
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Command Selection */}
          <div className="group">
            <label className="block text-sm font-light text-white/60 mb-2 uppercase tracking-wider">
              Select Command
            </label>
            <ActionSearchBar
              actions={commandActions}
              onSelect={(action) => setSelectedCommand(action.label)}
              placeholder="Choose a command (AFK, Tempvoice, Highlight)..."
            />
            {selectedCommand && (
              <p className="mt-2 text-xs text-purple-400">
                Selected: {selectedCommand}
              </p>
            )}
          </div>
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
            <div className="mt-2">
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.02] border border-white/10 rounded-md text-white/60 text-sm cursor-pointer hover:bg-white/[0.05] transition-all">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange("commands", e)}
                  className="hidden"
                />
                <span>📎 Attach Image</span>
                {images.commands && <span className="text-purple-400">({images.commands.name})</span>}
              </label>
            </div>
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
            <div className="mt-2">
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.02] border border-white/10 rounded-md text-white/60 text-sm cursor-pointer hover:bg-white/[0.05] transition-all">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange("module", e)}
                  className="hidden"
                />
                <span>📎 Attach Image</span>
                {images.module && <span className="text-purple-400">({images.module.name})</span>}
              </label>
            </div>
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
            <div className="mt-2">
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.02] border border-white/10 rounded-md text-white/60 text-sm cursor-pointer hover:bg-white/[0.05] transition-all">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange("suggestions", e)}
                  className="hidden"
                />
                <span>📎 Attach Image</span>
                {images.suggestions && <span className="text-purple-400">({images.suggestions.name})</span>}
              </label>
            </div>
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
            <div className="mt-2">
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.02] border border-white/10 rounded-md text-white/60 text-sm cursor-pointer hover:bg-white/[0.05] transition-all">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange("workflow", e)}
                  className="hidden"
                />
                <span>📎 Attach Image</span>
                {images.workflow && <span className="text-purple-400">({images.workflow.name})</span>}
              </label>
            </div>
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
            <div className="mt-2">
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.02] border border-white/10 rounded-md text-white/60 text-sm cursor-pointer hover:bg-white/[0.05] transition-all">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange("ideas", e)}
                  className="hidden"
                />
                <span>📎 Attach Image</span>
                {images.ideas && <span className="text-purple-400">({images.ideas.name})</span>}
              </label>
            </div>
          </div>

          {/* Tags Section */}
          <div className="group pt-4 border-t border-white/5">
            <label className="block text-sm font-light text-white/60 mb-3 uppercase tracking-wider">
              Tags
            </label>
            <div className="flex flex-wrap gap-3">
              {["idea", "suggestion", "research"].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      tags: prev.tags.includes(tag)
                        ? prev.tags.filter((t) => t !== tag)
                        : [...prev.tags, tag],
                    }));
                  }}
                  className={`px-4 py-2 rounded-md text-sm font-light transition-all capitalize ${
                    formData.tags.includes(tag)
                      ? "bg-purple-500/90 text-white border border-purple-500"
                      : "bg-white/[0.02] text-white/60 border border-white/10 hover:bg-white/[0.05]"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            {formData.tags.length > 0 && (
              <p className="mt-2 text-xs text-white/40">
                Selected: {formData.tags.join(", ")}
              </p>
            )}
          </div>

          {/* Channel ID and Send Button */}
          <div className="pt-4">
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
