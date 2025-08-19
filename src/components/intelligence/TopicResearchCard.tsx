
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Search, 
  TrendingUp, 
  Users, 
  Target, 
  Hash, 
  ExternalLink,
  Wand2
} from "lucide-react"

interface TopicResearchCardProps {
  research: {
    id: string
    summary: string
    key_stats: Record<string, any>
    audience_insights: Record<string, any>
    content_angles: string[]
    hashtags: string[]
    credibility_score: number
    depth_level: string
    created_at: string
  }
  onGenerateContent?: (researchId: string) => void
}

export const TopicResearchCard = ({ research, onGenerateContent }: TopicResearchCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getDepthColor = (depth: string) => {
    switch (depth) {
      case 'quick': return 'bg-blue-100 text-blue-800'
      case 'detailed': return 'bg-green-100 text-green-800' 
      case 'comprehensive': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Search className="h-5 w-5" />
            Research Analysis
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={getDepthColor(research.depth_level)}>
              {research.depth_level}
            </Badge>
            <Badge variant="outline">
              {Math.round(research.credibility_score * 100)}% credible
            </Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Generated {formatDate(research.created_at)}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Summary */}
        <div>
          <h4 className="font-medium mb-2">Executive Summary</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {research.summary}
          </p>
        </div>

        <Separator />

        {/* Key Stats */}
        {research.key_stats && Object.keys(research.key_stats).length > 0 && (
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Key Statistics
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(research.key_stats).map(([key, value]) => (
                <div key={key} className="bg-muted/30 p-3 rounded-lg">
                  <div className="text-sm font-medium capitalize">
                    {key.replace(/_/g, ' ')}
                  </div>
                  <div className="text-lg font-bold text-primary">{value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Audience Insights */}
        {research.audience_insights && (
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Audience Insights
            </h4>
            <div className="space-y-2">
              {Object.entries(research.audience_insights).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center text-sm">
                  <span className="capitalize font-medium">{key.replace(/_/g, ' ')}:</span>
                  <span className="text-muted-foreground">
                    {Array.isArray(value) ? value.join(', ') : String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Content Angles */}
        {research.content_angles && research.content_angles.length > 0 && (
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Content Angles
            </h4>
            <div className="space-y-2">
              {research.content_angles.map((angle, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium mt-0.5">
                    {index + 1}
                  </div>
                  <span className="flex-1">{angle}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hashtags */}
        {research.hashtags && research.hashtags.length > 0 && (
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Recommended Hashtags
            </h4>
            <div className="flex flex-wrap gap-2">
              {research.hashtags.map((hashtag, index) => (
                <Badge key={index} variant="secondary">
                  {hashtag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        {onGenerateContent && (
          <div className="pt-4">
            <Button 
              onClick={() => onGenerateContent(research.id)}
              className="w-full"
            >
              <Wand2 className="h-4 w-4 mr-2" />
              Generate Content from Research
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
