import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { format } from "date-fns";
import { Calendar as CalendarIcon, RefreshCw } from "lucide-react";
import { useTopics } from "@/hooks/useTopics";
import { TopicCard } from "@/components/intelligence/TopicCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

const Intelligence = () => {
  const [date, setDate] = useState<Date | null>(new Date());
  const [view, setView] = useState("today");
  const { data: topics = [], isLoading, refetch, isFetching } = useTopics(date);

  const trending = useMemo(() => topics.filter(t => t.is_trending), [topics]);
  const others = useMemo(() => topics.filter(t => !t.is_trending), [topics]);

  return (
    <>
      <Helmet>
        <title>Content Intelligence Feed | CreatorPulse</title>
        <meta name="description" content="Content intelligence feed for creators: discover trending topics, insights, and opportunities." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : 'https://app.creatorpulse.ai/intelligence'} />
      </Helmet>

      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Content Intelligence Feed</h1>
        <p className="text-muted-foreground">Discover trending topics and opportunities tailored to your sources</p>
      </header>

      <section className="mb-6 flex flex-wrap items-center gap-3">
        <Tabs value={view} onValueChange={setView as any}>
          <TabsList>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="yesterday">Yesterday</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
          </TabsList>
        </Tabs>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <CalendarIcon className="h-4 w-4" />
              {date ? format(date, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" align="start">
            <Calendar 
              mode="single" 
              selected={date ?? undefined} 
              onSelect={(d) => setDate(d ?? null)} 
              initialFocus 
            />
          </PopoverContent>
        </Popover>
        <Button variant="secondary" onClick={() => refetch()} disabled={isFetching} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </section>

      <main className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Trending Now</CardTitle>
            <CardDescription>Auto-refreshes every 15 minutes</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-40 w-full" />
                ))}
              </div>
            ) : trending.length === 0 ? (
              <p className="text-sm text-muted-foreground">No trending topics for the selected date.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {trending.map(t => (
                  <TopicCard key={t.id} topic={t} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Topics</CardTitle>
            <CardDescription>Explore additional opportunities</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-40 w-full" />
                ))}
              </div>
            ) : others.length === 0 ? (
              <p className="text-sm text-muted-foreground">No topics available.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {others.map(t => (
                  <TopicCard key={t.id} topic={t} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  );
};

export default Intelligence;