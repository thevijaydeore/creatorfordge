import { Button } from "@/components/ui/button";
import { Twitter } from "lucide-react";

export function AddTwitterSource() {
  const handleTwitterConnect = () => {
    // TODO: Implement Twitter OAuth flow
    // For now, show a message that it needs API configuration
    alert("Twitter integration requires API keys. This will be implemented with OAuth flow.");
  };

  return (
    <div className="text-center py-6">
      <Twitter className="h-12 w-12 mx-auto mb-4 text-blue-500" />
      <h3 className="text-lg font-medium mb-2">Connect Twitter Account</h3>
      <p className="text-muted-foreground mb-4">
        Authorize access to analyze your Twitter posts and engagement
      </p>
      <Button 
        className="w-full max-w-sm"
        onClick={handleTwitterConnect}
      >
        <Twitter className="h-4 w-4 mr-2" />
        Connect Twitter Account
      </Button>
      <p className="text-xs text-muted-foreground mt-2">
        We only read your public posts and engagement metrics
      </p>
    </div>
  );
}