"use client";

import { useEffect, useState } from "react";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  deadline: string | null;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [deadline, setDeadline] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDeadline, setEditingDeadline] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest"); // "newest" | "deadline"

  const loadTodos = async () => {
    try {
      const res = await fetch(`/api/todos?filter=${filter}&sort=${sort}`);
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setTodos([]);
    }
  };

  useEffect(() => {
    loadTodos();
  }, [filter, sort]);

  const addTodo = async () => {
    if (!input.trim()) return;
    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: input, deadline: deadline || null }),
    });
    setInput("");
    setDeadline("");
    loadTodos();
  };

  const toggleTodo = async (todo: Todo) => {
    await fetch("/api/todos", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: todo.id, completed: !todo.completed }),
    });
    loadTodos();
  };

  const deleteTodo = async (id: number) => {
    await fetch("/api/todos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadTodos();
  };

  const handleEditSave = async (todo: Todo) => {
    if (!editingTitle.trim()) return;
    await fetch("/api/todos", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: todo.id,
        title: editingTitle,
        deadline: editingDeadline || null,
      }),
    });
    setEditingId(null);
    setEditingTitle("");
    setEditingDeadline(null);
    loadTodos();
  };

  return (
    <main className="p-10 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-5">To-Do List</h1>

      {/* Filter & Sort */}
      <div className="flex gap-3 mb-5">
        <button
          className={filter === "all" ? "font-bold text-blue-600" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={filter === "active" ? "font-bold text-blue-600" : ""}
          onClick={() => setFilter("active")}
        >
          Active
        </button>
        <button
          className={filter === "completed" ? "font-bold text-blue-600" : ""}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>

        <select
          className="ml-auto border px-2 py-1 rounded"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="newest">Terbaru dibuat</option>
          <option value="deadline">Deadline terdekat</option>
        </select>
      </div>

      {/* Add Todo */}
      <div className="flex gap-2 mb-5">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border px-3 py-2 rounded"
          placeholder="Tambah todo..."
        />
        <input
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <button
          onClick={addTodo}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add
        </button>
      </div>

      {/* Todo List */}
      <div className="space-y-3">
        {todos.map((todo) => {
          const isNearDeadline =
            todo.deadline &&
            new Date(todo.deadline).getTime() - Date.now() < 24 * 60 * 60 * 1000;
          return (
            <div
              key={todo.id}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border text-gray-950"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo)}
                />

                {editingId === todo.id ? (
                  <>
                    <input
                      className="border px-2 py-1 rounded"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                    />
                    <input
                      type="datetime-local"
                      className="border px-2 py-1 rounded"
                      value={editingDeadline || ""}
                      onChange={(e) => setEditingDeadline(e.target.value)}
                    />
                  </>
                ) : (
                  <div>
                    <span
                      className={todo.completed ? "line-through text-gray-500" : ""}
                    >
                      {todo.title}
                    </span>
                    <div
                      className={`text-sm ${
                        isNearDeadline ? "text-red-500" : "text-gray-600"
                      }`}
                    >
                      {todo.deadline
                        ? `Deadline: ${new Date(todo.deadline).toLocaleString()}`
                        : "-"}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {editingId === todo.id ? (
                  <button
                    className="text-green-600"
                    onClick={() => handleEditSave(todo)}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="text-blue-600"
                    onClick={() => {
                      setEditingId(todo.id);
                      setEditingTitle(todo.title);
                      setEditingDeadline(todo.deadline);
                    }}
                  >
                    Edit
                  </button>
                )}
                <button
                  className="text-red-500"
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
