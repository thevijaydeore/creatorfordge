import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CreateSourceData {
  source_type: 'twitter' | 'rss' | 'tags';
  source_name: string;
  source_url?: string;
  source_config?: any;
}

export const useSources = () => {
  const queryClient = useQueryClient();

  const createSourceMutation = useMutation({
    mutationFn: async (data: CreateSourceData) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('sources')
        .insert({
          user_id: userData.user.id,
          source_type: data.source_type,
          source_name: data.source_name,
          source_url: data.source_url,
          source_config: data.source_config || {},
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sources'] });
      toast.success("Source added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add source");
      console.error(error);
    }
  });

  const validateRSSFeed = async (url: string): Promise<boolean> => {
    try {
      // Call edge function to validate RSS/Atom feed
      const { data, error } = await supabase.functions.invoke('validate-rss', {
        body: { url },
      })
      if (error) return false
      return Boolean(data?.valid)
    } catch {
      return false
    }
  };

  return {
    createSource: createSourceMutation.mutate,
    isCreating: createSourceMutation.isPending,
    validateRSSFeed,
  };
};