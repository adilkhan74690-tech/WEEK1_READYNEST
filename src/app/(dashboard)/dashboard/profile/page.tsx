
"use client"

import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { useUser, useFirestore, useAuth } from "@/firebase";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, Mail, Calendar, Save } from "lucide-react";

export default function ProfilePage() {
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    createdAt: ""
  });

  useEffect(() => {
    if (!user || !db) return;

    const fetchProfile = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setFormData({
            name: data.name || "",
            email: data.email || "",
            createdAt: data.createdAt || ""
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, db]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db || !auth.currentUser) return;

    setSaving(true);
    try {
      // Update Auth Profile
      await updateProfile(auth.currentUser, { displayName: formData.name });
      
      // Update Firestore
      await updateDoc(doc(db, "users", user.uid), {
        name: formData.name,
        updatedAt: new Date().toISOString()
      });

      toast({ title: "Success", description: "Profile updated successfully." });
    } catch (error: any) {
      toast({ 
        variant: "destructive", 
        title: "Update Failed", 
        description: error.message || "Failed to update profile." 
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Account Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and how others see you.</p>
      </div>

      <Card className="border-none shadow-sm ring-1 ring-border/50">
        <form onSubmit={handleUpdateProfile}>
          <CardHeader>
            <CardTitle className="font-headline">Personal Details</CardTitle>
            <CardDescription>Update your name and account information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-6 items-center pb-6 border-b">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary border-4 border-background shadow-sm">
                <User className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg">{formData.name}</h3>
                <p className="text-sm text-muted-foreground">Standard Member</p>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="name" 
                    value={formData.name} 
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-50" />
                  <Input 
                    id="email" 
                    value={formData.email} 
                    disabled 
                    className="pl-10 bg-muted/50 cursor-not-allowed"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground">Email changes are disabled for this preview.</p>
              </div>

              <div className="space-y-2">
                <Label>Member Since</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-50" />
                  <Input 
                    value={formData.createdAt ? new Date(formData.createdAt).toLocaleDateString() : "N/A"} 
                    disabled 
                    className="pl-10 bg-muted/50 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-secondary/10 flex justify-end">
            <Button type="submit" disabled={saving} className="gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
