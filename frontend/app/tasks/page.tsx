"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { tasksApi, Task } from "@/lib/api";
import { getUser, signOut } from "@/lib/auth";
import ChatBubble from "@/components/ChatBubble";

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [adding, setAdding] = useState(false);

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const user = getUser();

  useEffect(() => {
    if (!user) {
      router.push("/signin");
      return;
    }
    fetchTasks();
  }, [filter]);

  const fetchTasks = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await tasksApi.getAll(user.user_id, filter);
      setTasks(data);
    } catch {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTitle.trim()) return;
    setAdding(true);
    try {
      const task = await tasksApi.create(user.user_id, newTitle, newDesc || undefined);
      setTasks([task, ...tasks]);
      setNewTitle("");
      setNewDesc("");
      setShowForm(false);
    } catch {
      setError("Failed to create task");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (taskId: number) => {
    if (!user) return;
    try {
      await tasksApi.delete(user.user_id, taskId);
      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch {
      setError("Failed to delete task");
    }
  };

  const handleToggle = async (taskId: number) => {
    if (!user) return;
    try {
      const updated = await tasksApi.toggleComplete(user.user_id, taskId);
      setTasks(tasks.map((t) => (t.id === taskId ? updated : t)));
    } catch {
      setError("Failed to update task");
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDesc(task.description || "");
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !editingTask) return;
    try {
      const updated = await tasksApi.update(user.user_id, editingTask.id, editTitle, editDesc || undefined);
      setTasks(tasks.map((t) => (t.id === editingTask.id ? updated : t)));
      setEditingTask(null);
    } catch {
      setError("Failed to update task");
    }
  };

  const handleSignOut = () => {
    signOut();
    router.push("/signin");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">📝 My Tasks</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">Hi, {user?.name}</span>
          <button
            onClick={handleSignOut}
            className="text-sm text-red-500 hover:underline"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
            <button onClick={() => setError("")} className="ml-2 font-bold">×</button>
          </div>
        )}

        {/* Filter Bar */}
        <div className="flex gap-2 mb-6">
          {["all", "pending", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition ${
                filter === f
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {f}
            </button>
          ))}
          <button
            onClick={() => setShowForm(!showForm)}
            className="ml-auto bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-blue-700 transition"
          >
            + Add Task
          </button>
        </div>

        {/* Add Task Form */}
        {showForm && (
          <form onSubmit={handleAddTask} className="bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-sm">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Task title *"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            />
            <textarea
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Description (optional)"
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-900 bg-white"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={adding}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {adding ? "Adding..." : "Add Task"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-lg text-sm text-gray-600 border border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Edit Task Modal */}
        {editingTask && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <form onSubmit={handleEditSave} className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl mx-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Edit Task</h2>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              />
              <textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-900 bg-white"
              />
              <div className="flex gap-2">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                  Save
                </button>
                <button type="button" onClick={() => setEditingTask(null)} className="px-4 py-2 rounded-lg text-sm text-gray-600 border border-gray-300 hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Task List */}
        {loading ? (
          <div className="text-center text-gray-400 py-12">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            No tasks yet. Click "Add Task" to get started!
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`bg-white border rounded-xl p-4 shadow-sm flex items-start gap-3 ${
                  task.completed ? "opacity-60" : ""
                }`}
              >
                <button
                  onClick={() => handleToggle(task.id)}
                  className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition ${
                    task.completed
                      ? "bg-green-500 border-green-500 text-white"
                      : "border-gray-300 hover:border-blue-400"
                  }`}
                >
                  {task.completed && <span className="text-xs">✓</span>}
                </button>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium text-gray-800 ${task.completed ? "line-through" : ""}`}>
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-xs text-gray-500 mt-0.5">{task.description}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(task.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(task)}
                    className="text-xs text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Floating Chat Bubble */}
      <ChatBubble onTaskChange={fetchTasks} />

    </div>
  );
}



