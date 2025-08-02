"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Database, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function SeedDatabaseButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSeedDatabase = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/seed", {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "تم تهيئة قاعدة البيانات بنجاح",
          description: "تم إضافة بيانات السيارات والاستفسارات بنجاح.",
          variant: "default",
        });
      } else {
        throw new Error(data.message || "حدث خطأ أثناء تهيئة قاعدة البيانات");
      }
    } catch (error) {
      console.error("Error seeding database:", error);
      toast({
        title: "حدث خطأ",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء تهيئة قاعدة البيانات",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSeedDatabase}
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Database className="h-4 w-4" />
      )}
      {isLoading ? "جاري التهيئة..." : "تهيئة قاعدة البيانات"}
    </Button>
  );
} 