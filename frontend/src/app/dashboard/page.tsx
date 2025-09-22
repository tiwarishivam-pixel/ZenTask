"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

type Project = { _id: string; name: string; description: string };
type Task = { _id: string; title: string; status: "todo" | "in-progress" | "done"; priority: "low" | "medium" | "high"; deadline: string };

const COLORS = ["#000000", "#555555", "#AAAAAA"]; // Monochrome shades

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) return;
    axios.get("http://localhost:5000/api/projects", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setProjects(res.data))
      .catch((err) => console.error(err));
    axios.get("http://localhost:5000/api/tasks", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setTasks(res.data))
      .catch((err) => console.error(err));
  }, [token]);

  const taskCounts = {
    todo: tasks.filter((t) => t.status === "todo").length,
    "in-progress": tasks.filter((t) => t.status === "in-progress").length,
    done: tasks.filter((t) => t.status === "done").length,
  };
  const overdueTasks = tasks.filter((t) => new Date(t.deadline) < new Date());
  const chartData = [
    { name: "Todo", value: taskCounts.todo },
    { name: "In Progress", value: taskCounts["in-progress"] },
    { name: "Done", value: taskCounts.done },
  ];

  return (
    <div className="p-4 md:p-6 bg-white text-black min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6">
        {[
          { label: "Total Projects", value: projects.length },
          { label: "Total Tasks", value: tasks.length },
          { label: "Overdue Tasks", value: overdueTasks.length }
        ].map((card) => (
          <div
            key={card.label}
            className="border border-black rounded-lg p-3 text-center hover:shadow-sm transition"
          >
            <h2 className="text-sm md:text-base font-medium">{card.label}</h2>
            <p className="text-lg md:text-xl font-bold mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Tasks by Status Chart */}
      <div className="border border-black rounded-lg p-3 md:p-4 mb-6">
        <h2 className="text-sm md:text-base font-medium mb-2">Tasks by Status</h2>
        <div className="w-full h-48 md:h-60">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label={{ fill: "#000", fontSize: 10 }}>
                {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index]} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #000", color: "#000" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Overdue Tasks */}
      <div className="border border-black rounded-lg p-3 md:p-4">
        <h2 className="text-sm md:text-base font-medium mb-2">Overdue Tasks</h2>
        {overdueTasks.length === 0 ? (
          <p className="text-gray-700 text-sm md:text-base">No overdue tasks!</p>
        ) : (
          <ul className="divide-y divide-black max-h-48 overflow-y-auto">
            {overdueTasks.map((task) => (
              <li key={task._id} className="py-1 flex justify-between border-b border-black text-sm md:text-base">
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
