"use client";

import { useEffect, useState } from "react";
import TodoItem from "./components/TodoItem";

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
  const [sort, setSort] = useState("newest");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [now] = useState(() => Date.now());

  // =========================
  // FETCH TODOS
  // =========================
  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/todos?filter=${filter}&sort=${sort}`);

        if (!res.ok) {
          throw new Error("Fetch failed");
        }

        const data = await res.json();
        setTodos(data);
      } catch {
        setError("Tidak bisa memuat todo. Coba refresh.");
        setTodos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, [filter, sort]);

  const refresh = () => setFilter((f) => f);

  // =========================
  // ACTIONS
  // =========================
  const addTodo = async () => {
    if (!input.trim()) return;

    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: input, deadline: deadline || null }),
    });

    setInput("");
    setDeadline("");
    refresh();
  };

    const toggleTodo = async (todo: Todo) => {
    // 1️⃣ SIMPAN STATE LAMA (untuk rollback)
    const previousTodos = todos;

    // 2️⃣ UPDATE UI LANGSUNG
    setTodos((prev) =>
      prev.map((t) =>
        t.id === todo.id
          ? { ...t, completed: !t.completed }
          : t
      )
    );

    // 3️⃣ PANGGIL API
    try {
      const res = await fetch("/api/todos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: todo.id,
          completed: !todo.completed,
        }),
      });

      if (!res.ok) throw new Error("Failed");
    } catch {
      // 4️⃣ ROLLBACK KALAU GAGAL
      setTodos(previousTodos);
    }
  };

  const deleteTodo = async (id: number) => {
    await fetch("/api/todos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    refresh();
  };

  const saveEdit = async (todo: Todo) => {
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
    refresh();
  };

  // =========================
  // UI
  // =========================
  return (
    <main className="p-4 sm:p-10 max-w-xl mx-auto ">
      <h1 className="text-2xl sm:text-3xl font-bold mb-5 text-center sm:text-left">To-Do List</h1>

      {/* Filter & Sort */}
      <div className="flex gap-3 mb-5 items-center overflow-x-auto">
        <div className="flex gap-2" >
          {["all", "active", "completed"].map((f) => (
            <button
              key={f}
              className={filter === f ? "font-bold text-blue-600" : ""}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <label htmlFor="sort" className="text-sm whitespace-nowrap ml-auto">
            Urutkan
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border px-2 py-1 rounded"
          >
          <option className="text-black" value="newest">Terbaru</option>
          <option className="text-black" value="deadline">Deadline</option>
          </select>
        </div>
      </div>

   {/* Add Todo */}
  <div className="flex flex-col sm:flex-row gap-2 mb-5">
    <input
      aria-label="Judul Todo"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Tambah todo..."
      className="flex-1 border px-3 py-2 rounded bg-amber-50 text-black "
    />

    <input
      aria-label="Deadline Todo"
      type="datetime-local"
      value={deadline}
      onChange={(e) => setDeadline(e.target.value)}
      className="border px-3 py-2 rounded bg-amber-50 text-black"
    />

    <button
      onClick={addTodo}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Add
    </button>
  </div>

  {/* STATES */}
  {loading && (
    <div className="text-center text-gray-500 py-10">
      Memuat todo...
    </div>
  )}

  {error && (
    <div className="text-center text-red-500 py-10">
      {error}
    </div>
  )}

  {!loading && !error && todos.length === 0 && (
    <div className="text-center text-gray-400 py-10">
      Belum ada todo. Yuk tambahin ✨
    </div>
  )}

  {/* Todo List */}
  <div className="space-y-3">
    {!loading &&
      !error &&
      todos.map((todo) => {
        const isNearDeadline =
          todo.deadline &&
          new Date(todo.deadline).getTime() - now <
            24 * 60 * 60 * 1000;

        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            isNearDeadline={!!isNearDeadline}
            isEditing={editingId === todo.id}
            editingTitle={editingTitle}
            editingDeadline={editingDeadline}
            onToggle={() => toggleTodo(todo)}
            onEditStart={() => {
              setEditingId(todo.id);
              setEditingTitle(todo.title);
              setEditingDeadline(todo.deadline);
            }}
            onEditChangeTitle={setEditingTitle}
            onEditChangeDeadline={setEditingDeadline}
            onEditSave={() => saveEdit(todo)}
            onDelete={() => deleteTodo(todo.id)}
          />
        );
      })}
  </div>
</main>
  );
}
