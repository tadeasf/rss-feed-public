'use client'

import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { FeedItem } from "@/models/Feed"
import { FeedTable } from "@/components/feed-table"
import { AddFeedDialog } from "@/components/add-feed-dialog"
import Loading from "@/components/loading"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function Home() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: feedItems, isLoading: feedsLoading } = useQuery<FeedItem[]>({
    queryKey: ['feeds'],
    queryFn: async () => {
      const response = await fetch('/api/feed', {
        credentials: 'include',
      })
      if (!response.ok) throw new Error('Network response was not ok')
      const data = await response.json()
      if (!Array.isArray(data)) throw new Error('Invalid response format')
      return data
    },
    staleTime: 1000 * 60,
    retry: 3,
    refetchOnWindowFocus: false
  })

  const mutation = useMutation({
    mutationFn: async (newFeed: { infoHash: string, title?: string }) => {
      const response = await fetch('/api/feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          infoHash: newFeed.infoHash,
          title: newFeed.title || `Torrent-${newFeed.infoHash.substring(0, 6)}`
        }),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to add feed')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feeds'] })
      toast({
        title: "Success",
        description: "Feed item added successfully",
      })
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/feed', {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete feeds')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feeds'] })
      toast({
        title: "Success",
        description: "All feeds deleted successfully",
      })
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      })
    },
  })

  const handleDeleteAll = () => {
    if (window.confirm('Are you sure you want to delete all feeds? This action cannot be undone.')) {
      deleteMutation.mutate()
    }
  }

  if (feedsLoading) return <Loading />

  return (
    <div className="container mx-auto py-10">
      <div className="flex gap-4 mb-6">
        <AddFeedDialog 
          onSubmit={(infoHash, title) => mutation.mutate({ infoHash, title })}
          isLoading={mutation.isPending}
        />
        <Button 
          variant="destructive"
          onClick={handleDeleteAll}
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Deleting...
            </>
          ) : (
            "Delete All"
          )}
        </Button>
      </div>
      
      {feedItems && <FeedTable items={feedItems} />}
      <Toaster />
    </div>
  )
}
