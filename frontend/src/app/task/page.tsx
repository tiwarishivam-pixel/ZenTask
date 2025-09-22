"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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

export default function ProjectBoard() {
  const params = useParams();
  const id = params?.id as string;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", priority: "medium", deadline: "" });

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!id || !token) return;
    axios
      .get(`http://localhost:5000/api/tasks/project/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTasks(res.data))
      .catch((err) => console.error(err));
  }, [id, token]);

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
    setForm({ title: "", priority: "medium", deadline: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditTaskId(task._id);
    setForm({ title: task.title, priority: task.priority, deadline: task.deadline.split("T")[0] });
    setIsModalOpen(true);
  };

  const saveTask = async () => {
    if (!form.title.trim()) return alert("Task title is required");
    if (!form.deadline) return alert("Deadline is required");

    try {
      if (editTaskId) {
        const res = await axios.put(
          `http://localhost:5000/api/tasks/${editTaskId}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTasks(tasks.map((t) => (t._id === editTaskId ? res.data : t)));
      } else {
        const res = await axios.post(
          "http://localhost:5000/api/tasks",
          { ...form, projectId: id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTasks([...tasks, res.data]);
      }

      setIsModalOpen(false);
      setForm({ title: "", priority: "medium", deadline: "" });
      setEditTaskId(null);
    } catch (err) {
      console.error("Failed to save task:", err);
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
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-black">Kanban Board</h1>
        <button
          onClick={openAddModal}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-white hover:text-black border border-black transition"
        >
          + Add Task
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(statusColumns).map(([statusKey, label]) => (
            <Droppable droppableId={statusKey} key={statusKey}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-white border border-black rounded-xl p-4 min-h-[400px] transition hover:shadow-md"
                >
                  <h2 className="text-lg font-semibold mb-4 text-black">{label}</h2>
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
                              <span className="text-xs px-2 py-1 rounded bg-white text-black">{task.priority.toUpperCase()}</span>
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
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-96 shadow-lg transition">
            <h2 className="text-xl font-bold mb-4 text-black">{editTaskId ? "Edit Task" : "Add Task"}</h2>

            <input
              type="text"
              placeholder="Task title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-black px-3 py-2 rounded mb-3 text-black focus:outline-none focus:ring-1 focus:ring-black transition"
            />

            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              className="w-full border border-black px-3 py-2 rounded mb-3 text-black focus:outline-none focus:ring-1 focus:ring-black transition"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>

            <input
              type="date"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              className="w-full border border-black px-3 py-2 rounded mb-4 text-black focus:outline-none focus:ring-1 focus:ring-black transition"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
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
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-white hover:text-black border border-black transition"
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
