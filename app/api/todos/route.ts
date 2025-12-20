import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// =====================
// GET todos
// =====================
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const filter = searchParams.get("filter");
  const sort = searchParams.get("sort");

  const where: Prisma.TodoWhereInput = {};

  if (filter === "active") where.completed = false;
  if (filter === "completed") where.completed = true;

  let orderBy: Prisma.TodoOrderByWithRelationInput[] = [
    { createdAt: "desc" },
  ];

  if (sort === "deadline") {
    orderBy = [
      { deadline: "asc" },
      { createdAt: "desc" },
    ];
  }

  const todos = await prisma.todo.findMany({
    where,
    orderBy,
  });

  return Response.json(todos);
}


// =====================
// POST
// =====================
export async function POST(req: Request) {
  const body: { title?: string; deadline?: string } = await req.json();

  if (!body.title) {
    return new Response(
      JSON.stringify({ error: "Title is required" }),
      { status: 400 }
    );
  }

  const todo = await prisma.todo.create({
    data: {
      title: body.title,
      deadline: body.deadline ? new Date(body.deadline) : null,
    },
  });

  return Response.json(todo, { status: 201 });
}


// =====================
// PUT
// =====================
export async function PUT(req: Request) {
  const body: {
    id: number;
    title?: string;
    completed?: boolean;
    deadline?: string | null;
  } = await req.json();

  const updated = await prisma.todo.update({
    where: { id: body.id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.completed !== undefined && { completed: body.completed }),
      ...(body.deadline !== undefined && {
        deadline: body.deadline ? new Date(body.deadline) : null,
      }),
    },
  });

  return Response.json(updated);
}


// =====================
// DELETE
// =====================
export async function DELETE(req: Request) {
  const body: { id: number } = await req.json();

  await prisma.todo.delete({
    where: { id: body.id },
  });

  return Response.json({ success: true });
}

