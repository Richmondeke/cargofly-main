import React from 'react';
import { Plane, Activity, Thermometer, ShieldCheck, Package, Clock, Globe, Shield, Zap } from "lucide-react";

export interface ServiceDetail {
    slug: string;
    title: string;
    description: string;
    fullDescription: string;
    icon: React.ReactNode;
    features: string[];
    benefits: { title: string; description: string }[];
    stats: { label: string; value: string }[];
}

export const servicesData: Record<string, ServiceDetail> = {
    "global-air-freight": {
        slug: "global-air-freight",
        title: "Global Air Freight",
        description: "Priority handling and real-time monitoring for time-critical shipments across six continents.",
        fullDescription: "Our Global Air Freight service is engineered for businesses that cannot afford delays. We leverage a high-frequency network of commercial and cargo aircraft to ensure your goods reach their destination with unprecedented speed and reliability.",
        icon: React.createElement(Plane, { className: "w-8 h-8" }),
        features: [
            "Next-Flight-Out (NFO) priority",
            "Door-to-door transit monitoring",
            "Customs brokerage integration",
            "Charter & part-charter solutions"
        ],
        benefits: [
            { title: "Velocity", description: "Average transit times reduced by 30% compared to industry standards." },
            { title: "Visibility", description: "End-to-end milestone tracking with automated alerts." },
            { title: "Reliability", description: "99.8% on-time delivery rate across our global network." }
        ],
        stats: [
            { label: "Transit Time", value: "24-48h" },
            { label: "Countries", value: "190+" },
            { label: "Security", value: "Level 4" }
        ]
    },
    "aog-specialist": {
        slug: "aog-specialist",
        title: "AOG Specialist",
        description: "Dedicated 24/7 support for Aircraft on Ground logistics.",
        fullDescription: "When an aircraft is grounded, every second counts. Our AOG Specialist team provides a zero-latency response, moving critical components from turbines to tiny sensors with military-grade precision to keep your fleet in the air.",
        icon: React.createElement(Activity, { className: "w-8 h-8" }),
        features: [
            "24/7/365 Desk Operations",
            "On-Board Courier (OBC) options",
            "Immediate hangarage delivery",
            "Technical parts expertise"
        ],
        benefits: [
            { title: "Speed", description: "Response times under 15 minutes for any AOG request." },
            { title: "Precision", description: "Specialized handling for sensitive aerospace components." },
            { title: "Hangarage", description: "Direct-to-tech delivery protocols minimized downtime." }
        ],
        stats: [
            { label: "Response", value: "<15m" },
            { label: "Handovers", value: "100%" },
            { label: "Uptime", value: "24/7" }
        ]
    },
    "sensitive-cargo": {
        slug: "sensitive-cargo",
        title: "Sensitive Cargo",
        description: "Precision-controlled logistics for pharmaceuticals and high-value tech.",
        fullDescription: "We specialize in the transport of goods that require more than just a box. From life-saving vaccines to multi-million dollar semiconductor equipment, our Sensitive Cargo protocols ensure environmental stability and mechanical protection.",
        icon: React.createElement(Thermometer, { className: "w-8 h-8" }),
        features: [
            "Thermal mapping & monitoring",
            "Anti-vibration specialized fleet",
            "GDP & IATA CEIV compliant",
            "Real-time sensor telematics"
        ],
        benefits: [
            { title: "Integrity", description: "Zero-compromise temperature stability for pharma." },
            { title: "Protection", description: "Advanced shock-absorption for high-tech optics." },
            { title: "Compliance", description: "Full regulatory reporting for international standards." }
        ],
        stats: [
            { label: "Temp Range", value: "-20°C/+25°C" },
            { label: "Data Logs", value: "Second-ly" },
            { label: "Compliance", value: "100%" }
        ]
    },
    "secure-logistics": {
        slug: "secure-logistics",
        title: "Secure Logistics",
        description: "Military-grade security protocols for high-value assets.",
        fullDescription: "Cargofly's Secure Logistics division provides the ultimate shield for precious metals, high-value electronics, and sensitive documents. We combine physical security with advanced digital encryption for a truly impenetrable logistics chain.",
        icon: React.createElement(ShieldCheck, { className: "w-8 h-8" }),
        features: [
            "Armed escort capability",
            "Encrypted documentation (Blockchain)",
            "Discreet routing protocols",
            "Secure vault-to-vault transfer"
        ],
        benefits: [
            { title: "Chain of Custody", description: "Unbroken audit trail for every single touchpoint." },
            { title: "Discretion", description: "Non-descript vehicles and secure handover zones." },
            { title: "Insurance", description: "Comprehensive high-limit liability coverage." }
        ],
        stats: [
            { label: "Asset Value", value: "No Limit" },
            { label: "Monitoring", value: "Constant" },
            { label: "Incidents", value: "0" }
        ]
    }
};

export const productsData: Record<string, ServiceDetail> = {
    "cargo-os": {
        slug: "cargo-os",
        title: "CargoOS Platform",
        description: "The complete operating system for modern freight forwarders.",
        fullDescription: "CargoOS is not just a dashboard; it's a paradigm shift in logistics management. Designed for the complexities of modern trade, it unified booking, tracking, and compliance into a single, high-performance interface that empowers teams to move more with less.",
        icon: React.createElement(Zap, { className: "w-8 h-8" }),
        features: [
            "Dynamic booking engine",
            "Predictive ETA algorithms",
            "Automated bill of lading",
            "API for ERP integration"
        ],
        benefits: [
            { title: "Efficiency", description: "Automate 80% of repetitive documentation tasks." },
            { title: "Insights", description: "Advanced analytics for route and cost optimization." },
            { title: "Connectivity", description: "Seamless integration with your existing tech stack." }
        ],
        stats: [
            { label: "Users", value: "10k+" },
            { label: "Automation", value: "85%" },
            { label: "Efficiency", value: "+40%" }
        ]
    }
};
