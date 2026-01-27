import { useState } from "react";
import { format } from "date-fns";
import { Plus, Trash2, Edit, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAdmin } from "@/hooks/useAdmin";

interface EventForm {
  id?: string;
  title: string;
  description: string;
  event_type: "workshop" | "webinar" | "conference" | "networking" | "training";
  start_date: string;
  end_date: string;
  location: string;
  is_virtual: boolean;
  virtual_link: string;
  host_name: string;
  host_organization: string;
  max_attendees?: number;
}

const emptyForm: EventForm = {
  title: "",
  description: "",
  event_type: "workshop",
  start_date: "",
  end_date: "",
  location: "",
  is_virtual: true,
  virtual_link: "",
  host_name: "",
  host_organization: "",
};

export function AdminEvents() {
  const { allEvents, isLoadingEvents, upsertEvent, deleteEvent } = useAdmin();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState<EventForm>(emptyForm);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    upsertEvent.mutate({
      ...form,
      max_attendees: form.max_attendees || undefined,
    }, {
      onSuccess: () => {
        setIsDialogOpen(false);
        setForm(emptyForm);
      },
    });
  };

  const handleEdit = (event: any) => {
    setForm({
      id: event.id,
      title: event.title,
      description: event.description,
      event_type: event.event_type,
      start_date: event.start_date?.slice(0, 16) || "",
      end_date: event.end_date?.slice(0, 16) || "",
      location: event.location || "",
      is_virtual: event.is_virtual ?? true,
      virtual_link: event.virtual_link || "",
      host_name: event.host_name || "",
      host_organization: event.host_organization || "",
      max_attendees: event.max_attendees,
    });
    setIsDialogOpen(true);
  };

  if (isLoadingEvents) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Events
          <Badge variant="secondary" className="ml-2">{allEvents.length} events</Badge>
        </CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setForm(emptyForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{form.id ? "Edit Event" : "Add New Event"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Event Type</Label>
                <Select
                  value={form.event_type}
                  onValueChange={(v) => setForm({ ...form, event_type: v as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="webinar">Webinar</SelectItem>
                    <SelectItem value="conference">Conference</SelectItem>
                    <SelectItem value="networking">Networking</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date & Time</Label>
                  <Input
                    id="start_date"
                    type="datetime-local"
                    value={form.start_date}
                    onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date & Time</Label>
                  <Input
                    id="end_date"
                    type="datetime-local"
                    value={form.end_date}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="is_virtual"
                  checked={form.is_virtual}
                  onCheckedChange={(checked) => setForm({ ...form, is_virtual: checked })}
                />
                <Label htmlFor="is_virtual">Virtual Event</Label>
              </div>
              {form.is_virtual ? (
                <div className="space-y-2">
                  <Label htmlFor="virtual_link">Virtual Link</Label>
                  <Input
                    id="virtual_link"
                    type="url"
                    value={form.virtual_link}
                    onChange={(e) => setForm({ ...form, virtual_link: e.target.value })}
                    placeholder="https://zoom.us/..."
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="host_name">Host Name</Label>
                  <Input
                    id="host_name"
                    value={form.host_name}
                    onChange={(e) => setForm({ ...form, host_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="host_organization">Host Organization</Label>
                  <Input
                    id="host_organization"
                    value={form.host_organization}
                    onChange={(e) => setForm({ ...form, host_organization: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_attendees">Max Attendees (optional)</Label>
                <Input
                  id="max_attendees"
                  type="number"
                  value={form.max_attendees || ""}
                  onChange={(e) => setForm({ ...form, max_attendees: e.target.value ? parseInt(e.target.value) : undefined })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={upsertEvent.isPending}>
                  {form.id ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {allEvents.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No events yet</p>
        ) : (
          <div className="space-y-3">
            {allEvents.map((event: any) => (
              <div
                key={event.id}
                className="border rounded-lg p-4 flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold truncate">{event.title}</h3>
                    <Badge variant="outline">{event.event_type}</Badge>
                    {event.is_virtual && <Badge variant="secondary">Virtual</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(event.start_date), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {event.host_organization && `Hosted by ${event.host_organization}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(event)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Event</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{event.title}"? This will also remove all registrations.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteEvent.mutate(event.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
