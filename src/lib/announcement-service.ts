/**
 * Announcement Service
 * Handles administrative announcement CRUD operations
 */

import {
    collection,
    doc,
    addDoc,
    updateDoc,
    getDocs,
    query,
    where,
    orderBy,
    Timestamp,
    deleteDoc,
    onSnapshot
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

// Types
export interface Announcement {
    id: string;
    title: string;
    content: string;
    type: 'info' | 'warning' | 'success' | 'urgent' | 'banner';
    active: boolean;
    link?: string;
    tag?: string;
    ctaText?: string;
    secondaryLink?: string;
    secondaryCtaText?: string;
    bgImage?: string;
    order?: number;
    createdAt: Date;
    updatedAt: Date;
    expiresAt?: Date;
}

export interface CreateAnnouncementData {
    title: string;
    content: string;
    type: Announcement['type'];
    active: boolean;
    link?: string;
    tag?: string;
    ctaText?: string;
    secondaryLink?: string;
    secondaryCtaText?: string;
    bgImage?: string;
    order?: number;
    expiresAt?: Date;
}

/**
 * Create a new announcement
 */
export async function createAnnouncement(data: CreateAnnouncementData): Promise<string> {
    const now = Timestamp.now();
    const announcementData = {
        ...data,
        createdAt: now,
        updatedAt: now,
        expiresAt: data.expiresAt ? Timestamp.fromDate(data.expiresAt) : null,
    };

    const docRef = await addDoc(collection(db, 'announcements'), announcementData);
    return docRef.id;
}

/**
 * Get all announcements
 */
export async function getAnnouncements(activeOnly = true): Promise<Announcement[]> {
    const announcementsRef = collection(db, 'announcements');
    let q = query(announcementsRef);

    if (activeOnly) {
        q = query(announcementsRef, where('active', '==', true));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        expiresAt: doc.data().expiresAt?.toDate(),
    }))
        .sort((a: any, b: any) => {
            const orderDiff = (Number(a.order) || 0) - (Number(b.order) || 0);
            if (orderDiff !== 0) return orderDiff;
            const timeA = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
            const timeB = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
            return timeB - timeA;
        }) as Announcement[];
}

/**
 * Subscribe to active announcements
 */
export function subscribeToAnnouncements(callback: (announcements: Announcement[]) => void): () => void {
    const q = query(
        collection(db, 'announcements'),
        where('active', '==', true)
    );

    return onSnapshot(q, (snapshot) => {
        const announcements = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate(),
            expiresAt: doc.data().expiresAt?.toDate(),
        })) as Announcement[];
        callback(announcements);
    });
}

/**
 * Update an announcement
 */
export async function updateAnnouncement(id: string, data: Partial<CreateAnnouncementData>): Promise<void> {
    const announcementRef = doc(db, 'announcements', id);
    const updates: any = {
        ...data,
        updatedAt: Timestamp.now(),
    };

    if (data.expiresAt) {
        updates.expiresAt = Timestamp.fromDate(data.expiresAt);
    }

    await updateDoc(announcementRef, updates);
}

/**
 * Delete an announcement
 */
export async function deleteAnnouncement(id: string): Promise<void> {
    await deleteDoc(doc(db, 'announcements', id));
}

/**
 * Upload announcement banner image
 */
export async function uploadAnnouncementImage(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `announcement_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const storageRef = ref(storage, `announcements/${fileName}`);

    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
}
