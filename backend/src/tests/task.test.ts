import request from "supertest";
import app from "../app";
import mongoose from "mongoose";
import {Task} from "../models/task.model";
import {User} from "../models/user.model"; // Assuming you have a User model
import {Project} from "../models/project.model"; // Assuming you have a Project model

describe("Tasks API", () => {
  let token: string;
  let projectId: string;
  let taskId: string;

  beforeAll(async () => {
    // Connect to test DB
    await mongoose.connect(process.env.MONGO_URI_TEST!);

    // Create a test user
    const user = await User.create({ name: "Test User", email: "test@example.com", password: "password123" });

    // Login to get JWT
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "password123" });

    token = res.body.token;

    // Create a test project
    const project = await Project.create({ name: "Test Project", description: "Test description" });
    projectId = project._id.toString();
  });

  afterAll(async () => {
    // Clean up DB
    await Task.deleteMany({});
    await Project.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  it("should create a new task", async () => {
    const taskData = {
      title: "Test Task",
      status: "todo",
      priority: "medium",
      deadline: "2025-09-30T00:00:00Z",
      projectId,
    };

    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send(taskData);

    expect(res.status).toBe(201);
    expect(res.body.title).toBe(taskData.title);
    expect(res.body.status).toBe(taskData.status);
    taskId = res.body._id;
  });

  it("should fetch tasks by project", async () => {
    const res = await request(app)
      .get(`/api/tasks/project/${projectId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should update a task", async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "in-progress", title: "Updated Task" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("in-progress");
    expect(res.body.title).toBe("Updated Task");
  });

  it("should delete a task", async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });
});
