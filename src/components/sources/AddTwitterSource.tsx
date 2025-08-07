import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Twitter } from "lucide-react";
import { useSources } from "@/hooks/useSources";

export function AddTwitterSource() {
  const [username, setUsername] = useState("");
  const { createSource, isCreating } = useSources();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    const cleanUsername = username.trim().replace('@', '');
    
    createSource({
      source_type: 'twitter',
      source_name: `@${cleanUsername}`,
      source_url: `https://twitter.com/${cleanUsername}`,
      source_config: { username: cleanUsername },
    });

    setUsername("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-4">
        <Twitter className="h-8 w-8 mx-auto mb-2 text-blue-500" />
        <h3 className="text-lg font-medium">Track Twitter User</h3>
        <p className="text-sm text-muted-foreground">
          Add a Twitter username to analyze their posts and engagement
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="twitter-username">Twitter Username</Label>
        <Input
          id="twitter-username"
          placeholder="username (without @)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={isCreating || !username.trim()}
      >
        <Twitter className="h-4 w-4 mr-2" />
        {isCreating ? "Adding..." : "Add Twitter Source"}
      </Button>
    </form>
  );
}