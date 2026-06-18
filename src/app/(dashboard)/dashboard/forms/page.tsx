"use client"

import { useEffect, useState, useCallback } from "react";
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useUser, useFirestore } from "@/firebase";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  MoreVertical, 
  Eye, 
  Edit3, 
  Trash2, 
  ExternalLink,
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Copy,
  Share2,
  ClipboardList
} from "lucide-react";
import Link from "next/link";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

export default function MyFormsPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [forms, setForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchForms = useCallback(async () => {
    if (!user || !db) return;
    setLoading(true);
    try {
      const q = query(collection(db, "forms"), where("userId", "==", user.uid));
      const snapshot = await getDocs(q);
      const fetchedForms = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setForms(fetchedForms);
    } catch (error: any) {
      console.error("Error fetching forms:", error);
      toast({ variant: "destructive", title: "Fetch Error", description: error.message });
    } finally {
      setLoading(false);
    }
  }, [user, db, toast]);

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  const togglePublish = (form: any) => {
    if (!db) return;
    const formRef = doc(db, "forms", form.id);
    const newStatus = !form.published;

    updateDoc(formRef, {
      published: newStatus,
      updatedAt: new Date().toISOString()
    })
    .then(() => {
      toast({ title: newStatus ? "Published" : "Drafted", description: `Your form is now ${newStatus ? 'live' : 'private'}.` });
      fetchForms();
    })
    .catch(async (error) => {
      const permissionError = new FirestorePermissionError({
        path: formRef.path,
        operation: 'update',
        requestResourceData: { published: newStatus }
      });
      errorEmitter.emit('permission-error', permissionError);
    });
  };

  const copyFormLink = (formId: string) => {
    const url = `${window.location.origin}/form/${formId}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Link Copied", description: "Shareable URL copied to clipboard." });
  };

  const shareForm = async (form: any) => {
    const url = `${window.location.origin}/form/${form.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: form.title,
          text: form.description,
          url: url,
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      copyFormLink(form.id);
    }
  };

  const deleteForm = (id: string) => {
    if (!db) return;
    if (!confirm("Are you sure you want to delete this form? This cannot be undone.")) return;
    
    const formRef = doc(db, "forms", id);

    deleteDoc(formRef)
      .then(() => {
        toast({ title: "Deleted", description: "Form removed successfully." });
        setForms(prev => prev.filter(f => f.id !== id));
      })
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: formRef.path,
          operation: 'delete'
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const filteredForms = forms.filter(f => f.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">My Forms</h1>
          <p className="text-muted-foreground">Manage and track all your created forms.</p>
        </div>
        <Button asChild className="gap-2 shadow-lg shadow-primary/20">
          <Link href="/dashboard/forms/new">
            <Plus className="w-4 h-4" />
            Create Form
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search forms..." 
            className="pl-9 bg-secondary/20" 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse h-[260px] border-none ring-1 ring-border/50 shadow-sm" />
          ))}
        </div>
      ) : filteredForms.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredForms.map((form) => (
            <Card key={form.id} className="group border-none shadow-sm ring-1 ring-border/50 hover:ring-primary/40 transition-all flex flex-col overflow-hidden">
              <div className={`h-1.5 w-full ${form.published ? 'bg-primary' : 'bg-muted'}`} />
              <CardHeader className="pb-3 pt-5">
                <div className="flex justify-between items-start">
                  <Badge variant={form.published ? "default" : "secondary"} className="mb-2 uppercase text-[9px] tracking-widest font-bold">
                    {form.published ? 'Published' : 'Draft'}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 hover:bg-secondary/50">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 p-2 border-none shadow-xl ring-1 ring-border/50">
                      <DropdownMenuItem className="rounded-lg h-10 gap-3" asChild>
                        <Link href={`/dashboard/forms/edit/${form.id}`}>
                          <Edit3 className="w-4 h-4 text-muted-foreground" /> Edit Definition
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-lg h-10 gap-3" onClick={() => copyFormLink(form.id)}>
                        <Copy className="w-4 h-4 text-muted-foreground" /> Copy Link
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-lg h-10 gap-3" onClick={() => shareForm(form)}>
                        <Share2 className="w-4 h-4 text-muted-foreground" /> Share Form
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-lg h-10 gap-3" onClick={() => togglePublish(form)}>
                        {form.published ? <XCircle className="w-4 h-4 text-orange-500" /> : <CheckCircle2 className="w-4 h-4 text-green-500" />}
                        {form.published ? 'Unpublish' : 'Publish Now'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="my-2" />
                      <DropdownMenuItem className="rounded-lg h-10 gap-3 text-destructive hover:bg-destructive/10" onClick={() => deleteForm(form.id)}>
                        <Trash2 className="w-4 h-4" /> Delete Permanently
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle className="font-headline text-xl group-hover:text-primary transition-colors truncate">
                  {form.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 min-h-[40px] text-xs pt-1">
                  {form.description || "No description provided."}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 flex-1 flex flex-col justify-end pb-5">
                <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-tighter text-muted-foreground/70 mb-5">
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-3 h-3" /> {form.views || 0} Views
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="w-3 h-3" /> {form.responsesCount || 0} Submissions
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 h-9 gap-2" asChild disabled={!form.published}>
                    <Link href={`/form/${form.id}`} target="_blank">
                      <ExternalLink className="w-3.5 h-3.5" />
                      Live Form
                    </Link>
                  </Button>
                  <Button variant="secondary" size="sm" className="flex-1 h-9" asChild>
                    <Link href={`/dashboard/analytics/${form.id}`}>
                      Analytics
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed rounded-3xl bg-secondary/5 text-center px-6">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
            <ClipboardList className="w-10 h-10 text-muted-foreground opacity-30" />
          </div>
          <h2 className="text-2xl font-headline font-bold mb-3">Your workspace is empty</h2>
          <p className="text-muted-foreground max-w-sm mb-10 leading-relaxed">
            {searchTerm ? `We couldn't find any forms matching "${searchTerm}".` : "Start building your first dynamic form to begin collecting real-time responses and insights."}
          </p>
          <Button asChild className="gap-2 h-12 px-8">
            <Link href="/dashboard/forms/new">
              <Plus className="w-4 h-4" />
              Build First Form
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
