"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SubTask {
  task: string;
  category: string;
  status: "Completed" | "In Progress" | "Pending";
  dueDate: string;
}

interface ProjectData {
  title: string;
  status: string;
  description: string;
  dateRange: {
    start: string;
    end: string;
  };
  tags: {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }[];
  subTasks: SubTask[];
}

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectData;
  onSave: (updatedProject: ProjectData) => void;
}

export function EditProjectModal({
  isOpen,
  onClose,
  project,
  onSave,
}: EditProjectModalProps) {
  const [formData, setFormData] = useState<ProjectData>(project);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving project:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateSubTask = (index: number, field: string, value: string) => {
    const updated = [...formData.subTasks];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, subTasks: updated });
  };

  const addSubTask = () => {
    setFormData({
      ...formData,
      subTasks: [
        ...formData.subTasks,
        {
          task: "",
          category: "",
          status: "Pending",
          dueDate: "",
        },
      ],
    });
  };

  const removeSubTask = (index: number) => {
    setFormData({
      ...formData,
      subTasks: formData.subTasks.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-black/90 border border-white/10 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-black/95 border-b border-white/10 p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white/90">Edit Project</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white/60 hover:text-white/90 hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-light text-white/60 mb-2 uppercase tracking-wider">
              Project Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full bg-white/[0.02] border border-white/10 rounded-md px-4 py-2 text-white/90 placeholder-white/30 focus:outline-none focus:border-purple-500/50"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-light text-white/60 mb-2 uppercase tracking-wider">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full bg-white/[0.02] border border-white/10 rounded-md px-4 py-2 text-white/90 focus:outline-none focus:border-purple-500/50"
            >
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-light text-white/60 mb-2 uppercase tracking-wider">
                Start Date
              </label>
              <input
                type="text"
                value={formData.dateRange.start}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dateRange: { ...formData.dateRange, start: e.target.value },
                  })
                }
                placeholder="e.g., Nov 1, 2025"
                className="w-full bg-white/[0.02] border border-white/10 rounded-md px-4 py-2 text-white/90 placeholder-white/30 focus:outline-none focus:border-purple-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-light text-white/60 mb-2 uppercase tracking-wider">
                End Date
              </label>
              <input
                type="text"
                value={formData.dateRange.end}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dateRange: { ...formData.dateRange, end: e.target.value },
                  })
                }
                placeholder="e.g., Nov 15, 2025"
                className="w-full bg-white/[0.02] border border-white/10 rounded-md px-4 py-2 text-white/90 placeholder-white/30 focus:outline-none focus:border-purple-500/50"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-light text-white/60 mb-2 uppercase tracking-wider">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full bg-white/[0.02] border border-white/10 rounded-md px-4 py-2 text-white/90 placeholder-white/30 focus:outline-none focus:border-purple-500/50 resize-none"
            />
          </div>

          {/* Sub Tasks */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-light text-white/60 uppercase tracking-wider">
                Sub Tasks
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addSubTask}
                className="text-purple-400 hover:text-purple-300 hover:bg-white/5"
              >
                + Add Task
              </Button>
            </div>
            <div className="space-y-3">
              {formData.subTasks.map((task, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-2 p-3 bg-white/[0.02] border border-white/10 rounded-md"
                >
                  <input
                    type="text"
                    value={task.task}
                    onChange={(e) =>
                      updateSubTask(index, "task", e.target.value)
                    }
                    placeholder="Task name"
                    className="col-span-4 bg-white/[0.02] border border-white/10 rounded px-2 py-1 text-sm text-white/90 placeholder-white/30 focus:outline-none focus:border-purple-500/50"
                  />
                  <input
                    type="text"
                    value={task.category}
                    onChange={(e) =>
                      updateSubTask(index, "category", e.target.value)
                    }
                    placeholder="Category"
                    className="col-span-2 bg-white/[0.02] border border-white/10 rounded px-2 py-1 text-sm text-white/90 placeholder-white/30 focus:outline-none focus:border-purple-500/50"
                  />
                  <select
                    value={task.status}
                    onChange={(e) =>
                      updateSubTask(index, "status", e.target.value)
                    }
                    className="col-span-2 bg-white/[0.02] border border-white/10 rounded px-2 py-1 text-sm text-white/90 focus:outline-none focus:border-purple-500/50"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <input
                    type="text"
                    value={task.dueDate}
                    onChange={(e) =>
                      updateSubTask(index, "dueDate", e.target.value)
                    }
                    placeholder="Due date"
                    className="col-span-3 bg-white/[0.02] border border-white/10 rounded px-2 py-1 text-sm text-white/90 placeholder-white/30 focus:outline-none focus:border-purple-500/50"
                  />
                  <button
                    type="button"
                    onClick={() => removeSubTask(index)}
                    className="col-span-1 text-red-400 hover:text-red-300 flex items-center justify-center"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-white/60 hover:text-white/90 hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-purple-500/90 hover:bg-purple-500 disabled:bg-white/5 disabled:cursor-not-allowed text-white"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
