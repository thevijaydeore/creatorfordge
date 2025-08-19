
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Wand2, Sparkles } from "lucide-react"
import { useContentGeneration } from "@/hooks/useContentGeneration"
import { useAuth } from "@/hooks/useAuth"

interface ContentGenerationFormProps {
  topicId?: string
  researchId?: string
  onSuccess?: (draft: any) => void
}

export const ContentGenerationForm = ({ topicId, researchId, onSuccess }: ContentGenerationFormProps) => {
  const { user } = useAuth()
  const { generateContent, isGenerating } = useContentGeneration()
  
  const [platform, setPlatform] = useState<string>("")
  const [contentType, setContentType] = useState<string>("")
  const [prompt, setPrompt] = useState("")

  const platforms = [
    { value: "twitter", label: "Twitter" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "instagram", label: "Instagram" },
    { value: "facebook", label: "Facebook" }
  ]

  const contentTypes = {
    twitter: [
      { value: "text_post", label: "Text Post" },
      { value: "thread", label: "Thread" }
    ],
    linkedin: [
      { value: "text_post", label: "Text Post" },
      { value: "article", label: "Article" }
    ],
    instagram: [
      { value: "caption", label: "Caption" },
      { value: "story", label: "Story" }
    ],
    facebook: [
      { value: "text_post", label: "Text Post" },
      { value: "long_form", label: "Long Form" }
    ]
  }

  const handleGenerate = () => {
    if (!user?.id || !platform || !contentType) return

    generateContent({
      topicId,
      researchId,
      userId: user.id,
      platform,
      contentType,
      prompt: prompt.trim() || undefined
    })
  }

  const currentContentTypes = contentTypes[platform as keyof typeof contentTypes] || []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Generate Content
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="platform">Platform</Label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                {platforms.map(p => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contentType">Content Type</Label>
            <Select 
              value={contentType} 
              onValueChange={setContentType}
              disabled={!platform}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                {currentContentTypes.map(ct => (
                  <SelectItem key={ct.value} value={ct.value}>
                    {ct.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="prompt">Additional Instructions (Optional)</Label>
          <Textarea
            id="prompt"
            placeholder="Any specific requirements or style preferences..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
          />
        </div>

        <Button 
          onClick={handleGenerate}
          disabled={!platform || !contentType || isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Wand2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4 mr-2" />
              Generate Content
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
