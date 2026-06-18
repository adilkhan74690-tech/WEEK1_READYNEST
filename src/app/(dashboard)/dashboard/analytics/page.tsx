
"use client"

import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useUser, useFirestore } from "@/firebase";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, ChevronRight, Loader2, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function AnalyticsSelectionPage() {
  const { user } = useUser();
  const db = useFirestore();
  const [forms, setForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !db) return;
    const fetchForms = async () => {
      try {
        const q = query(collection(db, "forms"), where("userId", "==", user.uid));
        const snap = await getDocs(q);
        setForms(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } finally {
        setLoading(false);
      }
    };
    fetchForms();
  }, [user, db]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Form Analytics</h1>
        <p className="text-muted-foreground">Select a form to view detailed performance metrics.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : forms.length > 0 ? (
        <div className="grid gap-4">
          {forms.map(form => (
            <Card key={form.id} className="group hover:ring-1 hover:ring-primary/50 transition-all cursor-pointer border-none shadow-sm ring-1 ring-border/50">
              <Link href={`/dashboard/analytics/${form.id}`}>
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{form.title}</h3>
                      <p className="text-sm text-muted-foreground">{form.responsesCount || 0} total submissions • {form.views || 0} views</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 border-2 border-dashed rounded-3xl bg-secondary/5">
           <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-20" />
           <p className="text-muted-foreground">You haven't created any forms yet.</p>
           <Button asChild className="mt-4" variant="outline">
              <Link href="/dashboard/forms/new">Create a form</Link>
           </Button>
        </div>
      )}
    </div>
  );
}
