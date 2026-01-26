import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, MessageSquare, ArrowLeft, Send, Clock, Heart, Home, Scale, Globe, Users, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  useForumTopics,
  useForumPosts,
  useForumPost,
  useForumReplies,
  useCreateForumPost,
  useCreateForumReply,
  useCurrentProfile,
} from "@/hooks/useCollaboration";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  heart: Heart,
  home: Home,
  scale: Scale,
  globe: Globe,
  users: Users,
  "heart-handshake": HeartHandshake,
};

const COLOR_MAP: Record<string, string> = {
  rose: "bg-rose-100 text-rose-700",
  amber: "bg-amber-100 text-amber-700",
  indigo: "bg-indigo-100 text-indigo-700",
  sage: "bg-sage/20 text-sage",
  sky: "bg-sky-100 text-sky-700",
  violet: "bg-violet-100 text-violet-700",
};

export const Forums = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: profile } = useCurrentProfile();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [newPostDialog, setNewPostDialog] = useState(false);
  const [newPostData, setNewPostData] = useState({ topic_id: "", title: "", content: "" });
  const [replyContent, setReplyContent] = useState("");

  const { data: topics, isLoading: loadingTopics } = useForumTopics();
  const { data: posts, isLoading: loadingPosts } = useForumPosts(selectedTopic || undefined);
  const { data: currentPost } = useForumPost(selectedPost || "");
  const { data: replies, isLoading: loadingReplies } = useForumReplies(selectedPost || "");
  const createPost = useCreateForumPost();
  const createReply = useCreateForumReply();

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) {
      toast({ title: "Profile required", description: "Please create a profile first.", variant: "destructive" });
      return;
    }

    try {
      await createPost.mutateAsync({
        topic_id: newPostData.topic_id || selectedTopic!,
        author_id: profile.id,
        title: newPostData.title,
        content: newPostData.content,
      });
      toast({ title: "Post created!" });
      setNewPostDialog(false);
      setNewPostData({ topic_id: "", title: "", content: "" });
    } catch {
      toast({ title: "Error", description: "Failed to create post.", variant: "destructive" });
    }
  };

  const handleCreateReply = async () => {
    if (!profile || !replyContent.trim() || !selectedPost) return;

    try {
      await createReply.mutateAsync({
        post_id: selectedPost,
        author_id: profile.id,
        content: replyContent,
      });
      setReplyContent("");
    } catch {
      toast({ title: "Error", description: "Failed to post reply.", variant: "destructive" });
    }
  };

  // View: Post Detail
  if (selectedPost && currentPost) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setSelectedPost(null)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to {currentPost.topic?.name || "Forum"}
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarImage src={currentPost.author?.avatar_url || undefined} />
                <AvatarFallback>{currentPost.author?.name?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-xl mb-2">{currentPost.title}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{currentPost.author?.name}</span>
                  <span>•</span>
                  <Badge variant="secondary" className="capitalize">{currentPost.author?.profile_type}</Badge>
                  <span>•</span>
                  <Clock className="w-3 h-3" />
                  <span>{formatDistanceToNow(new Date(currentPost.created_at), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{currentPost.content}</p>
          </CardContent>
        </Card>

        {/* Replies */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Replies ({replies?.length || 0})</h3>

          {loadingReplies ? (
            <Skeleton className="h-24 w-full" />
          ) : (
            <div className="space-y-4">
              {replies?.map((reply) => (
                <Card key={reply.id} className="bg-muted/30">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={reply.author?.avatar_url || undefined} />
                        <AvatarFallback>{reply.author?.name?.[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm mb-2">
                          <span className="font-medium">{reply.author?.name}</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground text-xs">
                            {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{reply.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {user && (
            <div className="flex gap-2">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                rows={2}
                className="flex-1"
              />
              <Button onClick={handleCreateReply} disabled={!replyContent.trim() || createReply.isPending}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // View: Topic Posts
  if (selectedTopic) {
    const topic = topics?.find((t) => t.id === selectedTopic);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setSelectedTopic(null)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            All Forums
          </Button>
          {user && (
            <Dialog open={newPostDialog} onOpenChange={setNewPostDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Post
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Post in {topic?.name}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreatePost} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={newPostData.title}
                      onChange={(e) => setNewPostData((d) => ({ ...d, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Content</Label>
                    <Textarea
                      value={newPostData.content}
                      onChange={(e) => setNewPostData((d) => ({ ...d, content: e.target.value }))}
                      rows={5}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={createPost.isPending}>
                    Post
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-display font-bold mb-2">{topic?.name}</h2>
          <p className="text-muted-foreground">{topic?.description}</p>
        </div>

        {loadingPosts ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : posts?.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No posts yet. Start the discussion!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {posts?.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedPost(post.id)}
                >
                  <CardContent className="py-4">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage src={post.author?.avatar_url || undefined} />
                        <AvatarFallback>{post.author?.name?.[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{post.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{post.content}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{post.author?.name}</span>
                          <span>•</span>
                          <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {post.reply_count} replies
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // View: Forum Topics
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold">Discussion Forums</h2>
          <p className="text-muted-foreground">Join discussions on key issues in child welfare</p>
        </div>
        {user && (
          <Dialog open={newPostDialog} onOpenChange={setNewPostDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreatePost} className="space-y-4">
                <div className="space-y-2">
                  <Label>Forum</Label>
                  <Select
                    value={newPostData.topic_id}
                    onValueChange={(v) => setNewPostData((d) => ({ ...d, topic_id: v }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a forum" />
                    </SelectTrigger>
                    <SelectContent>
                      {topics?.map((t) => (
                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={newPostData.title}
                    onChange={(e) => setNewPostData((d) => ({ ...d, title: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Content</Label>
                  <Textarea
                    value={newPostData.content}
                    onChange={(e) => setNewPostData((d) => ({ ...d, content: e.target.value }))}
                    rows={5}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={createPost.isPending}>
                  Post
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {loadingTopics ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics?.map((topic, index) => {
            const IconComponent = ICON_MAP[topic.icon || "message-square"] || MessageSquare;
            const colorClass = COLOR_MAP[topic.color || "sage"];

            return (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className="cursor-pointer hover:shadow-md transition-all hover:-translate-y-1"
                  onClick={() => setSelectedTopic(topic.id)}
                >
                  <CardContent className="pt-6">
                    <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center mb-4`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold mb-1">{topic.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{topic.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
