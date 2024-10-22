import Repo, { connectToMongoDB } from "@/app/lib/repo";
import { headers } from "next/headers";

export async function GET(request: Request) {
  return new Response("Hello, Next.js!");
}

export async function POST(request: Request) {
  try {
    const db = await connectToMongoDB("events");
    const repo = new Repo(db);
    await repo.create({ name: "New Event" });
  } catch (e: any) {
    return new Response(`Error creating event ${e.message}`, { status: 500 });
  }
  return new Response("Event created!");
}

export async function DELETE(request: Request) {}
