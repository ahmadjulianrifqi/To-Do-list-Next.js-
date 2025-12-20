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
  const [sort, setSort] = useState("newest");

  // waktu sekarang (aman dipakai di render)
  const [now] = useState(() => Date.now());

  // =========================
  // FETCH TODOS (SATU-SATUNYA)
  // =========================
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await fetch(`/api/todos?filter=${filter}&sort=${sort}`);
        const data = await res.json();
        setTodos(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setTodos([]);
      }
    };

    fetchTodos();
  }, [filter, sort]);

  // =========================
  // ACTIONS
  // =========================
  const refresh = () => setFilter((f) => f);

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
    await fetch("/api/todos", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: todo.id, completed: !todo.completed }),
    });

    refresh();
  };

  const deleteTodo = async (id: number) => {
    await fetch("/api/todos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    refresh();
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
    refresh();
  };

  // =========================
  // UI
  // =========================
  return (
    <main className="p-10 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-5">To-Do List</h1>

      {/* Filter & Sort */}
      <div className="flex gap-3 mb-5 items-center">
        {["all", "active", "completed"].map((f) => (
          <button
            key={f}
            className={filter === f ? "font-bold text-blue-600" : ""}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}

        <label htmlFor="sort" className="ml-auto text-sm">
          Urutkan
        </label>
        <select
          id="sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="newest">Terbaru</option>
          <option value="deadline">Deadline</option>
        </select>
      </div>

      {/* Add Todo */}
      <div className="flex gap-2 mb-5">
        <label htmlFor="title" className="sr-only">
          Judul Todo
        </label>
        <input
          id="title"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tambah todo..."
          className="flex-1 border px-3 py-2 rounded"
        />

        <label htmlFor="deadline" className="sr-only">
          Deadline Todo
        </label>
        <input
          id="deadline"
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        <button
          onClick={addTodo}
          className="bg-blue-500 text-white px-4 rounded"
        >
          Add
        </button>
      </div>

      {/* Todo List */}
      <div className="space-y-3">
        {todos.map((todo) => {
          const isNearDeadline =
            todo.deadline &&
            new Date(todo.deadline).getTime() - now < 24 * 60 * 60 * 1000;

          return (
            <div
              key={todo.id}
              className="p-3 border rounded bg-gray-50 flex justify-between"
            >
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  aria-label={`Toggle ${todo.title}`}
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo)}
                />

                {editingId === todo.id ? (
                  <>
                    <input
                      aria-label="Edit judul todo"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      className="border px-2 rounded"
                    />

                    <input
                      aria-label="Edit deadline todo"
                      type="datetime-local"
                      value={editingDeadline || ""}
                      onChange={(e) => setEditingDeadline(e.target.value)}
                      className="border px-2 rounded"
                    />
                  </>
                ) : (
                  <div>
                    <div
                      className={
                        todo.completed ? "line-through text-gray-500" : ""
                      }
                    >
                      {todo.title}
                    </div>
                    <div
                      className={`text-sm ${
                        isNearDeadline ? "text-red-500" : "text-gray-600"
                      }`}
                    >
                      {todo.deadline
                        ? new Date(todo.deadline).toLocaleString()
                        : "-"}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {editingId === todo.id ? (
                  <button onClick={() => handleEditSave(todo)}>Save</button>
                ) : (
                  <button
                    onClick={() => {
                      setEditingId(todo.id);
                      setEditingTitle(todo.title);
                      setEditingDeadline(todo.deadline);
                    }}
                  >
                    Edit
                  </button>
                )}
                <button onClick={() => deleteTodo(todo.id)}>Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
