import StatusDropdown from './StatusDropdown';

// ... existing imports ...

export default function AdminShipmentsPage() {
    // ... existing state ...
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    // ... existing code ...

    const handleStatusChange = async (shipmentId: string, newStatus: string) => {
        setUpdatingId(shipmentId);
        try {
            await updateShipmentStatus(
                shipmentId,
                newStatus as any,
                "Updated via Admin Dashboard", // Default location/note for inline update
                "Status Update",
                userProfile?.email || 'Admin',
                userProfile?.uid
            );
            // Optimistic update or refetch
            setShipments(prev => prev.map(s =>
                s.id === shipmentId ? { ...s, status: newStatus } : s
            ));
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        } finally {
            setUpdatingId(null);
        }
    };

    // ... existing code ...

                                        <td className="px-4 py-4 dark:text-slate-300">
                                            {formatDate(shipment.createdAt)}
                                        </td>
                                        <td className="px-4 py-4">
                                            <StatusDropdown 
                                                currentStatus={shipment.status}
                                                onStatusChange={(newStatus) => handleStatusChange(shipment.id, newStatus)}
                                                loading={updatingId === shipment.id}
                                            />
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => openUpdateModal(shipment)}
                                                    className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md text-slate-500 hover:text-blue-600 transition-colors"
                                                    title="Edit Details"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr >
                                ))
                            ) : (
// ... empty state ...

