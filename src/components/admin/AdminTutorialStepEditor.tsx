import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Pencil, Check, X, RotateCcw } from 'lucide-react';
import { TutorialStep, tutorialSteps as defaultSteps } from '@/config/tutorialSteps';

interface AdminTutorialStepEditorProps {
  steps: TutorialStep[];
  onSaveStep: (stepId: string, title: string, content: string) => Promise<void>;
  onResetStep: (stepId: string) => Promise<void>;
  isSaving: boolean;
  overrides?: Record<string, { title: string; content: string }>;
}

export function AdminTutorialStepEditor({ steps, onSaveStep, onResetStep, isSaving, overrides }: AdminTutorialStepEditorProps) {
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const handleStartEdit = (step: TutorialStep) => {
    setEditingStepId(step.id);
    setEditTitle(step.title);
    setEditContent(step.content);
  };

  const handleCancelEdit = () => {
    setEditingStepId(null);
    setEditTitle('');
    setEditContent('');
  };

  const handleSave = async () => {
    if (!editingStepId || !editTitle.trim() || !editContent.trim()) return;
    await onSaveStep(editingStepId, editTitle.trim(), editContent.trim());
    setEditingStepId(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tutorial Steps Overview</CardTitle>
        <p className="text-sm text-muted-foreground">
          Current tutorial contains {steps.length} steps. Click the edit icon to customize titles and content.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {steps.map((step, index) => (
            <div key={step.id} className="p-3 rounded-lg border">
              {editingStepId === step.id ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{index + 1}</Badge>
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Step title"
                      className="flex-1"
                    />
                  </div>
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Step content"
                    rows={3}
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={handleCancelEdit} disabled={isSaving}>
                      <X className="h-3 w-3 mr-1" /> Cancel
                    </Button>
                    <Button size="sm" onClick={handleSave} disabled={isSaving || !editTitle.trim() || !editContent.trim()}>
                      <Check className="h-3 w-3 mr-1" /> {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Badge variant="outline">{index + 1}</Badge>
                    <div className="min-w-0">
                      <div className="font-medium">{step.title}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {step.content.substring(0, 100)}...
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-2 shrink-0">
                    {step.target && <Badge variant="secondary" className="text-xs">Interactive</Badge>}
                    {step.route && <Badge variant="outline" className="text-xs">Navigation</Badge>}
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleStartEdit(step)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
