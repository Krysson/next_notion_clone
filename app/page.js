"use client"
import NotionLikeEditor from "../components/NotionLikeEditor"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">My Notion-like Editor</h1>
      <NotionLikeEditor />
    </main>
  )
}
