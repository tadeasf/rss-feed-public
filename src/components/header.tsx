'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ModeToggle } from './mode-toggle'

export function Header() {
  const pathname = usePathname()

  return (
    <header className="border-b">
      <div className="container mx-auto py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold">Kocouřátčí feed</h1>
            <nav className="flex space-x-6">
              <Link 
                href="/" 
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === "/" ? "text-foreground" : "text-foreground/60"
                )}
              >
                Home
              </Link>
              <Link 
                href="/search" 
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === "/search" ? "text-foreground" : "text-foreground/60"
                )}
              >
                Search
              </Link>
            </nav>
          </div>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
} 