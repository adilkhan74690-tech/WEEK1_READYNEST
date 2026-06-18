"use client"

import { useEffect, useState, use } from "react";
import { doc, getDoc, addDoc, updateDoc, collection, increment } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CheckCircle2, AlertCircle, ClipboardList } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/**
 * Public Form Page
 * Displays a published form and handles submissions.
 * Access via /form/[formId]
 */
export default function PublicFormPage({ params }: { params: Promise<{ formId: string }> }) {
  const { formId } = use(params);
  const db = useFirestore();
  const { toast } = useToast();
  
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!db || !formId) return;
    
    const fetchForm = async () => {
      try {
        const docRef = doc(db, "forms", formId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.published) {
            setForm({ id: docSnap.id, ...data });
            // Increment views silently in background
            updateDoc(docRef, { views: increment(1) });
          } else {
            console.warn("Form is not published.");
          }
        } else {
          console.error("Form not found in Firestore.");
        }
      } catch (error) {
        console.error("Error loading form:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [formId, db]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !form) return;
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "responses"), {
        formId: form.id,
        answers,
        submittedAt: new Date().toISOString()
      });
      
      await updateDoc(doc(db, "forms", form.id), {
        responsesCount: increment(1),
        updatedAt: new Date().toISOString()
      });
      
      setIsSubmitted(true);
    } catch (error) {
      toast({ 
        variant: "destructive", 
        title: "Submission Failed", 
        description: "We couldn't save your response. Please try again." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateAnswer = (name: string, value: any) => {
    setAnswers(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/30">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-6 text-center">
        <div className="max-w-md">
          <AlertCircle className="w-16 h-16 text-muted-foreground opacity-20 mx-auto mb-4" />
          <h1 className="text-2xl font-headline font-bold mb-2">Form not available</h1>
          <p className="text-muted-foreground mb-8">This form might be private, deleted, or the link is incorrect.</p>
          <Button asChild variant="outline">
            <a href="/">Go to FormNexus</a>
          </Button>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-6">
        <Card className="max-w-md w-full border-none shadow-2xl p-8 text-center animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-headline font-bold mb-3">Response Sent!</h2>
          <p className="text-muted-foreground mb-10">Your feedback has been successfully recorded. Thank you for your time.</p>
          <div className="space-y-3">
            <Button onClick={() => { setIsSubmitted(false); setAnswers({}); }} className="w-full h-11">
              Submit Another Response
            </Button>
            <p className="text-[10px] text-muted-foreground pt-4">Powered by FormNexus</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30 py-16 px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-2 opacity-30 grayscale transition-all hover:opacity-100 hover:grayscale-0 cursor-default">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <ClipboardList className="text-primary-foreground w-4 h-4" />
            </div>
            <span className="font-headline font-bold text-lg tracking-tight text-primary">FormNexus</span>
          </div>
        </div>

        <Card className="border-none shadow-2xl overflow-hidden">
          <div className="h-2 bg-primary w-full" />
          <CardHeader className="space-y-2 pb-8">
            <CardTitle className="text-3xl font-headline font-bold">{form.title}</CardTitle>
            <CardDescription className="text-base leading-relaxed">{form.description}</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-10">
              {form.fields.map((field: any) => (
                <div key={field.id} className="space-y-4">
                  <Label className="text-sm font-bold flex items-center gap-1.5 text-foreground/90">
                    {field.label}
                    {field.required && <span className="text-destructive font-bold">*</span>}
                  </Label>
                  
                  <div className="transition-all">
                    {field.type === 'text' && (
                      <Input 
                        placeholder={field.placeholder} 
                        required={field.required}
                        onChange={e => updateAnswer(field.name, e.target.value)}
                        className="h-12 bg-secondary/20 focus:bg-background border-none ring-1 ring-border focus:ring-2 focus:ring-primary"
                      />
                    )}

                    {field.type === 'email' && (
                      <Input 
                        type="email"
                        placeholder={field.placeholder} 
                        required={field.required}
                        onChange={e => updateAnswer(field.name, e.target.value)}
                        className="h-12 bg-secondary/20 focus:bg-background border-none ring-1 ring-border focus:ring-2 focus:ring-primary"
                      />
                    )}

                    {field.type === 'number' && (
                      <Input 
                        type="number"
                        placeholder={field.placeholder} 
                        required={field.required}
                        onChange={e => updateAnswer(field.name, e.target.value)}
                        className="h-12 bg-secondary/20 focus:bg-background border-none ring-1 ring-border focus:ring-2 focus:ring-primary"
                      />
                    )}

                    {field.type === 'textarea' && (
                      <Textarea 
                        placeholder={field.placeholder} 
                        required={field.required}
                        onChange={e => updateAnswer(field.name, e.target.value)}
                        className="bg-secondary/20 focus:bg-background border-none ring-1 ring-border focus:ring-2 focus:ring-primary min-h-[120px]"
                      />
                    )}

                    {field.type === 'select' && (
                      <Select onValueChange={v => updateAnswer(field.name, v)} required={field.required}>
                        <SelectTrigger className="h-12 bg-secondary/20 border-none ring-1 ring-border">
                          <SelectValue placeholder={field.placeholder || "Choose an option"} />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options?.map((opt: string) => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {field.type === 'radio' && (
                      <RadioGroup onValueChange={v => updateAnswer(field.name, v)} required={field.required} className="grid gap-3 pt-1">
                        {field.options?.map((opt: string) => (
                          <div key={opt} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary/20 transition-colors cursor-pointer">
                            <RadioGroupItem value={opt} id={`${field.id}-${opt}`} />
                            <Label htmlFor={`${field.id}-${opt}`} className="font-normal flex-1 cursor-pointer">{opt}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}

                    {field.type === 'checkbox' && (
                      <div className="flex items-center space-x-3 p-4 rounded-lg bg-secondary/10 border border-border/50">
                        <Checkbox 
                          id={field.id} 
                          onCheckedChange={v => updateAnswer(field.name, !!v)}
                        />
                        <Label htmlFor={field.id} className="font-medium text-sm leading-tight cursor-pointer">
                          {field.placeholder || "I agree to the terms and conditions"}
                        </Label>
                      </div>
                    )}

                    {field.type === 'date' && (
                      <Input 
                        type="date"
                        required={field.required}
                        onChange={e => updateAnswer(field.name, e.target.value)}
                        className="h-12 bg-secondary/20 border-none ring-1 ring-border"
                      />
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter className="pt-8 pb-10 px-8 border-t flex flex-col sm:flex-row items-center justify-between gap-6">
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                Professional Data Collection by FormNexus
              </span>
              <Button type="submit" size="lg" disabled={isSubmitting} className="h-12 px-10 font-bold shadow-lg shadow-primary/20 transition-transform active:scale-95">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Submit Response"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
