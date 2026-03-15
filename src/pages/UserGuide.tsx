import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Microscope, Building2, CheckCircle2, Loader2 } from 'lucide-react';

const roleIcons: Record<string, any> = {
  Student: GraduationCap,
  Researcher: Microscope,
  Agency: Building2,
};

const UserGuide = () => {
  const { getSetting, isLoading } = useSiteSettings();
  const guides = getSetting('role_guides', undefined, []) as any[];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge variant="secondary" className="mb-4">Getting Started</Badge>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
              User Guide
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Follow these step-by-step guides to get the most out of ImpactLink based on your role.
            </p>
          </motion.div>

          {guides.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                User guides are being prepared. Please check back soon.
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue={guides[0]?.role || 'Student'} className="w-full">
              <TabsList className="grid w-full mb-8" style={{ gridTemplateColumns: `repeat(${guides.length}, 1fr)` }}>
                {guides.map((guide: any) => {
                  const Icon = roleIcons[guide.role] || GraduationCap;
                  return (
                    <TabsTrigger key={guide.role} value={guide.role} className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {guide.role}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {guides.map((guide: any) => (
                <TabsContent key={guide.role} value={guide.role}>
                  <div className="space-y-4">
                    {guide.steps?.map((step: any, index: number) => (
                      <motion.div
                        key={step.id || index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card>
                          <CardHeader className="pb-3">
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <CardTitle className="text-lg">{step.title}</CardTitle>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pl-16 pt-0">
                            <p className="text-muted-foreground whitespace-pre-wrap">{step.description}</p>
                            {step.tips && (
                              <div className="mt-3 flex items-start gap-2 text-sm text-sage">
                                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span>{step.tips}</span>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserGuide;
