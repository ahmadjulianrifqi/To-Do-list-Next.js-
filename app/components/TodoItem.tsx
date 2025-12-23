"use client";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  deadline: string | null;
}

interface TodoItemProps {
  todo: Todo;
  isNearDeadline: boolean;
  isEditing: boolean;

  editingTitle: string;
  editingDeadline: string | null;

  onToggle(): void;
  onEditStart(): void;
  onEditChangeTitle(value: string): void;
  onEditChangeDeadline(value: string): void;
  onEditSave(): void;
  onDelete(): void;
}

export default function TodoItem({
  todo,
  isNearDeadline,
  isEditing,
  editingTitle,
  editingDeadline,
  onToggle,
  onEditStart,
  onEditChangeTitle,
  onEditChangeDeadline,
  onEditSave,
  onDelete,
}: TodoItemProps) {
  return (
    <div className="p-4 border rounded-lg bg-blue-500 shadow-sm flex flex-col gap-3">
      {/* Top: checkbox + content */}
      <div className="flex gap-3 items-start">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={onToggle}
          className="mt-1"
          aria-label={`Toggle ${todo.title}`}
        />

        {/* CONTENT */}
        <div className="flex-1">
          {isEditing ? (
            <div className="flex flex-col gap-2">
              <input
                aria-label="Edit judul todo"
                className="border px-3 py-2 rounded text-black"
                value={editingTitle}
                onChange={(e) => onEditChangeTitle(e.target.value)}
              />

              <input
                aria-label="Edit deadline todo"
                type="datetime-local"
                className="border px-3 py-2 rounded text-black"
                value={editingDeadline || ""}
                onChange={(e) => onEditChangeDeadline(e.target.value)}
              />
            </div>
          ) : (
            <div>
              <div
                className={`font-medium ${
                  todo.completed ? "line-through text-gray-400" : "text-gray-900"
                }`}
              >
                {todo.title}
              </div>

              <div
                className={`text-sm ${
                  isNearDeadline ? "text-red-500" : "text-gray-500"
                }`}
              >
                {todo.deadline
                  ? new Date(todo.deadline).toLocaleString()
                  : "Tidak ada deadline"}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        {isEditing ? (
          <button
            onClick={onEditSave}
            className="px-4 py-1.5 rounded bg-blue-600 text-white text-sm"
          >
            Save
          </button>
        ) : (
          <button
            onClick={onEditStart}
            className="px-4 py-1.5 rounded border text-sm"
          >
            Edit
          </button>
        )}

        <button
          onClick={onDelete}
          className="px-4 py-1.5 rounded border border-red-300 text-red-600 text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
}