
export const SHIPMENTS = [
    { id: '#SHP-2024-001', origin: 'Lagos, NG', destination: 'London, UK', status: 'In Transit', progress: 65, eta: '2 days' },
    { id: '#SHP-2024-002', origin: 'New York, US', destination: 'Abuja, NG', status: 'Pending', progress: 15, eta: '5 days' },
    { id: '#SHP-2024-003', origin: 'Dubai, UAE', destination: 'Lagos, NG', status: 'Delivered', progress: 100, eta: 'Delivered' },
    { id: '#SHP-2024-004', origin: 'Lagos, NG', destination: 'Accra, GH', status: 'In Transit', progress: 45, eta: '1 day' },
    { id: '#SHP-2024-005', origin: 'Shanghai, CN', destination: 'Kano, NG', status: 'Customs', progress: 80, eta: '3 days' },
    { id: '#SHP-2024-006', origin: 'Lagos, NG', destination: 'Toronto, CA', status: 'In Transit', progress: 30, eta: '6 days' },
];

export const MONTHLY_VOLUME = [
    { month: 'Jan', value: 450 },
    { month: 'Feb', value: 520 },
    { month: 'Mar', value: 480 },
    { month: 'Apr', value: 610 },
    { month: 'May', value: 590 },
    { month: 'Jun', value: 680 },
];

export const RECENT_ACTIVITY = [
    { id: 1, user: 'Alex Morgan', action: 'Approved shipment #SHP-2024-002', time: '10 mins ago' },
    { id: 2, user: 'System', action: 'Automated status update for #SHP-2024-001', time: '25 mins ago' },
    { id: 3, user: 'Sarah Connor', action: 'New booking request created', time: '1 hour ago' },
    { id: 4, user: 'Alex Morgan', action: 'Updated fleet maintenance schedule', time: '2 hours ago' },
];

export const CLAIMS = [
    { id: '#CLM-8832', type: 'Damaged Goods', status: 'Under Review', amount: '$450.00', date: 'Feb 12, 2024' },
    { id: '#CLM-9941', type: 'Late Delivery', status: 'Approved', amount: '$120.00', date: 'Feb 10, 2024' },
    { id: '#CLM-2219', type: 'Lost Package', status: 'Rejected', amount: '$850.00', date: 'Feb 05, 2024' },
];
