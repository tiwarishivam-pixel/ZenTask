"use client";

import { AxiosResponse } from "axios";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Dialog } from "@headlessui/react";

type Task = {
  _id: string;
  title: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  deadline: string;
};

const statusColumns: { [key: string]: string } = {
  todo: "Todo",
  "in-progress": "In Progress",
  done: "Done",
};

export default function TaskPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectId = searchParams.get("projectId");

  const [projectName, setProjectName] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", priority: "medium", deadline: "", status: "todo" });

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!projectId || !token) return;

    // Fetch tasks
    axios
      .get(`http://localhost:5000/api/tasks/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTasks(res.data))
      .catch((err) => console.error(err));

    // Fetch project name
    axios
      .get(`http://localhost:5000/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProjectName(res.data.name))
      .catch((err) => console.error(err));
  }, [projectId, token]);

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId) return;

    const updatedTasks = tasks.map((task) =>
      task._id === draggableId ? { ...task, status: destination.droppableId as Task["status"] } : task
    );
    setTasks(updatedTasks);

    try {
      await axios.put(
        `http://localhost:5000/api/tasks/${draggableId}`,
        { status: destination.droppableId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  const openAddModal = () => {
    setEditTaskId(null);
    setForm({ title: "", priority: "medium", deadline: "", status: "todo" });
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditTaskId(task._id);
    setForm({ title: task.title, priority: task.priority, deadline: task.deadline.split("T")[0], status: task.status });
    setIsModalOpen(true);
  };

  const saveTask = async () => {
    if (!form.title.trim()) return alert("Task title is required");
    if (!form.deadline) return alert("Deadline is required");

    try {
      const payload = {
        title: form.title,
        priority: form.priority,
        deadline: new Date(form.deadline).toISOString(),
        projectId: projectId,
        status: form.status,
      };

      let res: AxiosResponse<Task>;

      if (editTaskId) {
        res = await axios.put(
          `http://localhost:5000/api/tasks/${editTaskId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTasks(tasks.map((t) => (t._id === editTaskId ? res.data : t)));
      } else {
        res = await axios.post(
          "http://localhost:5000/api/tasks",
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTasks([...tasks, res.data]);
      }

      setIsModalOpen(false);
      setForm({ title: "", priority: "medium", deadline: "", status: "todo" });
      setEditTaskId(null);
    } catch (err: any) {
      console.error("Failed to save task:", err.response?.data || err.message);
      alert(`Error saving task: ${err.response?.data?.message || err.message}`);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((t) => t._id !== taskId));
      setIsModalOpen(false);
      setEditTaskId(null);
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-600 text-white";
      case "medium": return "bg-yellow-400 text-black";
      case "low": return "bg-green-500 text-white";
      default: return "bg-gray-300 text-black";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-6 md:p-10 text-white">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">{projectName ? `Kanban – ${projectName}` : "Kanban Board"}</h1>
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/project")}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold text-sm sm:text-base"
          >
            Back to Projects
          </button>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold text-sm sm:text-base"
          >
            + Add Task
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Object.entries(statusColumns).map(([statusKey, label]) => (
            <Droppable droppableId={statusKey} key={statusKey}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-gray-800 border border-gray-700 rounded-xl p-4 min-h-[400px] transition hover:shadow-xl"
                >
                  <h2 className="text-lg font-semibold mb-4">{label}</h2>
                  {tasks
                    .filter((task) => task.status === statusKey)
                    .map((task, index) => (
                      <Draggable draggableId={task._id} index={index} key={task._id}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => openEditModal(task)}
                            className={`p-3 mb-3 rounded-lg shadow cursor-pointer transition transform hover:scale-105 ${getPriorityColor(task.priority)}`}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <h3 className="font-semibold">{task.title}</h3>
                              <span className="text-xs px-2 py-1 rounded bg-gray-900 text-white">{task.priority.toUpperCase()}</span>
                            </div>
                            <p className="text-sm">Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-sm shadow-lg transition">
            <h2 className="text-xl font-bold mb-4">{editTaskId ? "Edit Task" : "Add Task"}</h2>

            <input
              type="text"
              placeholder="Task title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-gray-700 px-3 py-2 rounded mb-3 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />

            <div className="mb-3">
              <label className="text-sm font-medium mb-1 block">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full border border-gray-700 px-3 py-2 rounded bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              >
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              className="w-full border border-gray-700 px-3 py-2 rounded mb-3 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>

            <input
              type="date"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              className="w-full border border-gray-700 px-3 py-2 rounded mb-4 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>

              {editTaskId && (
                <button
                  onClick={() => deleteTask(editTaskId)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>
              )}

              <button
                onClick={saveTask}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                {editTaskId ? "Save Changes" : "Add"}
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
