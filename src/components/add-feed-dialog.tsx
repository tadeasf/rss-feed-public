'use client'

import dynamic from 'next/dynamic'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { useState } from "react"

const Dialog = dynamic(() => import("@/components/ui/dialog").then(mod => mod.Dialog))
const DialogContent = dynamic(() => import("@/components/ui/dialog").then(mod => mod.DialogContent))
const DialogHeader = dynamic(() => import("@/components/ui/dialog").then(mod => mod.DialogHeader))
const DialogTitle = dynamic(() => import("@/components/ui/dialog").then(mod => mod.DialogTitle))
const DialogTrigger = dynamic(() => import("@/components/ui/dialog").then(mod => mod.DialogTrigger))

interface AddFeedDialogProps {
  onSubmit: (infoHash: string, title?: string) => void
  isLoading: boolean
}

export function AddFeedDialog({ onSubmit, isLoading }: AddFeedDialogProps) {
  const [open, setOpen] = useState(false)
  const [infoHash, setInfoHash] = useState('')
  const [title, setTitle] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(infoHash, title)
    setInfoHash('')
    setTitle('')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mb-6">Add</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Feed Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title (Optional)</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter torrent title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="infoHash">Info Hash</Label>
            <Input
              id="infoHash"
              value={infoHash}
              onChange={(e) => setInfoHash(e.target.value)}
              placeholder="Enter 40-character info hash"
              pattern="[a-fA-F0-9]{40}"
              required
            />
          </div>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Feed"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 