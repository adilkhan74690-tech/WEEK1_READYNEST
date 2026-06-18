
"use client"

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Bell, Shield, Eye, Database, Globe } from "lucide-react";

export default function SettingsPage() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    emailResponses: true,
    weeklyDigest: false,
    securityAlerts: true
  });

  const handleSave = () => {
    toast({ title: "Settings Saved", description: "Your preferences have been updated." });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Configure your account and workspace preferences.</p>
      </div>

      <div className="space-y-6">
        <Card className="border-none shadow-sm ring-1 ring-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              <CardTitle className="font-headline">Notifications</CardTitle>
            </div>
            <CardDescription>Manage how you receive updates about your forms.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Email on new submission</Label>
                <p className="text-sm text-muted-foreground">Receive a real-time email whenever someone fills out your form.</p>
              </div>
              <Switch 
                checked={notifications.emailResponses} 
                onCheckedChange={checked => setNotifications({...notifications, emailResponses: checked})} 
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Weekly performance digest</Label>
                <p className="text-sm text-muted-foreground">Get a summarized report of all your forms' performance every Monday.</p>
              </div>
              <Switch 
                checked={notifications.weeklyDigest} 
                onCheckedChange={checked => setNotifications({...notifications, weeklyDigest: checked})} 
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <CardTitle className="font-headline">Security & Privacy</CardTitle>
            </div>
            <CardDescription>Secure your workspace and manage data access.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
              </div>
              <Button variant="outline" size="sm">Enable</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Public Profile Search</Label>
                <p className="text-sm text-muted-foreground">Allow your professional profile to be indexed by search engines.</p>
              </div>
              <Switch defaultChecked={false} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="ghost">Reset Defaults</Button>
          <Button onClick={handleSave}>Save Preferences</Button>
        </div>
      </div>
    </div>
  );
}
