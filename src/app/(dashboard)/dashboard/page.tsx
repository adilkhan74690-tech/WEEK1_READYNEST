"use client"

import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useUser, useFirestore } from "@/firebase";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { 
  ClipboardList, 
  MessageSquare, 
  CheckCircle2, 
  TrendingUp,
  ArrowUpRight,
  Plus,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DashboardOverview() {
  const { user } = useUser();
  const db = useFirestore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalForms: 0,
    totalResponses: 0,
    activeForms: 0,
    avgConversion: 0
  });
  const [recentForms, setRecentForms] = useState<any[]>([]);

  useEffect(() => {
    if (!user || !db) return;

    const fetchData = async () => {
      try {
        const formsQuery = query(collection(db, "forms"), where("userId", "==", user.uid));
        const formsSnapshot = await getDocs(formsQuery);
        const formsData = formsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        const active = formsData.filter((f: any) => f.published).length;
        let totalRes = 0;
        let totalViews = 0;

        formsData.forEach((f: any) => {
          totalRes += f.responsesCount || 0;
          totalViews += f.views || 0;
        });

        setStats({
          totalForms: formsData.length,
          totalResponses: totalRes,
          activeForms: active,
          avgConversion: totalViews > 0 ? Math.round((totalRes / totalViews) * 100) : 0
        });

        const recentFormsData = [...formsData]
          .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          .slice(0, 5);
        
        setRecentForms(recentFormsData);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, db]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Overview</h1>
          <p className="text-muted-foreground">Welcome back, {user?.displayName || 'Builder'}. Here's how your forms are performing.</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/dashboard/forms/new">
            <Plus className="w-4 h-4" />
            New Form
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Forms", value: stats.totalForms, icon: ClipboardList, trend: "Created" },
          { label: "Total Responses", value: stats.totalResponses, icon: MessageSquare, trend: "Submissions" },
          { label: "Active Forms", value: stats.activeForms, icon: CheckCircle2, trend: "Published" },
          { label: "Conversion Rate", value: `${stats.avgConversion}%`, icon: TrendingUp, trend: "Average" },
        ].map((item, i) => (
          <Card key={i} className="border-none shadow-sm ring-1 ring-border/50 bg-card hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{item.label}</CardTitle>
              <item.icon className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-headline">{item.value}</div>
              <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1 uppercase tracking-tighter">
                {item.trend} Metrics
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm ring-1 ring-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-headline">Recent Workspace Activity</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/forms">View all</Link>
              </Button>
            </div>
            <CardDescription>Manage your most recently updated form definitions.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentForms.length > 0 ? (
              <div className="space-y-4">
                {recentForms.map((form) => (
                  <div key={form.id} className="flex items-center justify-between p-4 rounded-xl border bg-secondary/10 group hover:border-primary/50 transition-colors">
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm group-hover:text-primary transition-colors">{form.title}</span>
                      <span className="text-xs text-muted-foreground">Updated {new Date(form.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right flex flex-col items-end">
                        <span className="text-xs font-bold text-primary">{form.responsesCount || 0} responses</span>
                        <span className={cn(
                          "text-[9px] uppercase font-bold px-1.5 py-0.5 rounded",
                          form.published ? "bg-teal-100 text-teal-700" : "bg-muted text-muted-foreground"
                        )}>
                          {form.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <Button variant="outline" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" asChild>
                        <Link href={`/dashboard/forms/edit/${form.id}`}>
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground border-2 border-dashed rounded-2xl">
                <ClipboardList className="w-12 h-12 mb-4 opacity-20" />
                <p>No activity yet. Create your first form to start collecting data.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-border/50">
          <CardHeader>
            <CardTitle className="font-headline">Live Updates</CardTitle>
            <CardDescription>Recent system events.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { type: 'system', msg: 'FormNexus v1.0 Live', time: 'Yesterday' },
                { type: 'system', msg: 'Security Audit Passed', time: '2 days ago' },
                { type: 'system', msg: 'CSV Export Engine Ready', time: '5 days ago' },
              ].map((activity, i) => (
                <div key={i} className="flex gap-4 relative">
                  {i < 2 && <div className="absolute left-[11px] top-6 bottom-[-16px] w-[2px] bg-border" />}
                  <div className="w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-background z-10 bg-muted text-muted-foreground">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-medium">{activity.msg}</p>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
