import { useState } from 'react';
import { Plus, X, CheckCircle2, Clock, Circle, Calendar, Flag, ListTodo, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Task, WheelDomain } from '@/types/lifeAudit';

interface TaskDashboardProps {
  tasks: Task[];
  domains: WheelDomain[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'status'>) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onRemoveTask: (taskId: string) => void;
}

const priorityConfig = {
  low: { label: 'Low', color: 'text-muted-foreground', bg: 'bg-muted' },
  medium: { label: 'Medium', color: 'text-accent', bg: 'bg-accent/20' },
  high: { label: 'High', color: 'text-destructive', bg: 'bg-destructive/20' },
};

const statusConfig = {
  todo: { label: 'To Do', icon: Circle, color: 'text-muted-foreground' },
  in_progress: { label: 'In Progress', icon: Clock, color: 'text-primary' },
  done: { label: 'Done', icon: CheckCircle2, color: 'text-green-600' },
};

export function TaskDashboard({ tasks, domains, onAddTask, onUpdateTask, onRemoveTask }: TaskDashboardProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'todo' | 'in_progress' | 'done'>('all');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    category: '',
    dueDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.title.trim()) {
      onAddTask({
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        category: newTask.category || 'General',
        dueDate: newTask.dueDate || undefined,
      });
      setNewTask({ title: '', description: '', priority: 'medium', category: '', dueDate: '' });
      setIsFormOpen(false);
    }
  };

  const toggleStatus = (task: Task) => {
    const statusOrder: Task['status'][] = ['todo', 'in_progress', 'done'];
    const currentIndex = statusOrder.indexOf(task.status);
    const nextStatus = statusOrder[(currentIndex + 1) % 3];
    onUpdateTask(task.id, { status: nextStatus });
  };

  const filteredTasks = filter === 'all' 
    ? tasks 
    : tasks.filter(t => t.status === filter);

  const todoCount = tasks.filter(t => t.status === 'todo').length;
  const inProgressCount = tasks.filter(t => t.status === 'in_progress').length;
  const doneCount = tasks.filter(t => t.status === 'done').length;
  const completionRate = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;

  return (
    <section className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 bg-secondary/30" id="tasks">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-slide-up">
          <p className="text-primary font-medium mb-2 tracking-wide uppercase text-sm">Task Tracker</p>
          <h2 className="section-title mb-4">Action Dashboard</h2>
          <p className="section-subtitle mx-auto">
            Turn your SMART goals and Quick Wins into trackable daily actions.
            Build momentum by completing tasks consistently.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-card p-4 text-center">
            <ListTodo className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
            <p className="font-display text-2xl font-bold text-foreground">{todoCount}</p>
            <p className="text-xs text-muted-foreground">To Do</p>
          </div>
          <div className="glass-card p-4 text-center">
            <Clock className="w-5 h-5 mx-auto mb-2 text-primary" />
            <p className="font-display text-2xl font-bold text-foreground">{inProgressCount}</p>
            <p className="text-xs text-muted-foreground">In Progress</p>
          </div>
          <div className="glass-card p-4 text-center">
            <CheckCircle2 className="w-5 h-5 mx-auto mb-2 text-green-600" />
            <p className="font-display text-2xl font-bold text-foreground">{doneCount}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
          <div className="glass-card p-4 text-center">
            <TrendingUp className="w-5 h-5 mx-auto mb-2 text-accent" />
            <p className="font-display text-2xl font-bold text-foreground">{completionRate}%</p>
            <p className="text-xs text-muted-foreground">Completion</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {(['all', 'todo', 'in_progress', 'done'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                filter === status 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary hover:bg-secondary/80 text-foreground'
              }`}
            >
              {status === 'all' ? 'All Tasks' : statusConfig[status].label}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="space-y-3 mb-8">
          {filteredTasks.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <ListTodo className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground">
                {filter === 'all' 
                  ? "No tasks yet. Add your first task to start building momentum!"
                  : `No ${statusConfig[filter as keyof typeof statusConfig]?.label.toLowerCase()} tasks.`}
              </p>
            </div>
          ) : (
            filteredTasks.map((task, index) => {
              const StatusIcon = statusConfig[task.status].icon;
              const priorityCfg = priorityConfig[task.priority];
              
              return (
                <div 
                  key={task.id}
                  className={`glass-card p-4 animate-slide-up ${
                    task.status === 'done' ? 'opacity-70' : ''
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleStatus(task)}
                      className={`flex-shrink-0 mt-0.5 transition-colors ${statusConfig[task.status].color} hover:text-primary`}
                      title={`Status: ${statusConfig[task.status].label}. Click to change.`}
                    >
                      <StatusIcon className="w-5 h-5" />
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${priorityCfg.bg} ${priorityCfg.color}`}>
                          {task.priority}
                        </span>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                          {task.category}
                        </span>
                        {task.dueDate && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <p className={`font-medium ${task.status === 'done' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                      )}
                    </div>
                    
                    <button
                      onClick={() => onRemoveTask(task.id)}
                      className="flex-shrink-0 text-muted-foreground hover:text-destructive transition-colors"
                      aria-label="Remove task"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Add Task Form */}
        {isFormOpen ? (
          <form onSubmit={handleSubmit} className="glass-card p-6 animate-scale-in">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">Add New Task</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="task-title">Task Title *</Label>
                <Input
                  id="task-title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="What needs to be done?"
                  className="mt-1.5"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="task-description">Description (optional)</Label>
                <Textarea
                  id="task-description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Add more details..."
                  className="mt-1.5 min-h-[60px] resize-none"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="task-priority">Priority</Label>
                  <Select value={newTask.priority} onValueChange={(value: Task['priority']) => setNewTask({ ...newTask, priority: value })}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="task-category">Category</Label>
                  <Select value={newTask.category} onValueChange={(value) => setNewTask({ ...newTask, category: value })}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General">General</SelectItem>
                      {domains.map(domain => (
                        <SelectItem key={domain.id} value={domain.name}>
                          {domain.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="task-due">Due Date</Label>
                  <Input
                    id="task-due"
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button type="submit" className="flex-1">
                Add Task
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <Button
            onClick={() => setIsFormOpen(true)}
            variant="outline"
            className="w-full py-6 border-dashed border-2"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Task
          </Button>
        )}
      </div>
    </section>
  );
}
