import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Database, FileText, Shield, Search, ExternalLink, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDatasets, useAnalysisTools, useEthicsResources } from "@/hooks/useDataTools";

const DatasetsTab = () => {
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("");
  const { data: datasets = [], isLoading } = useDatasets();

  const filtered = datasets.filter(d =>
    (!search || d.title.toLowerCase().includes(search.toLowerCase()) || d.description.toLowerCase().includes(search.toLowerCase())) &&
    (!sourceFilter || d.source_type === sourceFilter)
  );

  const sourceTypes = [...new Set(datasets.map(d => d.source_type))];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search datasets..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant={!sourceFilter ? "default" : "outline"} size="sm" onClick={() => setSourceFilter("")}>All</Button>
          {sourceTypes.map(t => (
            <Button key={t} variant={sourceFilter === t ? "default" : "outline"} size="sm" onClick={() => setSourceFilter(t)} className="capitalize">{t}</Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-48 rounded-2xl bg-muted animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No datasets found</h3>
          <p className="text-muted-foreground">Check back later for new datasets.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(dataset => (
            <Card key={dataset.id} className="rounded-2xl border-border hover:shadow-soft transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Badge variant="secondary" className="capitalize mb-2">{dataset.source_type}</Badge>
                  {dataset.featured && <Badge className="bg-amber text-white">Featured</Badge>}
                </div>
                <CardTitle className="text-lg">{dataset.title}</CardTitle>
                <CardDescription>{dataset.source_organization}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">{dataset.description}</p>
                {dataset.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {dataset.topics.slice(0, 3).map(topic => (
                      <Badge key={topic} variant="outline" className="text-xs"><Tag className="h-3 w-3 mr-1" />{topic}</Badge>
                    ))}
                  </div>
                )}
                {dataset.data_format && (
                  <p className="text-xs text-muted-foreground">Format: <span className="uppercase font-medium">{dataset.data_format}</span></p>
                )}
                <div className="flex gap-2">
                  {dataset.access_url && (
                    <Button size="sm" variant="outline" className="flex-1" asChild>
                      <a href={dataset.access_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3 mr-1" /> Access Data
                      </a>
                    </Button>
                  )}
                  {dataset.documentation_url && (
                    <Button size="sm" variant="ghost" asChild>
                      <a href={dataset.documentation_url} target="_blank" rel="noopener noreferrer">Docs</a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const ToolsTab = () => {
  const [search, setSearch] = useState("");
  const { data: tools = [], isLoading } = useAnalysisTools();

  const filtered = tools.filter(t =>
    !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.full_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search tools..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1,2].map(i => <div key={i} className="h-40 rounded-2xl bg-muted animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No tools found</h3>
          <p className="text-muted-foreground">Check back later for new assessment tools.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map(tool => (
            <Card key={tool.id} className="rounded-2xl border-border hover:shadow-soft transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Badge variant="secondary" className="capitalize mb-2">{tool.tool_type}</Badge>
                  {tool.featured && <Badge className="bg-amber text-white">Featured</Badge>}
                </div>
                <CardTitle className="text-lg">
                  <span className="text-amber font-bold">{tool.name}</span>
                  <span className="text-muted-foreground font-normal text-sm ml-2">— {tool.category}</span>
                </CardTitle>
                <CardDescription>{tool.full_name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{tool.description}</p>
                {tool.license_type && (
                  <p className="text-xs text-muted-foreground">License: <span className="capitalize font-medium">{tool.license_type}</span></p>
                )}
                <div className="flex gap-2">
                  {tool.access_url && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={tool.access_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3 mr-1" /> Access Tool
                      </a>
                    </Button>
                  )}
                  {tool.documentation_url && (
                    <Button size="sm" variant="ghost" asChild>
                      <a href={tool.documentation_url} target="_blank" rel="noopener noreferrer">Documentation</a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const EthicsTab = () => {
  const [search, setSearch] = useState("");
  const { data: resources = [], isLoading } = useEthicsResources();

  const filtered = resources.filter(r =>
    !search || r.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search ethics resources..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1,2].map(i => <div key={i} className="h-36 rounded-2xl bg-muted animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No ethics resources found</h3>
          <p className="text-muted-foreground">Check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map(resource => (
            <Card key={resource.id} className="rounded-2xl border-border hover:shadow-soft transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Badge variant="secondary" className="capitalize mb-2">{resource.resource_type}</Badge>
                  {resource.jurisdiction && <Badge variant="outline">{resource.jurisdiction}</Badge>}
                </div>
                <CardTitle className="text-lg">{resource.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{resource.description}</p>
                {resource.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {resource.tags.map(tag => <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>)}
                  </div>
                )}
                {resource.external_url && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={resource.external_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3 mr-1" /> View Resource
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const DataToolsPage = () => {
  const [activeTab, setActiveTab] = useState("datasets");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <section className="py-16 bg-gradient-to-b from-navy/10 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber/10 text-amber text-sm font-medium mb-4">
                Data & Tools Repository
              </span>
              <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-6">
                Access the Data
                <span className="block text-amber">You Need</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Curated datasets, validated assessment tools, and comprehensive ethics guidance
                to support your research journey.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start flex-wrap h-auto gap-2 bg-transparent p-0 mb-8">
                <TabsTrigger value="datasets" className="data-[state=active]:bg-navy data-[state=active]:text-white rounded-full px-6 py-2.5">
                  <Database className="w-4 h-4 mr-2" /> Datasets
                </TabsTrigger>
                <TabsTrigger value="tools" className="data-[state=active]:bg-amber data-[state=active]:text-white rounded-full px-6 py-2.5">
                  <FileText className="w-4 h-4 mr-2" /> Assessment Tools
                </TabsTrigger>
                <TabsTrigger value="ethics" className="data-[state=active]:bg-sage data-[state=active]:text-white rounded-full px-6 py-2.5">
                  <Shield className="w-4 h-4 mr-2" /> IRB & Ethics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="datasets"><DatasetsTab /></TabsContent>
              <TabsContent value="tools"><ToolsTab /></TabsContent>
              <TabsContent value="ethics"><EthicsTab /></TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default DataToolsPage;
