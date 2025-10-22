import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProfileSchema, type InsertProfile, type Profile } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
  onProfileCreated: (profile: Profile) => void;
}

export function ProfileModal({ open, onClose, onProfileCreated }: ProfileModalProps) {
  const { toast } = useToast();
  
  const form = useForm<InsertProfile>({
    resolver: zodResolver(insertProfileSchema),
    defaultValues: {
      name: "",
      birthDate: "",
      birthTime: "",
    },
  });

  const createProfileMutation = useMutation({
    mutationFn: async (data: InsertProfile) => {
      const response = await apiRequest("POST", "/api/profiles", data);
      return response.json();
    },
    onSuccess: (profile: Profile) => {
      toast({
        title: "Profile created",
        description: "Your cosmic profile has been generated successfully!",
      });
      onProfileCreated(profile);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertProfile) => {
    createProfileMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-slate-900 border-slate-700">
        <DialogHeader className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-cosmic-purple to-cosmic-gold rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="text-white text-xl" />
          </div>
          <div>
            <DialogTitle className="text-2xl font-bold mb-2">Create Your Cosmic Profile</DialogTitle>
            <p className="text-cosmic-gray">Discover your identity across 6 ancient zodiac systems</p>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your name"
                      className="bg-slate-800/50 border-slate-700 focus:ring-cosmic-purple focus:border-transparent"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Birth Date *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="date"
                      className="bg-slate-800/50 border-slate-700 focus:ring-cosmic-purple focus:border-transparent"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birthTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Birth Time (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="time"
                      className="bg-slate-800/50 border-slate-700 focus:ring-cosmic-purple focus:border-transparent"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-cosmic-purple to-cosmic-gold text-white font-semibold hover:shadow-lg hover:shadow-cosmic-purple/25 transition-all duration-300"
              disabled={createProfileMutation.isPending}
            >
              {createProfileMutation.isPending ? "Generating..." : "Generate My Cosmic Profile"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
