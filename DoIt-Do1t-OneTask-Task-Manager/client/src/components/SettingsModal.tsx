
import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface SettingsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SettingsModal({
  isOpen,
  onOpenChange,
}: SettingsModalProps) {
  const [userName, setUserName] = useState("");
  const [claudeApiKey, setClaudeApiKey] = useState("");
  const [chatgptApiKey, setChatgptApiKey] = useState("");

  useEffect(() => {
    // Load settings from localStorage
    const savedName = localStorage.getItem("userName") || "Tom";
    const savedClaudeKey = localStorage.getItem("claudeApiKey") || "";
    const savedChatgptKey = localStorage.getItem("chatgptApiKey") || "";
    
    setUserName(savedName);
    setClaudeApiKey(savedClaudeKey);
    setChatgptApiKey(savedChatgptKey);
  }, [isOpen]);

  const handleSave = () => {
    localStorage.setItem("userName", userName);
    localStorage.setItem("claudeApiKey", claudeApiKey);
    localStorage.setItem("chatgptApiKey", chatgptApiKey);
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[90%] sm:w-[400px] bg-background border-border">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold text-foreground">Settings</SheetTitle>
        </SheetHeader>
        
        <Separator className="my-6 bg-border" />
        
        <div className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="userName" className="text-base font-semibold text-foreground">Your Name</Label>
            <Input
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              className="h-12 text-base bg-card text-card-foreground border-border"
            />
          </div>
          
          <Separator className="bg-border" />
          
          <div className="space-y-2">
            <h3 className="font-semibold text-base text-foreground">AI Model</h3>
            <p className="text-sm text-muted-foreground">
              Using Gemini 2.0 Flash for fast, efficient task generation
            </p>
          </div>
          
          <Separator className="bg-border" />
          
          <div className="space-y-4">
            <h3 className="font-semibold text-base text-foreground">API Keys</h3>
            
            <div className="space-y-3">
              <Label htmlFor="claudeApiKey" className="text-base font-semibold text-foreground">Claude API Key</Label>
              <Input
                id="claudeApiKey"
                type="password"
                value={claudeApiKey}
                onChange={(e) => setClaudeApiKey(e.target.value)}
                placeholder="sk-ant-..."
                className="h-12 text-base bg-card text-card-foreground border-border"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="chatgptApiKey" className="text-base font-semibold text-foreground">ChatGPT API Key</Label>
              <Input
                id="chatgptApiKey"
                type="password"
                value={chatgptApiKey}
                onChange={(e) => setChatgptApiKey(e.target.value)}
                placeholder="sk-..."
                className="h-12 text-base bg-card text-card-foreground border-border"
              />
            </div>
          </div>
          
          <Button onClick={handleSave} className="w-full h-12 text-base bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
            Save Settings
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
