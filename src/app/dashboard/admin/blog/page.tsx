"use client";

import { useState, useEffect } from "react";
import { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost, uploadBlogImage, BlogPost } from "@/lib/blog-service";
import { useAuth } from "@/contexts/AuthContext";
import { Timestamp } from "firebase/firestore";
import { Plus, Trash2, Edit, AlertCircle, RefreshCw } from "lucide-react";
import { StatusPill } from "@/components/dashboard/StatusPill";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import toast from "react-hot-toast";
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { SuccessModal } from '@/components/common/SuccessModal';
import EmptyState from "@/components/common/EmptyState";


export default function AdminBlogPage() {
    const { userProfile } = useAuth();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [postToDelete, setPostToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Create / Edit State
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [currentPost, setCurrentPost] = useState<Partial<BlogPost> | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const [successModal, setSuccessModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        type: 'success' | 'error';
        onConfirm?: () => void;
        confirmLabel?: string;
    }>({
        isOpen: false,
        title: '',
        message: '',
        type: 'success'
    });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            toast.error("Image must be less than 10MB");
            return;
        }

        const objectUrl = URL.createObjectURL(file);

        // Dimension validation and instant preview
        const img = new window.Image();
        img.onload = async () => {
            if (img.width < 800 || img.height < 400) {
                toast.error("Image dimensions too small. Minimum is 800x400px.");
                URL.revokeObjectURL(objectUrl);
                return;
            }

            // Immediately show local preview
            setCurrentPost(prev => prev ? { ...prev, image: objectUrl } : null);

            try {
                setIsUploading(true);
                const downloadUrl = await uploadBlogImage(file);
                setCurrentPost(prev => prev ? { ...prev, image: downloadUrl } : null);
                toast.success("Image uploaded successfully");
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Possible Firebase Storage permission issue.";
                toast.error(`Upload failed: ${errorMessage}`);
                // Note: we leave the local preview intact so the user can see what they attempted
            } finally {
                setIsUploading(false);
                // We keep objectUrl active in case upload failed but they want to see the image locally
                // Note: clicking save will fail if it's a blob url
            }
        };
        img.onerror = () => {
            toast.error("Invalid image file");
            URL.revokeObjectURL(objectUrl);
        };
        img.src = objectUrl;
    };


    useEffect(() => {
        if (userProfile?.role === 'admin') {
            loadPosts();
        }
    }, [userProfile]);

    const loadPosts = async () => {
        try {
            setLoading(true);
            const fetchedPosts = await getBlogPosts(false); // Fetch all, not just published
            setPosts(fetchedPosts);
        } catch (error) {
            console.error("Error loading posts:", error);
            toast.error("Failed to load blog posts");
        } finally {
            setLoading(false);
        }
    };


    const handleDelete = async () => {
        if (!postToDelete) return;

        try {
            setIsDeleting(true);
            await deleteBlogPost(postToDelete);
            toast.success("Post deleted");
            setPosts(posts.filter(p => p.id !== postToDelete));
            setPostToDelete(null);
        } catch (error) {
            console.error("Error deleting post:", error);
            toast.error("Failed to delete post");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleSavePost = async () => {
        if (!currentPost?.title || !currentPost?.slug) {
            toast.error("Title and slug are required");
            return;
        }

        try {
            setIsSaving(true);
            if (currentPost.id) {
                await updateBlogPost(currentPost.id, {
                    title: currentPost.title || '',
                    slug: currentPost.slug || '',
                    excerpt: currentPost.excerpt || '',
                    content: currentPost.content || '',
                    category: currentPost.category || '',
                    author: currentPost.author || '',
                    image: currentPost.image || '',
                    isPublished: currentPost.isPublished || false
                });
                toast.success("Post updated successfully");
            } else {
                await createBlogPost({
                    title: currentPost.title || '',
                    slug: currentPost.slug || '',
                    excerpt: currentPost.excerpt || '',
                    content: currentPost.content || '',
                    category: currentPost.category || '',
                    author: currentPost.author || '',
                    image: currentPost.image || '',
                    isPublished: currentPost.isPublished || false
                });
                toast.success("Post created successfully");
            }
            setIsPostModalOpen(false);
            setCurrentPost(null);
            await loadPosts();
        } catch (error) {
            console.error("Error saving post:", error);
            toast.error("Failed to save post");
        } finally {
            setIsSaving(false);
        }
    };


    if (userProfile?.role !== 'admin') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-navy-900 dark:text-white">Access Denied</h2>
                <p className="text-gray-500 dark:text-slate-400 mt-2">You must be an administrator to view this page.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-8 h-full bg-slate-50 dark:bg-background-dark">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <DashboardHeader
                    title="Blog Management"
                    subtitle="Create, edit, and manage public blog posts."
                >
                    <Button
                        variant="premium"
                        className="rounded-xl"
                        leftIcon={<Plus className="w-5 h-5" />}
                        onClick={() => {
                            setCurrentPost({ title: '', slug: '', excerpt: '', content: '', category: '', author: '', image: '', isPublished: false });
                            setIsPostModalOpen(true);
                        }}
                    >
                        Create New Post
                    </Button>
                </DashboardHeader>

                {
                    loading ? (
                        <Card variant="flat" className="border-dashed bg-transparent">
                            <CardContent className="p-12 flex flex-col items-center justify-center text-slate-400">
                                <RefreshCw className="w-8 h-8 animate-spin mb-4" />
                                <p className="text-sm font-medium">Loading blog articles...</p>
                            </CardContent>
                        </Card>
                    ) : posts.length === 0 ? (
                        <EmptyState
                            title="No Blog Posts Found"
                            description="You haven't published any articles yet. Start by creating your first post."
                        />
                    ) : (
                        <Card>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm border-collapse">
                                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-700">
                                        <tr>
                                            <th className="px-6 py-4">Article Title</th>
                                            <th className="px-6 py-4">Author</th>
                                            <th className="px-6 py-4">Category</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {posts.map((post) => (
                                            <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-5">
                                                    <div className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{post.title}</div>
                                                    <div className="text-xs text-slate-500 mt-1 font-mono opacity-60">/{post.slug}</div>
                                                </td>
                                                <td className="px-6 py-5 text-slate-600 dark:text-slate-400 font-medium">{post.author}</td>
                                                <td className="px-6 py-5">
                                                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-1 px-3 rounded-lg text-xs font-bold uppercase tracking-wider">
                                                        {post.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <StatusPill status={post.isPublished ? 'success' : 'pending'} />
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="w-8 h-8 text-slate-400 hover:text-primary transition-colors"
                                                            title="Edit Post"
                                                            onClick={() => {
                                                                setCurrentPost(post);
                                                                setIsPostModalOpen(true);
                                                            }}
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => {
                                                                setSuccessModal({
                                                                    isOpen: true,
                                                                    title: 'Delete Blog Post',
                                                                    message: 'Are you sure you want to delete this post? This action cannot be undone.',
                                                                    type: 'error',
                                                                    confirmLabel: 'Delete',
                                                                    onConfirm: () => {
                                                                        setPostToDelete(post.id!);
                                                                        handleDelete();
                                                                    }
                                                                });
                                                            }}
                                                            className="w-8 h-8 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                                                            title="Delete Post"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    )
                }

                {/* Success/Confirmation Modal */}
                <SuccessModal
                    isOpen={successModal.isOpen}
                    onClose={() => setSuccessModal(prev => ({ ...prev, isOpen: false }))}
                    title={successModal.title}
                    message={successModal.message}
                    type={successModal.type}
                    onConfirm={successModal.onConfirm}
                    confirmLabel={successModal.confirmLabel}
                />

                {/* Create / Edit Modal */}
                {
                    isPostModalOpen && currentPost && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
                            <Card className="w-full max-w-6xl shadow-2xl animate-in zoom-in-95 duration-200 my-8 flex-shrink-0">
                                <CardContent className="p-0 flex flex-col md:flex-row h-[85vh]">
                                    {/* Editor Side */}
                                    <div className="flex-1 border-r border-slate-100 dark:border-slate-800 flex flex-col min-h-0 bg-white dark:bg-slate-900 overflow-y-auto custom-scrollbar">
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                                                {currentPost.id ? 'Edit Blog Post' : 'Create New Post'}
                                            </h3>

                                            <div className="space-y-4 px-1">
                                                <div className="space-y-2">
                                                    <Label>Title</Label>
                                                    <Input
                                                        value={currentPost.title || ''}
                                                        onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}
                                                        placeholder="Post Title"
                                                        className="text-lg font-medium"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Slug</Label>
                                                        <Input
                                                            value={currentPost.slug || ''}
                                                            onChange={(e) => setCurrentPost({ ...currentPost, slug: e.target.value })}
                                                            placeholder="post-slug"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Category</Label>
                                                        <Input
                                                            value={currentPost.category || ''}
                                                            onChange={(e) => setCurrentPost({ ...currentPost, category: e.target.value })}
                                                            placeholder="Category"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Author</Label>
                                                        <Input
                                                            value={currentPost.author || ''}
                                                            onChange={(e) => setCurrentPost({ ...currentPost, author: e.target.value })}
                                                            placeholder="Author Name"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Cover Image</Label>
                                                        <div className="flex items-center gap-2">
                                                            <Input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={handleImageUpload}
                                                                disabled={isUploading}
                                                                className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                                            />
                                                            {isUploading && <RefreshCw className="w-5 h-5 animate-spin text-slate-400" />}
                                                        </div>
                                                        <p className="text-xs text-slate-500 mt-1">Recommended size: 1200x630px. Max 10MB.</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Excerpt (shown in cards)</Label>
                                                    <Textarea
                                                        value={currentPost.excerpt || ''}
                                                        onChange={(e) => setCurrentPost({ ...currentPost, excerpt: e.target.value })}
                                                        placeholder="Brief summary..."
                                                        rows={2}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Content</Label>
                                                    <Textarea
                                                        value={currentPost.content || ''}
                                                        onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
                                                        placeholder="Full post content..."
                                                        rows={8}
                                                        className="text-sm leading-relaxed"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-2 pt-2">
                                                    <input
                                                        type="checkbox"
                                                        id="isPublished"
                                                        checked={currentPost.isPublished || false}
                                                        onChange={(e) => setCurrentPost({ ...currentPost, isPublished: e.target.checked })}
                                                        className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20"
                                                    />
                                                    <Label htmlFor="isPublished" className="font-bold cursor-pointer">Publish Immediately</Label>
                                                </div>
                                            </div>

                                            <div className="flex justify-start gap-3 mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        setIsPostModalOpen(false);
                                                        setCurrentPost(null);
                                                    }}
                                                    disabled={isSaving || isUploading}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    variant="premium"
                                                    onClick={handleSavePost}
                                                    loading={isSaving}
                                                    disabled={isUploading}
                                                >
                                                    {currentPost.id ? 'Save Changes' : 'Create Post'}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Live Preview Side */}
                                    <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 flex flex-col min-h-0 overflow-y-auto custom-scrollbar border-l border-slate-100 dark:border-slate-800">
                                        <div className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 py-3 border-b border-slate-100 dark:border-slate-800 z-10 flex items-center justify-between">
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Live Preview</span>
                                            <StatusPill status={currentPost.isPublished ? 'success' : 'pending'} />
                                        </div>
                                        <div className="p-8 max-w-2xl mx-auto w-full">
                                            <div className="prose prose-slate dark:prose-invert prose-lg max-w-none">
                                                {currentPost.category && (
                                                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
                                                        {currentPost.category}
                                                    </span>
                                                )}
                                                <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">
                                                    {currentPost.title || "Your Post Title"}
                                                </h1>
                                                <div className="flex items-center gap-3 text-slate-500 mb-8 pb-8 border-b border-slate-200 dark:border-slate-800">
                                                    <div className="font-medium text-slate-700 dark:text-slate-300">
                                                        {currentPost.author || "Author Name"}
                                                    </div>
                                                    <span>•</span>
                                                    <time>
                                                        {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                                    </time>
                                                </div>

                                                {currentPost.image && (
                                                    <div className="w-full aspect-video rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-8 relative">
                                                        <img
                                                            src={currentPost.image}
                                                            alt={currentPost.title || "Cover"}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                )}

                                                {currentPost.excerpt && (
                                                    <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                                                        {currentPost.excerpt}
                                                    </p>
                                                )}

                                                <div
                                                    className="blog-content space-y-4 whitespace-pre-wrap text-slate-600 dark:text-slate-400"
                                                >
                                                    {currentPost.content || "Content will appear here..."}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )
                }
            </div >
        </div >
    );
}
