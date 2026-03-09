import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Play, Settings, Users, Eye, RotateCcw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useTutorial } from '@/contexts/TutorialContext';
import { tutorialSteps } from '@/config/tutorialSteps';
import { useToast } from '@/hooks/use-toast';

interface TutorialSettings {
  enabled: boolean;
  autoTrigger: boolean;
}

export function AdminTutorial() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { startTutorial, isActive } = useTutorial();
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch tutorial settings
  const { data: tutorialSettings, isLoading } = useQuery({
    queryKey: ['tutorialSettings'],
    queryFn: async (): Promise<TutorialSettings> => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'tutorial_settings')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      // Cast the JSON value to our expected type with fallback defaults
      const settings = data?.value as TutorialSettings | null;
      return settings || { enabled: true, autoTrigger: true };
    }
  });

  // Fetch tutorial analytics
  const { data: tutorialStats } = useQuery({
    queryKey: ['tutorialStats'],
    queryFn: async () => {
      const { data: totalUsers, error: totalError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true });

      const { data: completedUsers, error: completedError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('tutorial_completed', true);

      if (totalError || completedError) {
        throw totalError || completedError;
      }

      const total = totalUsers?.length || 0;
      const completed = completedUsers?.length || 0;

      return {
        totalUsers: total,
        completedUsers: completed,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
        pendingUsers: total - completed
      };
    }
  });

  // Update tutorial settings
  const updateSettings = useMutation({
    mutationFn: async (newSettings: TutorialSettings) => {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          key: 'tutorial_settings',
          value: newSettings,
          updated_by: (await supabase.auth.getUser()).data.user?.id
        }, {
          onConflict: 'key'
        });

      if (error) throw error;
      return newSettings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutorialSettings'] });
      toast({
        title: 'Tutorial Settings Updated',
        description: 'Changes have been saved successfully.',
      });
    },
    onError: (error) => {
      console.error('Error updating tutorial settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to update tutorial settings.',
        variant: 'destructive',
      });
    }
  });

  // Reset all user tutorials
  const resetAllTutorials = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('profiles')
        .update({ tutorial_completed: false })
        .neq('tutorial_completed', null);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutorialStats'] });
      toast({
        title: 'Tutorials Reset',
        description: 'All users will see the tutorial again on their next login.',
      });
    },
    onError: (error) => {
      console.error('Error resetting tutorials:', error);
      toast({
        title: 'Error',
        description: 'Failed to reset user tutorials.',
        variant: 'destructive',
      });
    }
  });

  const handleSettingChange = async (key: keyof TutorialSettings, value: boolean) => {
    setIsUpdating(true);
    const currentSettings: TutorialSettings = tutorialSettings || { enabled: true, autoTrigger: true };
    const newSettings = { ...currentSettings, [key]: value };
    await updateSettings.mutateAsync(newSettings);
    setIsUpdating(false);
  };

  const handlePreviewTutorial = () => {
    if (isActive) {
      toast({
        title: 'Tutorial Already Active',
        description: 'The tutorial is currently running.',
      });
      return;
    }
    
    startTutorial();
    toast({
      title: 'Tutorial Preview Started',
      description: 'You can now experience the tutorial as a new user would.',
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Tutorial Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-10 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tutorial Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Tutorial Settings
          </CardTitle>
          <CardDescription>
            Control the interactive tutorial system for all users
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable/Disable Tutorial */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="tutorial-enabled">Enable Tutorial System</Label>
              <p className="text-sm text-muted-foreground">
                When disabled, no users will see the tutorial (including new users)
              </p>
            </div>
            <Switch
              id="tutorial-enabled"
              checked={tutorialSettings?.enabled ?? false}
              onCheckedChange={(checked) => handleSettingChange('enabled', checked)}
              disabled={isUpdating}
            />
          </div>

          <Separator />

          {/* Auto-trigger Setting */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="tutorial-auto">Auto-trigger for New Users</Label>
              <p className="text-sm text-muted-foreground">
                Automatically start tutorial when new users sign in for the first time
              </p>
            </div>
            <Switch
              id="tutorial-auto"
              checked={tutorialSettings?.autoTrigger ?? false}
              onCheckedChange={(checked) => handleSettingChange('autoTrigger', checked)}
              disabled={isUpdating || !tutorialSettings?.enabled}
            />
          </div>

          <Separator />

          {/* Preview Tutorial */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Preview Tutorial</Label>
              <p className="text-sm text-muted-foreground">
                Experience the tutorial as a new user would see it
              </p>
            </div>
            <Button
              onClick={handlePreviewTutorial}
              disabled={!tutorialSettings?.enabled || isActive}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Preview Tutorial
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tutorial Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Tutorial Analytics
          </CardTitle>
          <CardDescription>
            View tutorial completion statistics across all users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-secondary/50">
              <div className="text-2xl font-bold text-foreground">
                {tutorialStats?.totalUsers || 0}
              </div>
              <div className="text-sm text-muted-foreground">Total Users</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary/50">
              <div className="text-2xl font-bold text-green-600">
                {tutorialStats?.completedUsers || 0}
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary/50">
              <div className="text-2xl font-bold text-amber-600">
                {tutorialStats?.pendingUsers || 0}
              </div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary/50">
              <div className="text-2xl font-bold text-primary">
                {tutorialStats?.completionRate || 0}%
              </div>
              <div className="text-sm text-muted-foreground">Completion Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tutorial Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Tutorial Steps Overview</CardTitle>
          <CardDescription>
            Current tutorial contains {tutorialSteps.length} steps covering all major platform features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {tutorialSteps.map((step, index) => (
              <div key={step.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{index + 1}</Badge>
                  <div>
                    <div className="font-medium">{step.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {step.content.substring(0, 100)}...
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {step.target && (
                    <Badge variant="secondary" className="text-xs">
                      Interactive
                    </Badge>
                  )}
                  {step.route && (
                    <Badge variant="outline" className="text-xs">
                      Navigation
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-600">
            <RotateCcw className="h-5 w-5" />
            Advanced Actions
          </CardTitle>
          <CardDescription>
            Use these actions carefully as they affect all users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Reset All User Tutorials</Label>
              <p className="text-sm text-muted-foreground">
                Mark all users as not having completed the tutorial. They will see it again on next login.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => resetAllTutorials.mutate()}
              disabled={resetAllTutorials.isPending}
              className="flex items-center gap-2 text-amber-600 border-amber-600 hover:bg-amber-50"
            >
              <RotateCcw className="h-4 w-4" />
              {resetAllTutorials.isPending ? 'Resetting...' : 'Reset All'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}