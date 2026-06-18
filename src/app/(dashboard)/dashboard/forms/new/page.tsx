"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { collection, addDoc } from "firebase/firestore";
import { useUser, useFirestore } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Settings2, 
  ChevronLeft,
  Loader2,
  Save
} from "lucide-react";
import { FormField, FieldType } from "@/types/form";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

const fieldTypes: { type: FieldType; label: string }[] = [
  { type: "text", label: "Text Input" },
  { type: "email", label: "Email" },
  { type: "number", label: "Number" },
  { type: "textarea", label: "Text Area" },
  { type: "select", label: "Dropdown" },
  { type: "radio", label: "Radio Group" },
  { type: "checkbox", label: "Checkbox" },
  { type: "date", label: "Date Picker" },
];

export default function NewFormPage() {
  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  const [title, setTitle] = useState("Untitled Form");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState<FormField[]>([]);

  const addField = (type: FieldType) => {
    const newField: FormField = {
      id: uuidv4(),
      type,
      label: `New ${type} field`,
      name: `field_${fields.length + 1}`,
      required: false,
      placeholder: "",
      options: (type === 'select' || type === 'radio') ? ['Option 1', 'Option 2'] : undefined
    };
    setFields([...fields, newField]);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const saveForm = () => {
    if (!user) {
      console.error("Save failed: No authenticated user found.");
      toast({ variant: "destructive", title: "Authentication Required", description: "You must be logged in to save forms." });
      return;
    }
    if (!db) {
      console.error("Save failed: Firestore instance not initialized.");
      return;
    }

    setIsSaving(true);
    const slug = title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]/g, "") + "-" + Math.random().toString(36).substring(2, 6);
    
    const formData = {
      userId: user.uid,
      title: title || "Untitled Form",
      description: description || "",
      slug,
      fields,
      published: false,
      views: 0,
      responsesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log("Initiating form creation in Firestore...");
    console.log("Collection: forms");
    console.log("Payload:", formData);

    const formsCollection = collection(db, "forms");

    addDoc(formsCollection, formData)
      .then((docRef) => {
        console.log("Form saved successfully! ID:", docRef.id);
        toast({ title: "Success", description: "Form draft saved." });
        router.push("/dashboard/forms");
      })
      .catch(async (error) => {
        console.error("Firestore addDoc failure:", error);
        
        const permissionError = new FirestorePermissionError({
          path: formsCollection.path,
          operation: 'create',
          requestResourceData: formData,
        });

        errorEmitter.emit('permission-error', permissionError);
        setIsSaving(false);
      });
  };

  return (
    <div className="pb-24">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold font-headline">New Form</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>Cancel</Button>
          <Button onClick={saveForm} disabled={isSaving} className="gap-2">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Draft
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <Card className="border-none shadow-sm ring-1 ring-border/50">
            <CardContent className="pt-6 space-y-4">
              <Input 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                className="text-2xl font-headline font-bold border-none px-0 focus-visible:ring-0 placeholder:opacity-50 h-auto"
                placeholder="Form Title"
              />
              <Textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                className="border-none px-0 focus-visible:ring-0 resize-none min-h-[40px] text-muted-foreground"
                placeholder="Form Description (optional)"
              />
            </CardContent>
          </Card>

          <div className="space-y-4">
            {fields.map((field) => (
              <Card key={field.id} className="group relative border-none shadow-sm ring-1 ring-border/50 hover:ring-primary/40 transition-all">
                <div className="absolute left-[-20px] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-40 cursor-grab">
                  <GripVertical className="w-4 h-4" />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1 space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase font-bold text-muted-foreground">Field Label</Label>
                          <Input 
                            value={field.label} 
                            onChange={e => updateField(field.id, { label: e.target.value })}
                            className="bg-secondary/20"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase font-bold text-muted-foreground">Placeholder</Label>
                          <Input 
                            value={field.placeholder} 
                            onChange={e => updateField(field.id, { placeholder: e.target.value })}
                            className="bg-secondary/20"
                          />
                        </div>
                      </div>
                      
                      { (field.type === 'select' || field.type === 'radio') && (
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-bold text-muted-foreground">Options (Comma separated)</Label>
                          <Input 
                            value={field.options?.join(", ")} 
                            onChange={e => updateField(field.id, { options: e.target.value.split(",").map(s => s.trim()) })}
                            className="bg-secondary/20"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-medium">Required</span>
                        <Switch 
                          checked={field.required} 
                          onCheckedChange={checked => updateField(field.id, { required: checked })} 
                        />
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeField(field.id)} className="text-destructive hover:bg-destructive/10">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground bg-muted/50 px-2 py-1 rounded w-fit">
                    <span className="font-bold uppercase">{field.type}</span>
                    <span className="opacity-40">|</span>
                    <span>name: {field.name}</span>
                  </div>
                </CardContent>
              </Card>
            ))}

            {fields.length === 0 && (
              <div className="border-2 border-dashed rounded-2xl py-24 flex flex-col items-center justify-center text-center text-muted-foreground bg-secondary/10">
                <Plus className="w-8 h-8 mb-4 opacity-30" />
                <p>Start by adding fields from the panel on the right</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm ring-1 ring-border/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-primary" />
                <CardTitle className="text-sm font-headline">Add Elements</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-2">
              {fieldTypes.map(f => (
                <Button 
                  key={f.type} 
                  variant="outline" 
                  className="justify-start gap-3 h-11 hover:border-primary/50 hover:bg-primary/5"
                  onClick={() => addField(f.type)}
                >
                  <div className="w-6 h-6 rounded bg-secondary flex items-center justify-center text-[10px] font-bold">
                    {f.type.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-medium">{f.label}</span>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
