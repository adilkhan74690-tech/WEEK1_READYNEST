"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ClipboardList, Shield, BarChart3, Layout } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SolutionsDropdown } from "@/components/solutions-dropdown";

export default function LandingPage() {
  const { toast } = useToast();

  const handlePricingClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toast({
      title: "Coming Soon",
      description: "Pricing plans are coming soon. Stay tuned!",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 py-4 flex items-center justify-between border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <ClipboardList className="text-primary-foreground w-5 h-5" />
          </div>
          <span className="font-headline font-bold text-xl tracking-tight text-primary">FormNexus</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
          <SolutionsDropdown />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={handlePricingClick}
                  className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer group"
                >
                  Pricing
                  <Badge 
                    variant="secondary" 
                    className="bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 border-none font-bold text-[10px] uppercase tracking-wider px-2 py-0.5"
                  >
                    Coming Soon
                  </Badge>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Pricing plans will be available soon.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="px-6 py-24 md:py-32 flex flex-col items-center text-center max-w-4xl mx-auto">
          <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
            Build better forms <br />
            <span className="text-primary">with ease and precision.</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl mb-10 max-w-2xl leading-relaxed">
            FormNexus is the professional dynamic form builder. Create, publish, and analyze custom forms 
            with a intuitive drag-and-drop interface and powerful real-time analytics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button size="lg" className="h-12 px-8 text-base gap-2 group" asChild>
              <Link href="/register">
                Start Building Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </section>
            
        <section id="features" className="bg-secondary/30 py-24 px-6 border-y">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-headline text-3xl font-bold mb-4">Everything you need to collect data</h2>
              <p className="text-muted-foreground">Professional features for modern teams</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Layout,
                  title: "Drag & Drop Builder",
                  desc: "Easily design your forms with a intuitive field selector and real-time preview."
                },
                {
                  icon: BarChart3,
                  title: "Real-time Analytics",
                  desc: "Track submissions, conversion rates and user behavior with visual dashboards."
                },
                {
                  icon: Shield,
                  title: "Secure & Reliable",
                  desc: "Your data is stored securely in Firestore with enterprise-grade protection."
                }
              ].map((feature, i) => (
                <div key={i} className="bg-card border p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center mb-6">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-headline text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <ClipboardList className="text-primary-foreground w-4 h-4" />
            </div>
            <span className="font-headline font-bold text-lg tracking-tight text-primary">FormNexus</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2024 FormNexus. All rights reserved. Built for professional data collection.
          </div>
          <div className="flex gap-6 text-sm font-medium">
            <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}