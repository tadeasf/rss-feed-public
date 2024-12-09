'use client'

import { useSession, signOut } from "next-auth/react"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useState } from "react"
import type { FeedItem } from "@/models/Feed"

// Temporary mock data until we implement the database
const mockFeedItems: FeedItem[] = [
  {
    _id: "1",
    title: "First Post",
    link: "https://example.com/1",
    date: new Date(),
  },
]

export default function Home() {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login')
    },
  })
  const [feedItems] = useState<FeedItem[]>(mockFeedItems)

  if (status === "loading") {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Kocouřátčí feed</h1>
        <Button variant="outline" onClick={() => signOut()}>
          Sign out
        </Button>
      </div>
      
      <Button className="mb-6">Add</Button>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Link</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {feedItems.map((item) => (
            <TableRow key={item._id}>
              <TableCell>{item.title}</TableCell>
              <TableCell>
                <a 
                  href={item.link}
                  className="text-blue-500 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.link}
                </a>
              </TableCell>
              <TableCell>
                {item.date.toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
