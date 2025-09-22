"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
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
    const data = await res.json();
    setProjects(data);
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

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center md:text-left text-black">
        Your Projects
      </h1>

      {/* Create Project Form */}
      <div className="mb-8 p-5 bg-white border border-black rounded-xl flex flex-col md:flex-row gap-4 md:gap-3 items-center shadow-sm hover:shadow-md transition">
        <input
          type="text"
          placeholder="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-black rounded-lg px-4 py-2 flex-1 focus:outline-none focus:ring-1 focus:ring-black text-black transition"
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-black rounded-lg px-4 py-2 flex-1 focus:outline-none focus:ring-1 focus:ring-black text-black transition"
        />

        <button
          onClick={createProject}
          className="bg-black text-white px-5 py-2 rounded-lg border border-black hover:bg-white hover:text-black transition transform hover:scale-105 font-semibold"
        >
          Create
        </button>
      </div>

      {/* Project List */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <li
            key={p._id}
            className="bg-white border border-black rounded-xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition cursor-pointer"
          >
            <div onClick={() => router.push(`/projects/${p._id}`)}>
              <h2 className="text-lg md:text-xl font-bold text-black mb-2">{p.name}</h2>
              <p className="text-sm text-gray-700">{p.description || "No description provided."}</p>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => deleteProject(p._id)}
                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition font-medium"
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
