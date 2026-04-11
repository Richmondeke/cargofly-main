const secretKey = "sk_test_8p41vygdnH58YrsHaRvz6LADTM6SHqkLthHfBr2z";
const trackingNumber = "CF-N4ZT4NSG";

async function check() {
    try {
        console.log("Checking Korapay for:", trackingNumber);
        const res2 = await fetch(`https://api.korapay.com/merchant/api/v1/transactions?limit=20`, {
            headers: { "Authorization": `Bearer ${secretKey}` }
        });
        const data2 = await res2.json();
        console.log("Transactions List Status:", data2.status);
        console.log("Keys in response:", Object.keys(data2));
        if (data2.data) {
            console.log("Keys in data:", Object.keys(data2.data));
            if (Array.isArray(data2.data)) {
                 console.log("Data is array, count:", data2.data.length);
                 const match = data2.data.find(tx => tx.metadata?.trackingNumber === trackingNumber);
                 if (match) console.log("FOUND:", JSON.stringify(match, null, 2));
            } else if (Array.isArray(data2.data.transactions)) {
                 console.log("Data.transactions is array, count:", data2.data.transactions.length);
                  const match = data2.data.transactions.find(tx => tx.metadata?.trackingNumber === trackingNumber);
                 if (match) console.log("FOUND:", JSON.stringify(match, null, 2));
            } else {
                 console.log("Data structure unknown:", JSON.stringify(data2.data).substring(0, 500));
            }
        }
    } catch (e) {
        console.error("Error:", e);
    }
}

check();
