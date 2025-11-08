"use client";

import { useState } from "react";
import { X, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export function ShareProjectModal({
  isOpen,
  onClose,
  projectId,
}: ShareProjectModalProps) {
  const [isPublic, setIsPublic] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const generateShareLink = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/projects/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isPublic,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setShareLink(data.shareLink);
      }
    } catch (error) {
      console.error("Error generating share link:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-black/90 border border-white/10 rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="border-b border-white/10 p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white/90">Share Project</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white/60 hover:text-white/90 hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {!projectId && (
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-md">
              <p className="text-sm text-yellow-400">
                Please save your project first before sharing. Click the edit button to set up your project details.
              </p>
            </div>
          )}

          {/* Public Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-white/90">
                Make project public
              </h3>
              <p className="text-xs text-white/60 mt-1">
                Anyone with the link can view this project
              </p>
            </div>
            <button
              onClick={() => setIsPublic(!isPublic)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isPublic ? "bg-purple-500" : "bg-white/10"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isPublic ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Generate Button */}
          {!shareLink && projectId && (
            <Button
              onClick={generateShareLink}
              disabled={loading}
              className="w-full bg-purple-500/90 hover:bg-purple-500 disabled:bg-white/5 disabled:cursor-not-allowed text-white"
            >
              {loading ? "Generating..." : "Generate Share Link"}
            </Button>
          )}

          {/* Share Link */}
          {shareLink && (
            <div className="space-y-2">
              <label className="block text-sm font-light text-white/60 uppercase tracking-wider">
                Share Link
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="flex-1 bg-white/[0.02] border border-white/10 rounded-md px-4 py-2 text-white/90 text-sm focus:outline-none"
                />
                <Button
                  onClick={copyToClipboard}
                  variant="ghost"
                  size="icon"
                  className="text-white/60 hover:text-white/90 hover:bg-white/10"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {copied && (
                <p className="text-xs text-green-400">
                  Link copied to clipboard!
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 p-4 flex items-center justify-end">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-white/60 hover:text-white/90 hover:bg-white/5"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
