'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAddresses, addAddress, deleteAddress, SavedAddress } from '@/lib/dashboard-service';
import EmptyState from '@/components/common/EmptyState';
import { AddressAutocomplete } from '@/components/ui/AddressAutocomplete';
import { PhoneInput } from '@/components/ui/PhoneInput';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { SuccessModal } from '@/components/common/SuccessModal';

export default function AddressBookPage() {
    const { user } = useAuth();
    const [addresses, setAddresses] = useState<SavedAddress[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        label: 'Home',
        name: '',
        phone: '',
        email: '',
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        isDefault: false,
    });

    const [successModal, setSuccessModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        type: 'success' | 'error';
        onConfirm?: () => void;
        showConfirm?: boolean;
    }>({
        isOpen: false,
        title: '',
        message: '',
        type: 'success'
    });

    useEffect(() => {
        fetchAddresses();
    }, [user]);

    async function fetchAddresses() {
        if (!user) return;
        try {
            const data = await getAddresses(user.uid);
            setAddresses(data);
        } catch (error) {
            console.error('Error fetching addresses:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setSubmitting(true);
        try {
            await addAddress(user.uid, formData);
            setShowAddForm(false);
            setFormData({
                label: 'Home',
                name: '',
                phone: '',
                email: '',
                street: '',
                city: '',
                state: '',
                postalCode: '',
                country: '',
                isDefault: false,
            });
            await fetchAddresses();
            setSuccessModal({
                isOpen: true,
                title: 'Address Saved',
                message: 'New address has been added to your address book.',
                type: 'success'
            });
        } catch (error) {
            console.error('Error adding address:', error);
            setSuccessModal({
                isOpen: true,
                title: 'Save Failed',
                message: 'Failed to add address. Please try again.',
                type: 'error'
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        setSuccessModal({
            isOpen: true,
            title: 'Delete Address',
            message: `Are you sure you want to delete the address for "${name}"?`,
            type: 'error',
            showConfirm: true,
            onConfirm: async () => {
                try {
                    await deleteAddress(id);
                    setAddresses(prev => prev.filter(a => a.id !== id));
                    setSuccessModal({
                        isOpen: true,
                        title: 'Address Deleted',
                        message: 'The address has been removed from your address book.',
                        type: 'success'
                    });
                } catch (error) {
                    console.error('Error deleting address:', error);
                    setSuccessModal({
                        isOpen: true,
                        title: 'Delete Failed',
                        message: 'Failed to delete address. Please try again.',
                        type: 'error'
                    });
                }
            }
        });
    };

    return (
        <div className="flex-1 overflow-y-auto p-8 h-full bg-slate-50 dark:bg-background-dark">
            <DashboardHeader
                title="Address Book"
                subtitle="Manage your saved addresses for faster booking"
            />
            <div className="flex justify-end items-center mb-8">
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                    <span className="material-symbols-outlined">{showAddForm ? 'close' : 'add'}</span>
                    {showAddForm ? 'Cancel' : 'Add New Address'}
                </button>
            </div>

            <AnimatePresence>
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mb-8"
                    >
                        <form onSubmit={handleSubmit} className="bg-white dark:bg-surface-dark rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">New Address Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Label</label>
                                    <select name="label" value={formData.label} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white">
                                        <option value="Home">Home</option>
                                        <option value="Office">Office</option>
                                        <option value="Warehouse">Warehouse</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Contact Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white" />
                                </div>
                                <div>
                                    <PhoneInput
                                        id="phone"
                                        label="Phone"
                                        value={formData.phone}
                                        onChange={(val) => setFormData(prev => ({ ...prev, phone: val }))}
                                        placeholder="Phone Number"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white" />
                                </div>
                                <div className="md:col-span-2">
                                    <AddressAutocomplete
                                        id="street"
                                        label="Street Address"
                                        value={formData.street}
                                        onChange={(addr) => setFormData(prev => ({ ...prev, street: addr }))}
                                        placeholder="Enter full address..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">City</label>
                                    <input type="text" name="city" value={formData.city} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">State/Region</label>
                                    <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Postal Code</label>
                                    <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Country</label>
                                    <input type="text" name="country" value={formData.country} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white" />
                                </div>
                            </div>
                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50"
                                >
                                    {submitting ? 'Saving...' : 'Save Address'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-48 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
                    ))}
                </div>
            ) : addresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {addresses.map((addr) => (
                        <div key={addr.id} className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow relative group">
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleDelete(addr.id, addr.name)}
                                    className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-sm">delete</span>
                                </button>
                            </div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="material-symbols-outlined text-primary">
                                    {addr.label === 'Home' ? 'home' : addr.label === 'Office' ? 'business' : 'location_on'}
                                </span>
                                <span className="font-bold text-lg text-slate-900 dark:text-white">{addr.label}</span>
                                {addr.isDefault && (
                                    <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-bold">Default</span>
                                )}
                            </div>
                            <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{addr.name}</h4>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 leading-relaxed">
                                {addr.street}<br />
                                {addr.city}, {addr.state} {addr.postalCode}<br />
                                {addr.country}
                            </p>
                            <div className="flex flex-col gap-1 text-sm text-slate-500 dark:text-slate-400">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-xs">phone</span>
                                    {addr.phone}
                                </div>
                                {addr.email && (
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-xs">email</span>
                                        {addr.email}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-700 border-dashed">
                    <EmptyState
                        title="No saved addresses"
                        description="Add addresses to your book to autofill booking details."
                        action={
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                            >
                                Add Address
                            </button>
                        }
                    />
                </div>
            )}
            <SuccessModal
                isOpen={successModal.isOpen}
                onClose={() => setSuccessModal(prev => ({ ...prev, isOpen: false }))}
                title={successModal.title}
                message={successModal.message}
                type={successModal.type}
                showConfirm={successModal.showConfirm}
                onConfirm={successModal.onConfirm}
            />
        </div>
    );
}
