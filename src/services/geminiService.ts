export const getLogisticsAdvice = async (query: string): Promise<string> => {
    try {
        const response = await fetch('/api/ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'logisticsAdvice', query }),
        });

        const data = await response.json();

        if (!response.ok) {
            return data.error || "I encountered an error while trying to process your request.";
        }

        return data.result;
    } catch (error) {
        console.error("Gemini API Fetch Error:", error);
        return "I encountered an error while trying to process your request. Please check your network connection or try again later.";
    }
};

export const summarizeShipmentStatus = async (shipmentData: Record<string, unknown>): Promise<string> => {
    try {
        const response = await fetch('/api/ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'summarizeShipment', data: shipmentData }),
        });

        const data = await response.json();

        if (!response.ok) {
            return data.error || "Could not summarize status.";
        }

        return data.result;
    } catch {
        return "Could not summarize status.";
    }
};
