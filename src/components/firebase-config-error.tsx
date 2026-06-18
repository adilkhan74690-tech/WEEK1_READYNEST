
"use client"

import { AlertCircle, Terminal, ExternalLink } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function FirebaseConfigError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-6 py-12">
      <Card className="max-w-2xl w-full border-none shadow-2xl overflow-hidden">
        <div className="h-2 bg-destructive w-full" />
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 text-destructive mb-2">
            <AlertCircle className="w-6 h-6" />
            <CardTitle className="text-2xl font-bold font-headline">Firebase Configuration Required</CardTitle>
          </div>
          <CardDescription className="text-base">
            The application is missing valid Firebase credentials. Please follow these steps to connect your project.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-none w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">1</div>
              <div className="space-y-1">
                <p className="font-semibold">Get Credentials</p>
                <p className="text-sm text-muted-foreground">Go to your <a href="https://console.firebase.google.com/" target="_blank" className="text-primary hover:underline inline-flex items-center gap-1">Firebase Console <ExternalLink className="w-3 h-3" /></a>, select your project, and copy the Web App configuration.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-none w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">2</div>
              <div className="space-y-1">
                <p className="font-semibold">Update Environment Variables</p>
                <p className="text-sm text-muted-foreground">Add the following keys to your <code>.env</code> file:</p>
                <div className="bg-slate-950 text-slate-50 p-4 rounded-lg mt-2 font-mono text-xs overflow-x-auto">
                  <pre>{`VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id`}</pre>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-none w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">3</div>
              <div className="space-y-1">
                <p className="font-semibold">Enable Services</p>
                <p className="text-sm text-muted-foreground">Ensure <b>Authentication</b> (Email/Password) and <b>Cloud Firestore</b> are enabled in the console.</p>
              </div>
            </div>
          </div>

          <Alert variant="destructive" className="bg-destructive/5 border-destructive/20">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Developer Notice</AlertTitle>
            <AlertDescription>
              After updating the environment variables, you must restart the development server for changes to take effect.
            </AlertDescription>
          </Alert>
          
          <Button onClick={() => window.location.reload()} className="w-full">
            Retry Connection
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
