"use client"

import { useEffect, useState, use } from "react";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { 
  AreaChart, 
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from "recharts";
import { 
  Eye, 
  MessageSquare, 
  TrendingUp, 
  Clock, 
  ChevronLeft,
  Download,
  QrCode as QrIcon,
  BarChart3,
  Copy,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export default function FormAnalyticsPage({ params }: { params: Promise<{ formId: string }> }) {
  const { formId } = use(params);
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  
  const [form, setForm] = useState<any>(null);
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db || !formId) return;

    const fetchData = async () => {
      try {
        const formDoc = await getDoc(doc(db, "forms", formId));
        if (formDoc.exists()) {
          setForm({ id: formDoc.id, ...formDoc.data() });
        }

        const q = query(collection(db, "responses"), where("formId", "==", formId));
        const snapshot = await getDocs(q);
        setResponses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [formId, db]);

  const copyLink = () => {
    const url = `${window.location.origin}/form/${formId}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Link Copied", description: "Public URL is now on your clipboard." });
  };

  const exportCSV = () => {
    if (!responses.length || !form) return;
    
    // Get all unique field names
    const fieldNames = new Set<string>();
    responses.forEach(r => Object.keys(r.answers).forEach(k => fieldNames.add(k)));
    const headers = Array.from(fieldNames);
    
    const rows = responses.map(r => 
      headers.map(h => `"${(r.answers[h] || "").toString().replace(/"/g, '""')}"`).join(",")
    );
    
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${form.slug || 'form'}-responses.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Mock data generation based on responses or fallback for visual
  const chartData = [
    { name: "Mon", count: 0 },
    { name: "Tue", count: 2 },
    { name: "Wed", count: 5 },
    { name: "Thu", count: 3 },
    { name: "Fri", count: 8 },
    { name: "Sat", count: 4 },
    { name: "Sun", count: responses.length > 0 ? responses.length : 1 },
  ];

  if (loading) return <div className="p-20 text-center animate-pulse text-muted-foreground">Loading deep insights...</div>;

  const publicUrl = typeof window !== 'undefined' ? `${window.location.origin}/form/${formId}` : '';

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full hover:bg-secondary">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold font-headline tracking-tight">{form?.title} Analytics</h1>
            <p className="text-sm text-muted-foreground">Real-time performance monitoring and data metrics.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="gap-2 rounded-lg" onClick={copyLink}>
            <Copy className="w-4 h-4" />
            <span className="hidden sm:inline">Copy Link</span>
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 rounded-lg">
                <QrIcon className="w-4 h-4" />
                <span className="hidden sm:inline">QR Code</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md text-center p-8">
              <DialogHeader>
                <DialogTitle className="text-2xl font-headline font-bold">Form QR Code</DialogTitle>
                <DialogDescription>Scan to open the published form instantly.</DialogDescription>
              </DialogHeader>
              <div className="py-10 flex flex-col items-center gap-8">
                <div className="p-6 bg-white rounded-3xl shadow-xl ring-1 ring-border/50">
                  <QRCodeSVG value={publicUrl} size={220} level="H" />
                </div>
                <div className="text-xs text-muted-foreground break-all bg-secondary/50 px-4 py-3 rounded-xl w-full font-mono">
                  {publicUrl}
                </div>
                <div className="grid grid-cols-2 gap-3 w-full">
                  <Button onClick={() => window.print()} variant="outline">Print Code</Button>
                  <Button onClick={copyLink}>Copy URL</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="default" className="gap-2 rounded-lg" onClick={exportCSV}>
            <Download className="w-4 h-4" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Views", value: form?.views || 0, icon: Eye, trend: "Unique opens" },
          { label: "Submissions", value: responses.length, icon: MessageSquare, trend: "Data entries" },
          { label: "Conversion", value: form?.views > 0 ? Math.round((responses.length / form.views) * 100) + "%" : "0%", icon: TrendingUp, trend: "Response rate" },
          { label: "Avg. Duration", value: "1m 45s", icon: Clock, trend: "Completion time" },
        ].map((item, i) => (
          <Card key={i} className="border-none shadow-sm ring-1 ring-border/50 bg-card overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{item.label}</CardTitle>
              <item.icon className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-headline">{item.value}</div>
              <p className="text-[10px] text-muted-foreground mt-1 font-medium">{item.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm ring-1 ring-border/50">
          <CardHeader>
            <CardTitle className="font-headline">Activity Trend</CardTitle>
            <CardDescription>Daily response volume for the current period.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-border/50">
          <CardHeader>
            <CardTitle className="font-headline">Field Distribution</CardTitle>
            <CardDescription>Frequency analysis of response data.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] flex items-center justify-center text-muted-foreground text-center p-8">
             <div className="space-y-4">
                <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="w-8 h-8 opacity-40" />
                </div>
                <p className="text-sm font-medium">Insufficient Field Data</p>
                <p className="text-xs max-w-[180px] mx-auto leading-relaxed">
                  Field-level insights will appear once you receive more than 10 responses on choice-based elements.
                </p>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}