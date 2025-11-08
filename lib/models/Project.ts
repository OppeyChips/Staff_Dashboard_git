import mongoose from 'mongoose';

const SubTaskSchema = new mongoose.Schema({
  task: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, enum: ['Completed', 'In Progress', 'Pending'], required: true },
  dueDate: { type: String, required: true },
});

const AttachmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  size: { type: String, required: true },
  type: { type: String, enum: ['pdf', 'figma'], required: true },
  url: { type: String },
});

const AssigneeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  avatarUrl: { type: String, required: true },
  userId: { type: String },
});

const ProjectSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  status: { type: String, required: true },
  assignees: [AssigneeSchema],
  dateRange: {
    start: { type: String, required: true },
    end: { type: String, required: true },
  },
  tags: [{
    label: { type: String, required: true },
    variant: { type: String, enum: ['default', 'secondary', 'destructive', 'outline'], required: true },
  }],
  description: { type: String, required: true },
  attachments: [AttachmentSchema],
  subTasks: [SubTaskSchema],
  breadcrumbs: [{
    label: { type: String, required: true },
    href: { type: String, required: true },
  }],
  sharedWith: [{ type: String }], // Array of user IDs who can view this project
  isPublic: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
