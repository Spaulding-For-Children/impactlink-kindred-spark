import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Save, Palette, Type, Layout, Eye, EyeOff, GripVertical, Shield } from "lucide-react";
import { AdminSecuritySettings } from "@/components/admin/AdminSecuritySettings";

export function AdminSiteSettings() {
  const { settings, isLoading, updateSetting } = useSiteSettings();
  const [localSettings, setLocalSettings] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState("content");

  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      setLocalSettings(JSON.parse(JSON.stringify(settings)));
    }
  }, [settings]);

  const updateLocal = (key: string, field: string, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: value }
    }));
  };

  const saveSection = (key: string) => {
    updateSetting.mutate({ key, value: localSettings[key] });
  };

  const toggleSectionVisibility = (sectionId: string) => {
    const sections = localSettings["sections"] || { order: [], hidden: [] };
    const hidden = sections.hidden || [];
    const newHidden = hidden.includes(sectionId)
      ? hidden.filter((s: string) => s !== sectionId)
      : [...hidden, sectionId];
    
    setLocalSettings(prev => ({
      ...prev,
      sections: { ...prev.sections, hidden: newHidden }
    }));
  };

  const moveSectionUp = (index: number) => {
    if (index === 0) return;
    const order = [...(localSettings["sections"]?.order || [])];
    [order[index - 1], order[index]] = [order[index], order[index - 1]];
    setLocalSettings(prev => ({
      ...prev,
      sections: { ...prev.sections, order }
    }));
  };

  const moveSectionDown = (index: number) => {
    const order = [...(localSettings["sections"]?.order || [])];
    if (index >= order.length - 1) return;
    [order[index], order[index + 1]] = [order[index + 1], order[index]];
    setLocalSettings(prev => ({
      ...prev,
      sections: { ...prev.sections, order }
    }));
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  const sectionLabels: Record<string, string> = {
    hero: "Hero",
    directory: "Directory",
    collaboration: "Collaboration",
    datatools: "Data & Tools",
    resources: "Resources",
    events: "Events",
    contact: "Contact",
  };

  const contentSections = [
    {
      key: "hero",
      title: "Hero Section",
      fields: [
        { name: "badge", label: "Badge Text", type: "input" },
        { name: "title", label: "Title", type: "input" },
        { name: "tagline", label: "Tagline", type: "input" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "ctaPrimary", label: "Primary Button Text", type: "input" },
        { name: "ctaSecondary", label: "Secondary Button Text", type: "input" },
      ],
    },
    {
      key: "directory_section",
      title: "Directory Section",
      fields: [
        { name: "title", label: "Title", type: "input" },
        { name: "description", label: "Description", type: "textarea" },
      ],
    },
    {
      key: "collaboration_section",
      title: "Collaboration Section",
      fields: [
        { name: "title", label: "Title", type: "input" },
        { name: "description", label: "Description", type: "textarea" },
      ],
    },
    {
      key: "datatools_section",
      title: "Data & Tools Section",
      fields: [
        { name: "title", label: "Title", type: "input" },
        { name: "description", label: "Description", type: "textarea" },
      ],
    },
    {
      key: "resources_section",
      title: "Resources Section",
      fields: [
        { name: "title", label: "Title", type: "input" },
        { name: "description", label: "Description", type: "textarea" },
      ],
    },
    {
      key: "events_section",
      title: "Events Section",
      fields: [
        { name: "title", label: "Title", type: "input" },
        { name: "description", label: "Description", type: "textarea" },
      ],
    },
    {
      key: "contact_section",
      title: "Contact Section",
      fields: [
        { name: "title", label: "Title", type: "input" },
        { name: "description", label: "Description", type: "textarea" },
      ],
    },
  ];

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="grid grid-cols-3 w-fit">
        <TabsTrigger value="content" className="flex items-center gap-2">
          <Type className="h-4 w-4" />Content
        </TabsTrigger>
        <TabsTrigger value="theme" className="flex items-center gap-2">
          <Palette className="h-4 w-4" />Theme
        </TabsTrigger>
        <TabsTrigger value="layout" className="flex items-center gap-2">
          <Layout className="h-4 w-4" />Layout
        </TabsTrigger>
      </TabsList>

      <TabsContent value="content" className="space-y-6">
        {contentSections.map((section) => (
          <Card key={section.key}>
            <CardHeader>
              <CardTitle className="text-lg">{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {section.fields.map((field) => (
                <div key={field.name}>
                  <Label>{field.label}</Label>
                  {field.type === "textarea" ? (
                    <Textarea
                      value={localSettings[section.key]?.[field.name] || ""}
                      onChange={(e) => updateLocal(section.key, field.name, e.target.value)}
                      rows={3}
                    />
                  ) : (
                    <Input
                      value={localSettings[section.key]?.[field.name] || ""}
                      onChange={(e) => updateLocal(section.key, field.name, e.target.value)}
                    />
                  )}
                </div>
              ))}
              <Button onClick={() => saveSection(section.key)} disabled={updateSetting.isPending} className="flex items-center gap-2">
                <Save className="h-4 w-4" />Save {section.title}
              </Button>
            </CardContent>
          </Card>
        ))}
      </TabsContent>

      <TabsContent value="theme" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Theme Colors</CardTitle>
            <CardDescription>Customize the color scheme (HSL format: e.g. "230 60% 25%")</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "primaryColor", label: "Primary Color" },
              { name: "secondaryColor", label: "Secondary / Accent Color" },
              { name: "accentColor", label: "Tertiary / Sage Color" },
            ].map((color) => (
              <div key={color.name} className="flex items-center gap-4">
                <div className="flex-1">
                  <Label>{color.label}</Label>
                  <Input
                    value={localSettings["theme"]?.[color.name] || ""}
                    onChange={(e) => updateLocal("theme", color.name, e.target.value)}
                    placeholder="230 60% 25%"
                  />
                </div>
                <div
                  className="w-10 h-10 rounded-lg border border-border mt-5"
                  style={{ backgroundColor: `hsl(${localSettings["theme"]?.[color.name] || "0 0% 50%"})` }}
                />
              </div>
            ))}
            <div>
              <Label>Display Font</Label>
              <Input
                value={localSettings["theme"]?.fontDisplay || ""}
                onChange={(e) => updateLocal("theme", "fontDisplay", e.target.value)}
                placeholder="Playfair Display"
              />
            </div>
            <div>
              <Label>Body Font</Label>
              <Input
                value={localSettings["theme"]?.fontBody || ""}
                onChange={(e) => updateLocal("theme", "fontBody", e.target.value)}
                placeholder="DM Sans"
              />
            </div>
            <Button onClick={() => saveSection("theme")} disabled={updateSetting.isPending} className="flex items-center gap-2">
              <Save className="h-4 w-4" />Save Theme
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="layout" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Section Order & Visibility</CardTitle>
            <CardDescription>Drag sections to reorder and toggle visibility on the landing page</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {(localSettings["sections"]?.order || []).map((sectionId: string, index: number) => {
              const isHidden = (localSettings["sections"]?.hidden || []).includes(sectionId);
              return (
                <div key={sectionId} className={`flex items-center gap-3 p-3 rounded-xl border border-border ${isHidden ? "opacity-50 bg-muted/50" : "bg-card"}`}>
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <span className="flex-1 font-medium">{sectionLabels[sectionId] || sectionId}</span>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => moveSectionUp(index)} disabled={index === 0}>↑</Button>
                    <Button variant="ghost" size="sm" onClick={() => moveSectionDown(index)} disabled={index === (localSettings["sections"]?.order?.length || 0) - 1}>↓</Button>
                    <div className="flex items-center gap-2">
                      {isHidden ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-foreground" />}
                      <Switch
                        checked={!isHidden}
                        onCheckedChange={() => toggleSectionVisibility(sectionId)}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
            <Button onClick={() => saveSection("sections")} disabled={updateSetting.isPending} className="flex items-center gap-2 mt-4">
              <Save className="h-4 w-4" />Save Layout
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
