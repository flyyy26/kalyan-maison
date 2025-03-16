import { NextResponse } from 'next/server';

export async function GET() {
    try {
        console.log("Fetching data from Umami...");

        const response = await fetch(`http://localhost:3000/api/websites/${process.env.UMAMI_WEBSITE_ID}/stats`, {
            headers: {
                "Authorization": `Bearer ${process.env.UMAMI_API_KEY}`,
                "Content-Type": "application/json",
            },
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error response from Umami:", errorText);
            throw new Error(`Gagal mengambil data dari Umami: ${response.status}`);
        }

        const data = await response.json();
        console.log("Data dari Umami:", data);

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Error saat fetching:", error);
        return NextResponse.json({ error: "Error API" }, { status: 500 });
    }
}
