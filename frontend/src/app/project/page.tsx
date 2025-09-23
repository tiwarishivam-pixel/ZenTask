"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Project = { _id: string; name: string; description?: string; tasks?: any[] }; // tasks optional

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
    } else {
      fetchProjects(token);
    }
  }, []);

  const fetchProjects = async (token: string) => {
    const res = await fetch("http://localhost:5000/api/projects", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data: Project[] = await res.json();

    // Fetch tasks count for each project
    const projectsWithTasks = await Promise.all(
      data.map(async (project) => {
        const resTasks = await fetch(`http://localhost:5000/api/tasks/project/${project._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const tasks = await resTasks.json();
        return { ...project, tasks };
      })
    );

    setProjects(projectsWithTasks);
  };

  const createProject = async () => {
    const token = localStorage.getItem("token");
    if (!token || !name.trim()) return;

    const res = await fetch("http://localhost:5000/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name, description }),
    });

    if (res.ok) {
      setName("");
      setDescription("");
      fetchProjects(token);
    }
  };

  const deleteProject = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    await fetch(`http://localhost:5000/api/projects/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProjects(token);
  };

  const getTaskCountByStatus = (tasks: any[], status: string) =>
    tasks.filter((t) => t.status === status).length;

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-6 md:p-10 text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
          Your Projects
        </h1>
        <button
          onClick={() => router.push("/dashboard")}
          className="px-4 py-2 sm:px-5 sm:py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold text-sm sm:text-base"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Create Project Form */}
      <div className="mb-8 p-5 bg-gray-800 border border-gray-700 rounded-xl flex flex-col sm:flex-row gap-3 sm:gap-4 items-center shadow-lg hover:shadow-xl transition">
        <input
          type="text"
          placeholder="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-600 rounded-lg px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-900 text-white transition w-full sm:w-auto text-sm sm:text-base"
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-gray-600 rounded-lg px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-900 text-white transition w-full sm:w-auto text-sm sm:text-base"
        />
        <button
          onClick={createProject}
          className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 border border-purple-600 transition font-semibold transform hover:scale-105 w-full sm:w-auto text-sm sm:text-base"
        >
          Create
        </button>
      </div>

      {/* Project List */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {projects.map((p) => (
          <li
            key={p._id}
            className="bg-gray-800 border border-gray-700 rounded-xl p-5 flex flex-col justify-between shadow-lg hover:shadow-xl transition cursor-pointer min-h-[180px]"
          >
            {/* Project info */}
            <div onClick={() => router.push(`/task?projectId=${p._id}`)}>
              <h2 className="text-lg sm:text-lg md:text-xl font-bold text-white mb-2 truncate">
                {p.name}
              </h2>
              <p className="text-gray-300 text-sm sm:text-sm md:text-base truncate">
                {p.description || "No description provided."}
              </p>
            </div>

            {/* Task Summary Badges */}
            {p.tasks && (
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs">Total: {p.tasks.length}</span>
                <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs">Todo: {getTaskCountByStatus(p.tasks, "todo")}</span>
                <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">In Progress: {getTaskCountByStatus(p.tasks, "in-progress")}</span>
                <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">Done: {getTaskCountByStatus(p.tasks, "done")}</span>
              </div>
            )}

            {/* Delete button */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => deleteProject(p._id)}
                className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition font-medium text-xs sm:text-sm md:text-base"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
