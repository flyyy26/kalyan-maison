import { ConnectDB } from "@/app/lib/config/db";
import { NextRequest, NextResponse } from "next/server";
import AnalyticsModel from "@/app/lib/models/analyticsModel";

// Interface untuk request body
interface TrackRequestBody {
  page: string;
}

// API Route untuk tracking user
export async function POST(req: NextRequest) {
  try {
    // Koneksi ke database
    await ConnectDB();

    // Parse body dari request
    const body: TrackRequestBody = await req.json();
    if (!body.page) {
      return NextResponse.json({ message: "Page is required" }, { status: 400 });
    }

    // Ambil user agent & IP
    const userAgent = req.headers.get("user-agent") || "Unknown";
    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(',')[0] || req.headers.get("x-real-ip") || "Unknown";

    // Cek apakah halaman sudah ada di database
    const existingEntry = await AnalyticsModel.findOne({ page: body.page });

    if (existingEntry) {
      // Jika sudah ada, update count dan timestamp
      existingEntry.count += 1;
      existingEntry.userAgent = userAgent;
      existingEntry.ipAddress = ipAddress;
      existingEntry.timestamp = new Date();
      await existingEntry.save();
    } else {
      // Jika belum ada, buat entry baru
      await AnalyticsModel.create({ page: body.page, userAgent, ipAddress, timestamp: new Date() });
    }

    return NextResponse.json({ message: "User visit tracked" }, { status: 200 });
  } catch (error) {
    console.error("Error tracking visit:", error);
    return NextResponse.json({ message: "Error tracking visit" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await ConnectDB();
    const analyticsData = await AnalyticsModel.find().limit(10); // Ambil 10 data terakhir
    return NextResponse.json(analyticsData, { status: 200 });
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    return NextResponse.json({ message: "Error fetching data" }, { status: 500 });
  }
}