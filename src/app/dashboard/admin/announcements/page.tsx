"use client";

import { useState, useEffect } from "react";
import {
    getAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    uploadAnnouncementImage,
    Announcement
} from "@/lib/announcement-service";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Trash2, Edit, AlertCircle, RefreshCw, Megaphone, Eye, ExternalLink, Calendar, Upload, Image as ImageIcon, X } from "lucide-react";
import { StatusPill } from "@/components/dashboard/StatusPill";
import { Button } from "@/components/ui/Button";
import { DatePicker } from "@/components/ui/DatePicker";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import toast from "react-hot-toast";
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { SuccessModal } from '@/components/common/SuccessModal';
import EmptyState from "@/components/common/EmptyState";
import { motion, AnimatePresence } from 'framer-motion';

const ANNOUNCEMENT_TYPES = ['banner', 'info', 'warning', 'success', 'urgent'];

export default function AdminAnnouncementsPage() {
    const { userProfile } = useAuth();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [annToToDelete, setAnnToToDelete] = useState<string | null>(null);

    // Create / Edit State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAnn, setCurrentAnn] = useState<Partial<Announcement> | null>(null);
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

    useEffect(() => {
        if (userProfile?.role === 'admin' || userProfile?.role === 'staff') {
            loadAnnouncements();
        }
    }, [userProfile]);

    const loadAnnouncements = async () => {
        try {
            setLoading(true);
            const data = await getAnnouncements(false); // Fetch all, not just active
            setAnnouncements(data);
        } catch (error) {
            console.error("Error loading announcements:", error);
            toast.error("Failed to load announcements");
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be less than 5MB");
            return;
        }

        try {
            setIsUploading(true);
            const downloadUrl = await uploadAnnouncementImage(file);
            setCurrentAnn(prev => prev ? { ...prev, bgImage: downloadUrl } : null);
            toast.success("Banner image uploaded");
        } catch (error) {
            toast.error("Upload failed. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async () => {
        if (!currentAnn?.title || !currentAnn?.content) {
            toast.error("Title and content are required");
            return;
        }

        try {
            setIsSaving(true);
            const data = {
                title: currentAnn.title || '',
                content: currentAnn.content || '',
                type: (currentAnn.type || 'banner') as Announcement['type'],
                active: currentAnn.active ?? true,
                link: currentAnn.link || '',
                tag: currentAnn.tag || '',
                ctaText: currentAnn.ctaText || '',
                secondaryLink: currentAnn.secondaryLink || '',
                secondaryCtaText: currentAnn.secondaryCtaText || '',
                bgImage: currentAnn.bgImage || '',
                order: Number(currentAnn.order) || 0,
                expiresAt: currentAnn.expiresAt ? new Date(currentAnn.expiresAt) : undefined
            };

            if (currentAnn.id) {
                await updateAnnouncement(currentAnn.id, data);
                toast.success("Announcement updated");
            } else {
                await createAnnouncement(data);
                toast.success("Announcement created");
            }
            setIsModalOpen(false);
            setCurrentAnn(null);
            await loadAnnouncements();
        } catch (error) {
            console.error("Error saving announcement:", error);
            toast.error("Failed to save announcement");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!annToToDelete) return;
        try {
            setIsDeleting(true);
            await deleteAnnouncement(annToToDelete);
            toast.success("Announcement deleted");
            setAnnouncements(prev => prev.filter(a => a.id !== annToToDelete));
            setAnnToToDelete(null);
        } catch (error) {
            toast.error("Failed to delete announcement");
        } finally {
            setIsDeleting(false);
        }
    };

    if (userProfile?.role !== 'admin' && userProfile?.role !== 'staff') {
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
                <DashboardHeader
                    title="Announcement Management"
                    subtitle="Manage the banners and alerts shown to all users."
                >
                    <Button
                        variant="premium"
                        className="rounded-xl"
                        leftIcon={<Plus className="w-5 h-5" />}
                        onClick={() => {
                            setCurrentAnn({
                                title: '',
                                content: '',
                                type: 'banner',
                                active: true,
                                order: 0
                            });
                            setIsModalOpen(true);
                        }}
                    >
                        Create Announcement
                    </Button>
                </DashboardHeader>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <RefreshCw className="w-10 h-10 animate-spin text-primary" />
                    </div>
                ) : announcements.length === 0 ? (
                    <EmptyState
                        title="No Announcements Found"
                        description="Start by creating an announcement or banner for your users."
                    />
                ) : (
                    <Card className="overflow-hidden border-none shadow-premium">
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left text-sm border-collapse">
                                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-700">
                                    <tr>
                                        <th className="px-6 py-4">Title & Type</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {announcements.map((ann) => (
                                        <tr key={ann.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg ${ann.type === 'banner' ? 'bg-navy-100 text-navy-600' : 'bg-gold-100 text-gold-600'}`}>
                                                        <Megaphone className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900 dark:text-white">{ann.title}</div>
                                                        <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-bold">{ann.type} {ann.order !== undefined && `• Order: ${ann.order}`}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <StatusPill status={ann.active ? 'success' : 'pending'} />
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="w-8 h-8 text-slate-400 hover:text-primary transition-colors"
                                                        onClick={() => {
                                                            setCurrentAnn(ann);
                                                            setIsModalOpen(true);
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
                                                                title: 'Delete Announcement',
                                                                message: 'Are you sure you want to delete this announcement?',
                                                                type: 'error',
                                                                confirmLabel: 'Delete',
                                                                onConfirm: () => {
                                                                    setAnnToToDelete(ann.id!);
                                                                    handleDelete();
                                                                }
                                                            });
                                                        }}
                                                        className="w-8 h-8 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
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

                        {/* Mobile Card View */}
                        <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
                            {announcements.map((ann) => (
                                <div key={ann.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2.5 rounded-xl ${ann.type === 'banner' ? 'bg-navy-100 text-navy-600' : 'bg-gold-100 text-gold-600'}`}>
                                                <Megaphone className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900 dark:text-white leading-tight">{ann.title}</div>
                                                <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-bold">{ann.type} {ann.order !== undefined && `• Order: ${ann.order}`}</div>
                                            </div>
                                        </div>
                                        <StatusPill status={ann.active ? 'success' : 'pending'} />
                                    </div>

                                    <div className="flex items-center justify-end gap-3 pt-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="rounded-lg h-9 px-4 text-xs font-bold border-slate-200"
                                            leftIcon={<Edit className="w-3.5 h-3.5" />}
                                            onClick={() => {
                                                setCurrentAnn(ann);
                                                setIsModalOpen(true);
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="rounded-lg h-9 px-4 text-xs font-bold text-red-500 hover:text-red-600 border-red-100 hover:bg-red-50"
                                            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                                            onClick={() => {
                                                setSuccessModal({
                                                    isOpen: true,
                                                    title: 'Delete Announcement',
                                                    message: 'Are you sure you want to delete this announcement?',
                                                    type: 'error',
                                                    confirmLabel: 'Delete',
                                                    onConfirm: () => {
                                                        setAnnToToDelete(ann.id!);
                                                        handleDelete();
                                                    }
                                                });
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {/* MODAL */}
                {isModalOpen && currentAnn && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
                        <Card className="w-full max-w-6xl shadow-2xl my-8 flex-shrink-0">
                            <CardContent className="p-0 flex flex-col h-[90vh]">
                                {/* Preview Section - Now on top for full width */}
                                <div className="w-full bg-slate-900 p-6 md:p-10 border-b border-white/5 overflow-y-auto">
                                    <span className="text-xs font-bold uppercase tracking-widest text-white/40 mb-6 block text-center">Visual Preview (Banner Style)</span>

                                    <div className="max-w-5xl mx-auto w-full">
                                        <section className="relative overflow-hidden rounded-2xl bg-[#003399] p-10 sm:p-14 flex items-center justify-between min-h-[340px] shadow-2xl">
                                            <div
                                                className="absolute inset-0 z-0 pointer-events-none bg-repeat opacity-100"
                                                style={{
                                                    backgroundImage: "url('/Cargofly motif_transparent.png')",
                                                    backgroundSize: '200px'
                                                }}
                                            />
                                            <div className="z-20 relative space-y-6">
                                                {currentAnn.tag && (
                                                    <span className="inline-block px-3 py-1 bg-gold-500 text-navy-900 text-[10px] font-bold uppercase tracking-[0.2em] rounded">
                                                        {currentAnn.tag}
                                                    </span>
                                                )}
                                                <h2 className="text-white text-4xl font-display font-medium leading-[1.1] tracking-tight">
                                                    {currentAnn.title || "Announcement Title"}
                                                </h2>
                                                <p className="text-white/80 max-w-sm text-lg leading-relaxed">
                                                    {currentAnn.content || "Your message will appear here for users to see automatically."}
                                                </p>
                                                <div className="pt-2">
                                                    <button className="bg-gold-500 text-navy-900 px-8 py-3.5 rounded-xl font-bold text-sm shadow-xl shadow-gold-500/20">
                                                        {currentAnn.ctaText || "Learn More"}
                                                    </button>
                                                </div>
                                            </div>
                                            <div
                                                className="absolute right-0 top-0 h-full w-1/3 sm:w-1/2 opacity-100 pointer-events-none z-10"
                                                style={{
                                                    backgroundImage: `url('${currentAnn.bgImage || '/Cargofly.jpg'}')`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center',
                                                    maskImage: 'linear-gradient(to left, black 60%, transparent 100%)',
                                                    WebkitMaskImage: 'linear-gradient(to left, black 60%, transparent 100%)'
                                                }}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-[#003399]/40 to-transparent" />
                                            </div>
                                        </section>
                                    </div>
                                </div>

                                {/* Editor Section */}
                                <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-slate-900 overflow-y-auto p-6 md:p-8 scrollbar-hide">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                                        {currentAnn.id ? 'Edit Announcement' : 'New Announcement'}
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Announcement Title</Label>
                                            <Input
                                                value={currentAnn.title || ''}
                                                onChange={(e) => setCurrentAnn({ ...currentAnn, title: e.target.value })}
                                                placeholder="Enter title..."
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Type</Label>
                                                <select
                                                    className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/20"
                                                    value={currentAnn.type || 'banner'}
                                                    onChange={(e) => setCurrentAnn({ ...currentAnn, type: e.target.value as any })}
                                                >
                                                    {ANNOUNCEMENT_TYPES.map(t => (
                                                        <option key={t} value={t}>{t.toUpperCase()}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Tag (Optional)</Label>
                                                <Input
                                                    value={currentAnn.tag || ''}
                                                    onChange={(e) => setCurrentAnn({ ...currentAnn, tag: e.target.value })}
                                                    placeholder="e.g. NEW, UPDATE"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Content</Label>
                                            <Textarea
                                                value={currentAnn.content || ''}
                                                onChange={(e) => setCurrentAnn({ ...currentAnn, content: e.target.value })}
                                                placeholder="Announcement content..."
                                                rows={3}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Primary Link (URL)</Label>
                                                <Input
                                                    value={currentAnn.link || ''}
                                                    onChange={(e) => setCurrentAnn({ ...currentAnn, link: e.target.value })}
                                                    placeholder="/dashboard/shipments"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>CTA Text</Label>
                                                <Input
                                                    value={currentAnn.ctaText || ''}
                                                    onChange={(e) => setCurrentAnn({ ...currentAnn, ctaText: e.target.value })}
                                                    placeholder="Learn More"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Display Order</Label>
                                                <Input
                                                    type="number"
                                                    value={currentAnn.order || 0}
                                                    onChange={(e) => setCurrentAnn({ ...currentAnn, order: parseInt(e.target.value) })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <DatePicker
                                                    label="Expiry Date (Optional)"
                                                    value={currentAnn.expiresAt instanceof Date ? currentAnn.expiresAt : (currentAnn.expiresAt ? new Date(currentAnn.expiresAt) : undefined)}
                                                    onChange={(date) => setCurrentAnn({ ...currentAnn, expiresAt: date })}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Banner Image (Recommended 1200x400)</Label>
                                            <div
                                                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl transition-all cursor-pointer ${isUploading ? 'border-primary/50 bg-primary/5' : 'border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                                    }`}
                                                onClick={() => document.getElementById('image-upload')?.click()}
                                            >
                                                <div className="space-y-1 text-center">
                                                    {currentAnn.bgImage ? (
                                                        <div className="relative inline-block">
                                                            <img
                                                                src={currentAnn.bgImage}
                                                                alt="Preview"
                                                                className="h-20 w-auto rounded-lg object-cover mb-2 border border-slate-100"
                                                            />
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setCurrentAnn({ ...currentAnn, bgImage: '' });
                                                                }}
                                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <ImageIcon className="mx-auto h-10 w-10 text-slate-300" />
                                                    )}

                                                    <div className="flex text-sm text-slate-600 dark:text-slate-400">
                                                        <span className="relative font-bold text-primary hover:text-primary-hover focus-within:outline-none">
                                                            {isUploading ? 'Uploading...' : 'Upload Image'}
                                                        </span>
                                                        {!isUploading && (
                                                            <p className="pl-1">or drag and drop</p>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-slate-500">PNG, JPG up to 5MB</p>
                                                </div>
                                                <input
                                                    id="image-upload"
                                                    type="file"
                                                    className="sr-only"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    disabled={isUploading}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 pt-2">
                                            <input
                                                type="checkbox"
                                                id="isActive"
                                                checked={currentAnn.active ?? true}
                                                onChange={(e) => setCurrentAnn({ ...currentAnn, active: e.target.checked })}
                                                className="w-4 h-4 rounded border-slate-300 text-primary"
                                            />
                                            <Label htmlFor="isActive" className="font-bold cursor-pointer">Active</Label>
                                        </div>
                                    </div>

                                    <div className="flex justify-start gap-3 mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setIsModalOpen(false);
                                                setCurrentAnn(null);
                                            }}
                                            disabled={isSaving || isUploading}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="premium"
                                            onClick={handleSave}
                                            loading={isSaving}
                                            disabled={isUploading}
                                        >
                                            {currentAnn.id ? 'Update' : 'Create'}
                                        </Button>
                                    </div>
                                </div>

                            </CardContent>
                        </Card>
                    </div>
                )}

                <SuccessModal
                    isOpen={successModal.isOpen}
                    onClose={() => setSuccessModal(prev => ({ ...prev, isOpen: false }))}
                    title={successModal.title}
                    message={successModal.message}
                    type={successModal.type}
                    onConfirm={successModal.onConfirm}
                    confirmLabel={successModal.confirmLabel}
                />
            </div>
        </div>
    );
}
