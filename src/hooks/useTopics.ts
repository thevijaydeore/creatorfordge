import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Topic {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  keywords: string[];
  confidence_score: number;
  trend_score: number;
  is_trending: boolean;
  created_at: string;
  updated_at: string;
  topic_type: string | null;
}

export const useTopics = (date: Date | null) => {
  return useQuery({
    queryKey: ["topics", date?.toDateString() ?? "all"],
    queryFn: async () => {
      let query = supabase
        .from("topics")
        .select("*")
        .order("trend_score", { ascending: false });

      if (date) {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        query = query.gte("created_at", start.toISOString()).lte("created_at", end.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data as Topic[]) ?? [];
    },
    refetchInterval: 15 * 60 * 1000,
  });
};