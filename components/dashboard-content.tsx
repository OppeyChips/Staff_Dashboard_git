"use client";

import { useEffect, useState } from "react";
import { ProjectDetailView, ProjectDetailViewProps } from "@/components/project-detail-view";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  FileText,
  Activity,
  TrendingUp,
  Calendar,
  Timer,
  BarChart3,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { EditProjectModal } from "@/components/edit-project-modal";
import { ShareProjectModal } from "@/components/share-project-modal";

interface DiscordUser {
  id: string;
  username: string;
  global_name?: string;
  discriminator: string;
  avatar: string;
  email?: string;
}

interface ActivityStats {
  totalTimeSpent: string;
  researchSubmissions: number;
  activeDays: number;
  averageSessionTime: string;
  lastActive: string;
  weeklyActivity: {
    day: string;
    hours: number;
  }[];
  recentActivities: {
    id: number | string;
    action: string;
    time: string;
    command?: string;
  }[];
  commandStats?: {
    AFK: number;
    Tempvoice: number;
    Highlight: number;
  };
}

interface DashboardContentProps {
  user: DiscordUser;
}

export function DashboardContent({ user }: DashboardContentProps) {
  const displayName = user.global_name || user.username;
  const [stats, setStats] = useState<ActivityStats | null>(null);
  const [currentProject, setCurrentProject] = useState<ProjectDetailViewProps | null>(null);
  const [projectId, setProjectId] = useState<string>("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch stats and project data from MongoDB
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stats
        const statsResponse = await fetch("/api/stats");
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData.stats);
        } else {
          // Set default stats if not found
          setStats(getDefaultStats());
        }

        // Fetch project
        const projectResponse = await fetch("/api/projects");
        if (projectResponse.ok) {
          const projectData = await projectResponse.json();
          setCurrentProject(projectData.project);
          setProjectId(projectData.project._id || "");
        } else {
          // Set default project if not found
          setCurrentProject(getDefaultProject());
          // ProjectId will be empty, which is fine for new users
          setProjectId("");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Fallback to default data if fetch fails
        setStats(getDefaultStats());
        setCurrentProject(getDefaultProject());
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getDefaultStats = (): ActivityStats => {
    return {
      totalTimeSpent: "0",
      researchSubmissions: 0,
      activeDays: 0,
      averageSessionTime: "0",
      lastActive: "just now",
      weeklyActivity: [
        { day: "Mon", hours: 0 },
        { day: "Tue", hours: 0 },
        { day: "Wed", hours: 0 },
        { day: "Thu", hours: 0 },
        { day: "Fri", hours: 0 },
        { day: "Sat", hours: 0 },
        { day: "Sun", hours: 0 },
      ],
      recentActivities: [],
      commandStats: {
        AFK: 0,
        Tempvoice: 0,
        Highlight: 0,
      },
    };
  };

  const getDefaultProject = (): ProjectDetailViewProps => {
    return {
    breadcrumbs: [
      { label: "Staff Tasks", href: "#" },
      { label: "Current Assignment", href: "#" },
    ],
    title: "Discord Bot Feature Development",
    status: "In Progress",
    assignees: [
      {
        name: displayName,
        avatarUrl: user.avatar
          ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
          : "https://i.pravatar.cc/150?u=default"
      },
    ],
    dateRange: {
      start: "Nov 1, 2025",
      end: "Nov 15, 2025",
    },
    tags: [
      { label: "Research", variant: "destructive" },
      { label: "Development", variant: "secondary" },
    ],
    description:
      "Working on implementing and documenting new Discord bot commands including AFK status, temporary voice channels, and message highlighting features. This involves research, testing, and comprehensive documentation.",
    attachments: [
      { name: "Command_Specifications.pdf", size: "2.3 Mb", type: "pdf" },
      { name: "UI_Mockups.fig", size: "8.7 Mb", type: "figma" },
    ],
    subTasks: [
      {
        id: 1,
        task: "Research AFK command functionality",
        category: "Research",
        status: "Completed",
        dueDate: "Nov 5, 2025",
      },
      {
        id: 2,
        task: "Document Tempvoice implementation",
        category: "Documentation",
        status: "In Progress",
        dueDate: "Nov 8, 2025",
      },
      {
        id: 3,
        task: "Test Highlight command workflow",
        category: "Testing",
        status: "Pending",
        dueDate: "Nov 12, 2025",
      },
    ],
  };
  };

  const handleSaveProject = async (updatedProject: any) => {
    try {
      const response = await fetch("/api/projects", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProject),
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentProject(data.project);
      }
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  if (isLoading || !stats || !currentProject) {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="animate-pulse text-white/60">Loading dashboard...</div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="relative w-full h-full overflow-auto">
      {/* Purple glow from top right */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        className="relative z-10 p-8 md:p-12 max-w-7xl mx-auto space-y-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Welcome Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-4xl font-light text-white/90 mb-2 tracking-tight">
            Hello, {displayName}
          </h1>
          <p className="text-white/40 text-sm flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Last active: {stats.lastActive}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Time Spent */}
          <Card className="bg-white/[0.02] border-white/10 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-light text-white/60 uppercase tracking-wider">
                  Total Time
                </p>
                <Clock className="h-5 w-5 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-light text-white/90 mb-1">
                {stats.totalTimeSpent}h
              </div>
              <p className="text-xs text-white/40">on dashboard</p>
            </CardContent>
          </Card>

          {/* Research Submissions */}
          <Card className="bg-white/[0.02] border-white/10 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-light text-white/60 uppercase tracking-wider">
                  Research
                </p>
                <FileText className="h-5 w-5 text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-light text-white/90 mb-1">
                {stats.researchSubmissions}
              </div>
              <p className="text-xs text-white/40">submissions</p>
            </CardContent>
          </Card>

          {/* Active Days */}
          <Card className="bg-white/[0.02] border-white/10 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-light text-white/60 uppercase tracking-wider">
                  Active Days
                </p>
                <Calendar className="h-5 w-5 text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-light text-white/90 mb-1">
                {stats.activeDays}
              </div>
              <p className="text-xs text-white/40">this month</p>
            </CardContent>
          </Card>

          {/* Average Session */}
          <Card className="bg-white/[0.02] border-white/10 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-light text-white/60 uppercase tracking-wider">
                  Avg Session
                </p>
                <Timer className="h-5 w-5 text-yellow-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-light text-white/90 mb-1">
                {stats.averageSessionTime}h
              </div>
              <p className="text-xs text-white/40">per session</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly Activity Chart */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white/[0.02] border-white/10 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-light text-white/90 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-400" />
                  Weekly Activity
                </h3>
                <Badge variant="outline" className="bg-purple-500/10 border-purple-500/30 text-purple-300">
                  This Week
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between gap-4 h-48">
                {stats.weeklyActivity.map((day, index) => {
                  const maxHours = Math.max(...stats.weeklyActivity.map(d => d.hours));
                  const heightPercent = (day.hours / maxHours) * 100;

                  return (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full relative group">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${heightPercent}%` }}
                          transition={{ delay: index * 0.05, duration: 0.3 }}
                          className="w-full bg-gradient-to-t from-purple-500/80 to-purple-400/60 rounded-t-md min-h-[20px] relative"
                          style={{ height: `${heightPercent}%` }}
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 backdrop-blur-sm px-2 py-1 rounded text-xs text-white/90 whitespace-nowrap">
                            {day.hours}h
                          </div>
                        </motion.div>
                      </div>
                      <p className="text-xs text-white/60 font-light">{day.day}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Two Column Layout: Recent Activity + Current Project */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <Card className="bg-white/[0.02] border-white/10 backdrop-blur-sm h-full">
              <CardHeader>
                <h3 className="text-lg font-light text-white/90 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  Recent Activity
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentActivities.length > 0 ? (
                    stats.recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-white/5 last:border-0">
                        <div className="mt-1 h-2 w-2 rounded-full bg-purple-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white/90">{activity.action}</p>
                          {activity.command && (
                            <Badge variant="outline" className="mt-1 text-xs bg-white/5 border-white/10">
                              {activity.command}
                            </Badge>
                          )}
                          <p className="text-xs text-white/40 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-white/40 text-sm">
                      No recent activity yet. Start by submitting your first research report!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Current Project */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <ProjectDetailView
              {...currentProject}
              onEdit={() => setIsEditModalOpen(true)}
              onShare={() => setIsShareModalOpen(true)}
            />
          </motion.div>
        </div>

        {/* Edit Modal */}
        <EditProjectModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          project={currentProject}
          onSave={handleSaveProject}
        />

        {/* Share Modal */}
        <ShareProjectModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          projectId={projectId}
        />

        {/* Command-wise Research Breakdown */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white/[0.02] border-white/10 backdrop-blur-sm">
            <CardHeader>
              <h3 className="text-lg font-light text-white/90 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
                Research by Command
              </h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(() => {
                  const total = stats.researchSubmissions || 0;
                  const afkCount = stats.commandStats?.AFK || 0;
                  const tempvoiceCount = stats.commandStats?.Tempvoice || 0;
                  const highlightCount = stats.commandStats?.Highlight || 0;

                  return [
                    {
                      name: "AFK",
                      count: afkCount,
                      color: "blue",
                      percentage: total > 0 ? Math.round((afkCount / total) * 100) : 0
                    },
                    {
                      name: "Tempvoice",
                      count: tempvoiceCount,
                      color: "green",
                      percentage: total > 0 ? Math.round((tempvoiceCount / total) * 100) : 0
                    },
                    {
                      name: "Highlight",
                      count: highlightCount,
                      color: "yellow",
                      percentage: total > 0 ? Math.round((highlightCount / total) * 100) : 0
                    },
                  ];
                })().map((cmd) => (
                  <div key={cmd.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/90">{cmd.name}</span>
                      <span className="text-sm text-white/60">{cmd.count} reports</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${cmd.percentage}%` }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        className={`h-full rounded-full ${
                          cmd.color === "blue" ? "bg-blue-500" :
                          cmd.color === "green" ? "bg-green-500" :
                          "bg-yellow-500"
                        }`}
                      />
                    </div>
                    <p className="text-xs text-white/40">{cmd.percentage}% of total</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
