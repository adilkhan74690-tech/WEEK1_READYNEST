"use client"

import { use } from "react"
import Link from "next/link"
import { 
  MessageSquare, 
  CalendarCheck, 
  ListTodo, 
  Mail, 
  Briefcase, 
  Users,
  CheckCircle2,
  ChevronLeft,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const solutionsMap: Record<string, any> = {
  "customer-feedback": {
    title: "Customer Feedback Forms",
    icon: MessageSquare,
    tagline: "Listen to your users, improve your product.",
    benefits: [
      "Customizable sentiment analysis fields",
      "Automated follow-up emails",
      "NPS and CSAT tracking built-in",
      "Real-time feedback dashboards"
    ]
  },
  "event-registration": {
    title: "Event Registration Forms",
    icon: CalendarCheck,
    tagline: "Professional event management made simple.",
    benefits: [
      "Seamless attendee data collection",
      "QR code check-ins ready-to-use",
      "Limited seating and waitlist logic",
      "Multi-session registration support"
    ]
  },
  "surveys": {
    title: "Survey Forms",
    icon: ListTodo,
    tagline: "Gather data at scale with powerful logic.",
    benefits: [
      "Conditional branching and logic",
      "Rich media field support",
      "Anonymous submission modes",
      "Export directly to CSV/JSON"
    ]
  },
  "contact": {
    title: "Contact Forms",
    icon: Mail,
    tagline: "Convert visitors into professional leads.",
    benefits: [
      "Spam protection and validation",
      "Direct integration with workspace",
      "Custom branding for every touchpoint",
      "Real-time email notifications"
    ]
  },
  "job-applications": {
    title: "Job Application Forms",
    icon: Briefcase,
    tagline: "Streamline your recruitment pipeline.",
    benefits: [
      "File upload for resumes and portfolios",
      "Custom qualification screening questions",
      "Candidate status tracking",
      "Collaborative review dashboard"
    ]
  },
  "lead-generation": {
    title: "Lead Generation Forms",
    icon: Users,
    tagline: "Turn visitors into customers.",
    benefits: [
      "High-conversion multi-step forms",
      "Integration with CRM systems",
      "Dynamic field suggestions",
      "Automated lead scoring"
    ],
    comingSoon: true
  }
}

export default function SolutionPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = use(params)
  const solution = solutionsMap[type]

  if (!solution) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-8">
        <div>
          <h1 className="text-2xl font-bold mb-4">Solution not found</h1>
          <Button asChild>
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="px-6 py-4 flex items-center justify-between border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to FormNexus</span>
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-24">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8">
            <solution.icon className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight mb-4">
            {solution.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            {solution.tagline}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold font-headline">Key Benefits</h2>
            <ul className="space-y-4">
              {solution.benefits.map((benefit: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
            <div className="pt-8">
              <Button size="lg" className="h-12 px-8 gap-2 group" asChild>
                <Link href="/register">
                  Get Started for Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>

          <Card className="border-none shadow-2xl ring-1 ring-border/50 bg-secondary/10">
            <CardContent className="p-8 aspect-square flex items-center justify-center">
              <div className="text-center space-y-4 opacity-40">
                <solution.icon className="w-24 h-24 mx-auto" />
                <p className="font-mono text-sm uppercase tracking-widest">Preview Coming Soon</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t py-12 px-6 text-center text-sm text-muted-foreground">
        © 2024 FormNexus Solution Framework. All rights reserved.
      </footer>
    </div>
  )
}