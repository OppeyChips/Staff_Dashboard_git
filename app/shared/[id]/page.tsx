"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProjectDetailView, ProjectDetailViewProps } from "@/components/project-detail-view";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SharedProjectPage() {
  const params = useParams();
  const [project, setProject] = useState<ProjectDetailViewProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSharedProject = async () => {
      try {
        const response = await fetch(`/api/projects/shared/${params.id}`);

        if (!response.ok) {
          const data = await response.json();
          setError(data.error || 'Failed to load project');
          return;
        }

        const data = await response.json();
        setProject(data.project);
      } catch (err) {
        console.error('Error fetching shared project:', err);
        setError('Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchSharedProject();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="relative w-full h-screen flex items-center justify-center bg-black">
        <div className="animate-pulse text-white/60">Loading shared project...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="relative w-full h-screen flex flex-col items-center justify-center bg-black">
        <div className="text-center space-y-4">
          <div className="text-6xl">🔒</div>
          <h1 className="text-2xl font-light text-white/90">
            {error || 'Project Not Found'}
          </h1>
          <p className="text-white/60 max-w-md">
            This project is either private or doesn't exist. Please check the link and try again.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500/90 hover:bg-purple-500 text-white rounded-md transition-colors mt-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen bg-black overflow-auto">
      {/* Purple glow from top right */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 p-8 md:p-12 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white/90 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Homepage
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            <h1 className="text-3xl font-light text-white/90">Shared Project</h1>
          </div>
          <p className="text-white/40 text-sm">
            This project has been shared with you. View-only access.
          </p>
        </div>

        {/* Project Detail */}
        <ProjectDetailView {...project} />

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-white/40 text-sm">
            Powered by R.O.T.I Staff Dashboard
          </p>
        </div>
      </div>
    </div>
  );
}
