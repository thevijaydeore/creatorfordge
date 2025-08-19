
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { toast } from "sonner"
import { 
  Flame, 
  Bookmark, 
  Wand2, 
  BookOpen, 
  Search,
  ChevronDown,
  ChevronUp 
} from "lucide-react"
import type { Topic } from "@/hooks/useTopics"
import { useTopicResearch, useTopicResearchData } from "@/hooks/useTopicResearch"
import { useAuth } from "@/hooks/useAuth"
import { TopicResearchCard } from "./TopicResearchCard"
import { ContentGenerationForm } from "./ContentGenerationForm"

interface Props {
  topic: Topic
}

export const EnhancedTopicCard = ({ topic }: Props) => {
  const { user } = useAuth()
  const { conductResearch, isResearching } = useTopicResearch()
  const { data: research } = useTopicResearchData(topic.id, true)
  
  const [isExpanded, setIsExpanded] = useState(false)
  const [showContentForm, setShowContentForm] = useState(false)

  const onComingSoon = (label: string) => () => toast.info(`${label} coming soon`)

  const handleResearch = (depth: 'quick' | 'detailed' | 'comprehensive' = 'detailed') => {
    if (!user?.id) {
      toast.error('Please log in to conduct research')
      return
    }

    conductResearch({
      topicId: topic.id,
      userId: user.id,
      depthLevel: depth
    })
  }

  const handleGenerateContent = (researchId?: string) => {
    setShowContentForm(true)
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            {topic.is_trending && <Flame className="h-4 w-4 text-destructive" />}
            {topic.title}
          </CardTitle>
          <div className="flex items-center gap-2">
            {topic.topic_type && <Badge variant="secondary">{topic.topic_type}</Badge>}
            <Badge variant="outline">Trend {topic.trend_score}</Badge>
            <Badge variant="outline">Conf {Math.round(topic.confidence_score * 100)}%</Badge>
          </div>
        </div>
        {topic.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">{topic.description}</p>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {topic.keywords?.slice(0, 6).map((kw) => (
            <Badge key={kw} variant="outline">#{kw}</Badge>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Button size="sm" onClick={() => handleResearch('detailed')} disabled={isResearching}> 
            <BookOpen className="h-4 w-4 mr-2" /> 
            {isResearching ? 'Researching...' : 'Research'}
          </Button>
          
          <Button size="sm" variant="secondary" onClick={() => setShowContentForm(true)}> 
            <Wand2 className="h-4 w-4 mr-2" /> Generate
          </Button>
          
          <Button size="sm" variant="outline" onClick={onComingSoon("Save")}> 
            <Bookmark className="h-4 w-4 mr-2" /> Save
          </Button>
        </div>

        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Advanced Actions
              </span>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-4 mt-4">
            {/* Research Depth Options */}
            <div>
              <p className="text-sm font-medium mb-2">Research Depth:</p>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleResearch('quick')}
                  disabled={isResearching}
                >
                  Quick
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleResearch('detailed')}
                  disabled={isResearching}
                >
                  Detailed
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleResearch('comprehensive')}
                  disabled={isResearching}
                >
                  Comprehensive
                </Button>
              </div>
            </div>

            {/* Show Research Results */}
            {research && (
              <TopicResearchCard 
                research={research} 
                onGenerateContent={handleGenerateContent}
              />
            )}

            {/* Content Generation Form */}
            {showContentForm && (
              <ContentGenerationForm 
                topicId={topic.id}
                researchId={research?.id}
                onSuccess={() => {
                  setShowContentForm(false)
                  toast.success('Content generated and saved to drafts!')
                }}
              />
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}
