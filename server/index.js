const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const cors = require("cors");
require("dotenv").config();

const app = express();
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.use(cors());
//  app.use(cors({ origin: 'https://your-frontend.vercel.app' })); // Replace with your actual frontend URL
app.use(express.json());

app.get("/test", (req, res) => {
  console.log("Test endpoint hit");
  res.send("Test endpoint works!");
});
app.get("/test3", (req, res) => {
  console.log("Test_two endpoint hit");
  res.send("Test_two endpoint works!");
});

// Get all tasks
app.get("/api/tasks", async (req, res) => {
  const { data, error } = await supabase.from("tasks").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Create a task
app.post("/api/tasks", async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required" });
  const { data, error } = await supabase
    .from("tasks")
    .insert([{ title }])
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

// Update a task
app.patch("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });
    const { data, error } = await supabase
      .from("tasks")
      .update({ title })
      .eq("id", id)
      .select();
    if (error) throw error;
    if (!data.length) return res.status(404).json({ error: "Task not found" });
    res.json(data[0]);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: error.message });
  }
});

// Delete a task
app.delete("/api/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

const PORT = process.env.PORT || 3001;
const HOST = "http://localhost"; // You can replace this with your actual host if running on a different environment

app.listen(PORT, () => console.log(`Server running at ${HOST}:${PORT}`));
