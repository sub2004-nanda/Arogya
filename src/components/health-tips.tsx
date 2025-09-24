"use client";

import { useState, useTransition } from "react";
import { Lightbulb } from 'lucide-react';
import { getLocalizedHealthTips } from "@/lib/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const dialects = [
  { value: 'english', label: 'English' },
  { value: 'hindi', label: 'Hindi' },
  { value: 'punjabi', label: 'Punjabi' },
  { value: 'southern drawl', label: 'Southern US' },
  { value: 'pirate', label: 'Pirate' },
];

export function HealthTips() {
  const [dialect, setDialect] = useState("english");
  const [tips, setTips] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleDialectChange = (newDialect: string) => {
    setDialect(newDialect);
    startTransition(async () => {
      const result = await getLocalizedHealthTips({ dialect: newDialect });
      if (result) {
        setTips(result.tips);
      }
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-4">
          <Select onValueChange={handleDialectChange} defaultValue={dialect}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a dialect" />
            </SelectTrigger>
            <SelectContent>
              {dialects.map((d) => (
                <SelectItem key={d.value} value={d.value}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          {isPending ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-5 w-5 mt-1 rounded-full" />
                <div className="space-y-2 flex-1">
                   <Skeleton className="h-4 w-3/4" />
                   <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))
          ) : tips.length > 0 ? (
            tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-3 text-sm">
                <Lightbulb className="h-5 w-5 flex-shrink-0 mt-0.5 text-primary" />
                <span>{tip}</span>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-4">
              Select a dialect to see health tips.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
