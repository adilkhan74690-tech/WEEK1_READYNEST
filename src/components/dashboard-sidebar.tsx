
"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Files, 
  MessageSquare, 
  BarChart3, 
  User, 
  Settings, 
  LogOut,
  Plus,
  ClipboardList
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: Files, label: "My Forms", href: "/dashboard/forms" },
  { icon: MessageSquare, label: "Submissions", href: "/dashboard/responses" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
];

const bottomItems = [
  { icon: User, label: "Profile", href: "/dashboard/profile" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const auth = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

  return (
    <aside className="w-64 border-r bg-sidebar h-screen flex flex-col sticky top-0 overflow-y-auto hidden md:flex">
      <div className="p-6 border-b flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <ClipboardList className="text-primary-foreground w-5 h-5" />
          </div>
          <span className="font-headline font-bold text-xl tracking-tight text-primary">FormNexus</span>
        </Link>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <Button asChild className="mb-4 justify-start gap-2 h-11 shadow-sm" variant="default">
            <Link href="/dashboard/forms/new">
              <Plus className="w-4 h-4" />
              New Form
            </Link>
          </Button>
          
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3 mb-2">Workspace</p>
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all group",
                  pathname === item.href 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5",
                  pathname === item.href ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                )} />
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-1">
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3 mb-2">Account</div>
          {bottomItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all",
                pathname === item.href 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className={cn(
                  "w-5 h-5",
                  pathname === item.href ? "text-primary" : "text-muted-foreground"
              )} />
              {item.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all text-destructive hover:bg-destructive/10 mt-2"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
