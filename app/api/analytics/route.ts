// import { ConnectDB } from "@/app/lib/config/db";
// import AnalyticsModel from "@/app/lib/models/analyticsModel";
// import { NextApiRequest, NextApiResponse } from "next";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   await ConnectDB();
//   if (req.method !== "GET") {
//     return res.status(405).json({ message: "Method not allowed" });
//   }
  

//   try {
//     const data = await AnalyticsModel.aggregate([
//       {
//         $group: {
//           _id: "$page",
//           count: { $sum: 1 },
//         },
//       },
//       { $sort: { count: -1 } },
//     ]);

//     res.status(200).json(data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error fetching analytics data" });
//   }
// }
import { ConnectDB } from "@/app/lib/config/db";
import { NextResponse } from "next/server";
import AnalyticsModel from "@/app/lib/models/analyticsModel";

const LoadDB = async () => {
    await ConnectDB();
};

LoadDB();

export async function GET() {
    const analytics = await AnalyticsModel.find({});
    console.log("Analytics GET Hit");
    return NextResponse.json({ analytics });
}