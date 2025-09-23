"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type Project = { _id: string; name: string; description?: string };
type Task = { 
  _id: string; 
  projectId: string;
  title: string; 
  status: "todo" | "in-progress" | "done"; 
  priority: "low" | "medium" | "high"; 
  deadline: string 
};

export default function Dashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) return;

    axios.get("http://localhost:5000/api/projects", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setProjects(res.data);
        if (res.data.length > 0) setSelectedProjectId(res.data[0]._id);
        fetchAllTasks(res.data);
      })
      .catch((err) => console.error("Project fetch error:", err));

  }, [token]);

  const fetchAllTasks = async (projects: Project[]) => {
    const allTasks: Task[] = [];
    for (const project of projects) {
      try {
        const res = await axios.get(`http://localhost:5000/api/tasks/project/${project._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        allTasks.push(...res.data);
      } catch (err) {
        console.error(`Tasks fetch error for project ${project._id}:`, err);
      }
    }
    setTasks(allTasks);
  };

  const statusColumns: { [key: string]: { label: string; color: string } } = {
    todo: { label: "Todo", color: "bg-blue-700 text-white" },
    "in-progress": { label: "In Progress", color: "bg-yellow-700 text-black" },
    done: { label: "Done", color: "bg-green-700 text-white" },
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const filteredTasks = selectedProjectId
    ? tasks.filter((t) => t.projectId === selectedProjectId)
    : [];

  const overdueTasks = filteredTasks.filter((t) => new Date(t.deadline) < new Date());

  return (
    <div className="p-4 md:p-6 bg-gray-900 text-white min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-2 md:gap-3">
          <button
            onClick={() => router.push("/project")}
            className="px-3 py-1 md:px-4 md:py-2 bg-black text-white rounded-lg hover:bg-white hover:text-black border border-black transition text-sm md:text-base"
          >
            + New Project
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-1 md:px-4 md:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm md:text-base"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Project Dropdown */}
      {projects.length > 0 && selectedProjectId && (
        <div className="mb-4">
          <label className="mr-2 font-medium text-white">Project:</label>
          <select
            className="border border-gray-600 px-2 py-1 rounded bg-gray-800 text-white text-sm"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
          >
            {projects.map((project) => (
              <option key={project._id} value={project._id}>{project.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3 mb-4">
        <div className="rounded-lg p-2 text-center bg-purple-800 text-white text-sm md:text-base">
          <h2 className="font-medium">Total Projects</h2>
          <p className="font-bold text-lg md:text-xl">{projects.length}</p>
        </div>
        <div className="rounded-lg p-2 text-center bg-blue-800 text-white text-sm md:text-base">
          <h2 className="font-medium">Total Tasks</h2>
          <p className="font-bold text-lg md:text-xl">{filteredTasks.length}</p>
        </div>
        <div className="rounded-lg p-2 text-center bg-red-800 text-white text-sm md:text-base">
          <h2 className="font-medium">Overdue Tasks</h2>
          <p className="font-bold text-lg md:text-xl">{overdueTasks.length}</p>
        </div>
      </div>

      {/* Tasks by Status */}
      <div className="border border-gray-600 rounded-lg p-3 md:p-4 mb-4">
        <h2 className="font-semibold mb-2 text-white">Tasks by Status</h2>
        {Object.entries(statusColumns).map(([statusKey, { label, color }]) => (
          <div key={statusKey} className="mb-2">
            <h3 className={`font-semibold mb-1 px-2 py-1 rounded ${color} text-sm`}>
              {label} ({filteredTasks.filter(t => t.status === statusKey).length})
            </h3>
            <ul className="list-disc list-inside text-white text-sm">
              {filteredTasks.filter(t => t.status === statusKey).map(task => (
                <li key={task._id}>
                  {task.title} - <span className="font-medium">{task.priority.toUpperCase()}</span>
                </li>
              ))}
              {filteredTasks.filter(t => t.status === statusKey).length === 0 && (
                <li className="text-gray-400">No tasks</li>
              )}
            </ul>
          </div>
        ))}
      </div>

      {/* Overdue Tasks */}
      <div className="border border-gray-600 rounded-lg p-3 md:p-4">
        <h2 className="font-semibold mb-2 text-white">Overdue Tasks</h2>
        {overdueTasks.length === 0 ? (
          <p className="text-gray-400 text-sm md:text-base">No overdue tasks!</p>
        ) : (
          <ul className="divide-y divide-gray-600 max-h-48 overflow-y-auto text-sm md:text-base">
            {overdueTasks.map((task) => (
              <li key={task._id} className="py-1 flex justify-between border-b border-gray-600">
                <span>{task.title}</span>
                <span className="font-semibold">{new Date(task.deadline).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
