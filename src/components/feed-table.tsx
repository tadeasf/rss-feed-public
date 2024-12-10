'use client'

import dynamic from 'next/dynamic'
import type { FeedItem } from "@/models/Feed"

const Table = dynamic(() => import("@/components/ui/table").then(mod => mod.Table))
const TableBody = dynamic(() => import("@/components/ui/table").then(mod => mod.TableBody))
const TableCell = dynamic(() => import("@/components/ui/table").then(mod => mod.TableCell))
const TableHead = dynamic(() => import("@/components/ui/table").then(mod => mod.TableHead))
const TableHeader = dynamic(() => import("@/components/ui/table").then(mod => mod.TableHeader))
const TableRow = dynamic(() => import("@/components/ui/table").then(mod => mod.TableRow))

interface FeedTableProps {
  items: FeedItem[]
}

export function FeedTable({ items }: FeedTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Link</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items?.map((item) => (
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
              {new Date(item.date).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
} 