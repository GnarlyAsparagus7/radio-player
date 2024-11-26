"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <div className="absolute top-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="md" 
            className="w-12 h-9 bg-background/95 backdrop-blur border hover:bg-accent hover:text-accent-foreground"
          >
            <Sun className="h-[1.5rem] w-[1.5rem] rotate-0 scale-100 transition-all text-orange-500 dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.5rem] w-[1.5rem] rotate-90 scale-0 transition-all text-slate-900 dark:text-slate-100 dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="mt-2">
          <DropdownMenuItem onClick={() => setTheme("light")} className="text-base cursor-pointer">
            <Sun className="mr-2 h-4 w-4 text-orange-500" />
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")} className="text-base cursor-pointer">
            <Moon className="mr-2 h-4 w-4 text-slate-900 dark:text-slate-100" />
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")} className="text-base cursor-pointer">
            <span className="mr-2">💻</span>
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
