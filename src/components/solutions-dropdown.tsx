"use client"

import * as React from "react"
import Link from "next/link"
import { 
  MessageSquare, 
  CalendarCheck, 
  ListTodo, 
  Mail, 
  Briefcase, 
  Users,
  ChevronDown
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

const solutions = [
  {
    title: "Customer Feedback Forms",
    description: "Gather deep insights from your users.",
    icon: MessageSquare,
    href: "/solutions/customer-feedback",
  },
  {
    title: "Event Registration Forms",
    description: "Manage attendees and tickets seamlessly.",
    icon: CalendarCheck,
    href: "/solutions/event-registration",
  },
  {
    title: "Survey Forms",
    description: "Collect data at scale with powerful logic.",
    icon: ListTodo,
    href: "/solutions/surveys",
  },
  {
    title: "Contact Forms",
    description: "Professional touchpoints for leads.",
    icon: Mail,
    href: "/solutions/contact",
  },
  {
    title: "Job Application Forms",
    description: "Streamline your hiring process.",
    icon: Briefcase,
    href: "/solutions/job-applications",
  },
  {
    title: "Lead Generation Forms",
    description: "Convert visitors into loyal customers.",
    icon: Users,
    href: "/solutions/lead-generation",
    comingSoon: true,
  },
]

export function SolutionsDropdown() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-1.5 hover:text-primary transition-colors py-2 outline-none text-sm font-medium group">
            Solutions
            <ChevronDown className={cn(
              "w-4 h-4 transition-transform duration-200",
              isOpen && "rotate-180"
            )} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="start" 
          className="w-[320px] md:w-[600px] p-4 grid md:grid-cols-2 gap-2 border-none shadow-2xl ring-1 ring-border/50 bg-background/95 backdrop-blur-md"
        >
          {solutions.map((solution) => (
            <DropdownMenuItem key={solution.href} asChild className="p-0 focus:bg-transparent">
              <Link
                href={solution.href}
                className={cn(
                  "flex items-start gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-all group/item",
                  solution.comingSoon && "opacity-60 cursor-not-allowed"
                )}
                onClick={(e) => solution.comingSoon && e.preventDefault()}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-primary-foreground transition-colors shrink-0">
                  <solution.icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm leading-none">{solution.title}</span>
                    {solution.comingSoon && (
                      <Badge variant="secondary" className="text-[9px] px-1.5 py-0 uppercase tracking-wider font-bold h-4">
                        Soon
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {solution.description}
                  </p>
                </div>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}