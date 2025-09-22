// app/projects/page.tsx
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
      router.push("/login");
    } else {
      fetchProjects(token);
    }
  }, []);

  const fetchProjects = async (token: string) => {
    const res = await fetch("http://localhost:5000/api/projects", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setProjects(data);
  };

  const createProject = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch("http://localhost:5000/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, description }),
    });

    if (res.ok) {
      setName("");
      setDescription("");
      fetchProjects(token); // refresh list
    }
  };

  const deleteProject = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    await fetch(`http://localhost:5000/api/projects/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchProjects(token);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Your Projects</h1>

      {/* Create Project Form */}
      <div className="mb-6 p-4 border rounded bg-gray-100">
        <input
          type="text"
          placeholder="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 mr-2"
        />
        <button
          onClick={createProject}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create
        </button>
      </div>

      {/* Project List */}
      <ul className="space-y-3">
        {projects.map((p) => (
          <li
            key={p.id}
            className="flex justify-between items-center p-4 border rounded"
          >
            <div>
              <h2 className="font-semibold">{p.name}</h2>
              <p className="text-sm text-gray-600">{p.description}</p>
            </div>
            <button
              onClick={() => deleteProject(p.id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
