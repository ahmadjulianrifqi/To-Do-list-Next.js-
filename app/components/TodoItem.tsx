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
    <div className="p-3 border rounded bg-blue-500 flex justify-between ">
      <div className="flex gap-2">
        <input
          type="checkbox"
          aria-label={`Toggle ${todo.title}`}
          checked={todo.completed}
          onChange={onToggle}
        />

        {isEditing ? (
          <>
            <input
              aria-label="Edit judul todo"
              className="border px-2 rounded"
              value={editingTitle}
              onChange={(e) => onEditChangeTitle(e.target.value)}
            />

            <input
              aria-label="Edit deadline todo"
              type="datetime-local"
              className="border px-2 rounded"
              value={editingDeadline || ""}
              onChange={(e) => onEditChangeDeadline(e.target.value)}
            />
          </>
        ) : (
          <div>
            <div className={todo.completed ? "line-through text-gray-500" : ""}>
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
  
      <div className="flex gap-2 ">
        {isEditing ? (
          <button className="bg-blue-500 rounded px-2.5 " onClick={onEditSave}>Save</button>
        ) : (
          <button onClick={onEditStart}>Edit</button>
        )}
        <button className="bg-blue-500" onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
}
