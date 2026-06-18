
"use client"

import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy, deleteDoc, doc } from "firebase/firestore";
import { useUser, useFirestore } from "@/firebase";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { MessageSquare, Trash2, Search, Filter, Loader2, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function ResponsesPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formsMap, setFormsMap] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!user || !db) return;

    const fetchData = async () => {
      try {
        // 1. Get user's forms
        const formsQ = query(collection(db, "forms"), where("userId", "==", user.uid));
        const formsSnapshot = await getDocs(formsQ);
        const fMap: Record<string, string> = {};
        const formIds: string[] = [];
        
        formsSnapshot.docs.forEach(doc => {
          fMap[doc.id] = doc.data().title;
          formIds.push(doc.id);
        });
        setFormsMap(fMap);

        if (formIds.length > 0) {
          // 2. Fetch responses for these forms
          // Since Firestore limits 'IN' to 30 items, we batch if necessary
          const allResponses: any[] = [];
          
          // Batching form IDs for the IN query
          const batchSize = 10;
          for (let i = 0; i < formIds.length; i += batchSize) {
            const batch = formIds.slice(i, i + batchSize);
            const resQ = query(
              collection(db, "responses"), 
              where("formId", "in", batch),
              orderBy("submittedAt", "desc")
            );
            const resSnapshot = await getDocs(resQ);
            resSnapshot.forEach(doc => allResponses.push({ id: doc.id, ...doc.data() }));
          }
          
          setResponses(allResponses);
        }
      } catch (error) {
        console.error("Error fetching responses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, db]);

  const deleteResponse = async (id: string) => {
    if (!db) return;
    if (!confirm("Are you sure you want to delete this response?")) return;
    try {
      await deleteDoc(doc(db, "responses", id));
      setResponses(responses.filter(r => r.id !== id));
      toast({ title: "Deleted", description: "Response removed successfully." });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete response." });
    }
  };

  const filteredResponses = responses.filter(r => {
    const formTitle = formsMap[r.formId] || "";
    const answersText = JSON.stringify(r.answers).toLowerCase();
    return formTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
           answersText.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Responses</h1>
          <p className="text-muted-foreground">Review and manage all data collected from your public forms.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <FileSpreadsheet className="w-4 h-4" />
          Export All
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search within answers..." 
            className="pl-9 bg-secondary/20 border-none shadow-none ring-1 ring-border" 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-secondary/20">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="w-[220px] font-bold">Source Form</TableHead>
                <TableHead className="font-bold">Response Preview</TableHead>
                <TableHead className="text-right font-bold">Timestamp</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                 <TableRow>
                   <TableCell colSpan={4} className="text-center py-20 text-muted-foreground">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 opacity-20" />
                    Fetching submissions...
                   </TableCell>
                 </TableRow>
              ) : filteredResponses.length > 0 ? (
                filteredResponses.map((res) => (
                  <TableRow key={res.id} className="group transition-colors hover:bg-primary/5">
                    <TableCell className="font-medium text-primary py-4">
                      {formsMap[res.formId] || <span className="text-muted-foreground italic">Unknown Form</span>}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs font-mono max-w-[400px]">
                      <div className="truncate bg-muted/30 p-2 rounded border border-border/50">
                        {Object.entries(res.answers).map(([key, val]) => `${key}: ${val}`).join(" | ")}
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">
                      {new Date(res.submittedAt).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => deleteResponse(res.id)} className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-32">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                        <MessageSquare className="w-8 h-8 text-muted-foreground opacity-20" />
                      </div>
                      <div>
                        <p className="text-lg font-bold font-headline">No entries found</p>
                        <p className="text-sm text-muted-foreground max-w-xs">
                          {searchTerm ? "Try a different search term or check other forms." : "Submissions will appear here once your forms are public."}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
