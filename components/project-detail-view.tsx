import * as React from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Figma,
  Calendar,
  Tag,
  Paperclip,
  Users,
  MoreHorizontal,
  Download,
  Plus,
  ArrowRight,
  Edit2,
  X,
  Share2
} from "lucide-react";

import { cn } from "@/lib/utils"; // Assuming you have a `cn` utility from shadcn
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Type Definitions for Props
type Assignee = {
  name: string;
  avatarUrl: string;
};

type ProjectTag = {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
};

type Attachment = {
  name: string;
  size: string;
  type: "pdf" | "figma";
};

type SubTask = {
  id: number;
  task: string;
  category: string;
  status: "Completed" | "In Progress" | "Pending";
  dueDate: string;
};

export type ProjectDetailViewProps = {
  breadcrumbs: { label: string; href: string }[];
  title: string;
  status: string;
  assignees: Assignee[];
  dateRange: {
    start: string;
    end: string;
  };
  tags: ProjectTag[];
  description: string;
  attachments: Attachment[];
  subTasks: SubTask[];
  onEdit?: () => void;
  onShare?: () => void;
};

// Helper component for status badges
const StatusBadge = ({ status }: { status: SubTask["status"] }) => {
  const statusStyles = {
    Completed: "bg-green-500/20 text-green-400 border-green-500/30",
    "In Progress": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    Pending: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  };
  return <Badge variant="outline" className={cn("font-medium", statusStyles[status])}>{status}</Badge>;
};

// Helper to get file icon
const FileIcon = ({ type }: { type: Attachment["type"] }) => {
  if (type === "pdf") return <FileText className="h-6 w-6 text-red-500" />;
  if (type === "figma") return <Figma className="h-6 w-6 text-purple-500" />;
  return <Paperclip className="h-6 w-6 text-muted-foreground" />;
};


export function ProjectDetailView({
  breadcrumbs,
  title,
  status,
  assignees,
  dateRange,
  tags,
  description,
  attachments,
  subTasks,
  onEdit,
  onShare,
}: ProjectDetailViewProps) {
  
  // Animation variants for framer-motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      }
    },
  };

  return (
    <Card className="w-full max-w-4xl mx-auto overflow-hidden border-white/10 bg-black/40 backdrop-blur-sm shadow-2xl shadow-black/50">
      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        {/* Header Section */}
        <CardHeader className="p-4 border-b border-white/10 bg-white/[0.02]">
          <motion.div variants={itemVariants} className="flex items-center justify-between">
            <div className="text-sm text-white/60">
              {breadcrumbs.map((breadcrumb, index) => (
                <React.Fragment key={index}>
                  <span>{breadcrumb.label}</span>
                  {index < breadcrumbs.length - 1 && <span className="mx-2 text-white/40">/</span>}
                </React.Fragment>
              ))}
            </div>
            <div className="flex items-center gap-2">
                {onShare && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onShare}
                    className="hover:bg-white/10 text-white/60 hover:text-white/90"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                )}
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onEdit}
                    className="hover:bg-white/10 text-white/60 hover:text-white/90"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
            </div>
          </motion.div>
        </CardHeader>

        <CardContent className="p-6 md:p-8 space-y-8">
            {/* Title Section */}
            <motion.h1 variants={itemVariants} className="text-3xl font-bold tracking-tight text-white/90">{title}</motion.h1>

            {/* Meta Info Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                <div className="flex items-start gap-3">
                    <MoreHorizontal className="h-5 w-5 mt-0.5 text-white/60" />
                    <div>
                        <p className="text-white/60">Status</p>
                        <Badge variant="outline" className="mt-1 font-semibold bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                            <span className="mr-2 h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></span>
                            {status}
                        </Badge>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 mt-0.5 text-white/60" />
                    <div>
                        <p className="text-white/60">Assignee</p>
                        <div className="flex items-center gap-2 mt-1">
                          {assignees.map(assignee => (
                              <div key={assignee.name} className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={assignee.avatarUrl} alt={assignee.name} />
                                    <AvatarFallback className="bg-purple-500/20 text-purple-300">{assignee.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-white/90">{assignee.name}</span>
                              </div>
                          ))}
                        </div>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 mt-0.5 text-white/60" />
                    <div>
                        <p className="text-white/60">Date</p>
                        <p className="font-medium flex items-center gap-2 mt-1 text-white/90">
                            {dateRange.start} <ArrowRight className="h-4 w-4 text-white/60" /> {dateRange.end}
                        </p>
                    </div>
                </div>
                 <div className="flex items-start gap-3">
                    <Tag className="h-5 w-5 mt-0.5 text-white/60" />
                    <div>
                        <p className="text-white/60">Tags</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {tags.map((tag) => <Badge key={tag.label} variant={tag.variant} className="bg-white/5 border-white/10 text-white/80">{tag.label}</Badge>)}
                        </div>
                    </div>
                </div>
                 <div className="flex items-start gap-3 col-span-1 md:col-span-2">
                    <FileText className="h-5 w-5 mt-0.5 text-white/60" />
                    <div>
                        <p className="text-white/60">Description</p>
                        <p className="mt-1 text-white/80">{description}</p>
                    </div>
                </div>
            </motion.div>

            {/* Attachments Section */}
            <motion.div variants={itemVariants} className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold flex items-center gap-2 text-white/90"><Paperclip className="h-5 w-5 text-white/60"/>Attachment <Badge variant="secondary" className="bg-white/10 border-white/10 text-white/70">2</Badge></h3>
                    <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300 hover:bg-white/5"><Download className="h-4 w-4 mr-2" />Download All</Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {attachments.map(file => (
                        <div key={file.name} className="flex items-center gap-3 p-3 border border-white/10 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
                            <FileIcon type={file.type} />
                            <div className="flex-1">
                                <p className="font-medium text-sm truncate text-white/90">{file.name}</p>
                                <p className="text-xs text-white/60">{file.size}</p>
                            </div>
                        </div>
                    ))}
                    <div className="flex items-center justify-center p-3 border-2 border-dashed border-white/10 rounded-lg cursor-pointer hover:bg-white/[0.05] hover:border-white/20 transition-colors">
                        <Plus className="h-6 w-6 text-white/60"/>
                    </div>
                </div>
            </motion.div>

            {/* Task List Section */}
            <motion.div variants={itemVariants} className="space-y-4">
                <h3 className="font-semibold text-white/90">Task List</h3>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-white/10 hover:bg-white/[0.02]">
                                <TableHead className="w-[50px] text-white/60">No</TableHead>
                                <TableHead className="text-white/60">Task</TableHead>
                                <TableHead className="text-white/60">Category</TableHead>
                                <TableHead className="text-white/60">Status</TableHead>
                                <TableHead className="text-right text-white/60">Due Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {subTasks.map((task) => (
                                <motion.tr variants={itemVariants} key={task.id} className="border-white/10 hover:bg-white/[0.02]">
                                    <TableCell className="text-white/60">{task.id}</TableCell>
                                    <TableCell className="font-medium text-white/90">{task.task}</TableCell>
                                    <TableCell className="text-white/80">{task.category}</TableCell>
                                    <TableCell><StatusBadge status={task.status} /></TableCell>
                                    <TableCell className="text-right text-white/60">{task.dueDate}</TableCell>
                                </motion.tr>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </motion.div>
        </CardContent>
      </motion.div>
    </Card>
  );
}