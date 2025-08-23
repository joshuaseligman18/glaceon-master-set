import dbConnect from "@/lib/database";
import Card from "@/lib/database/models/card";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    try {
        const { id } = await params;
        await dbConnect();

        const cardId = new mongoose.Types.ObjectId(id);

        const historyData = await Card.aggregate([
            {
                $match: { _id: cardId },
            },
            {
                $lookup: {
                    from: "prices",
                    localField: "_id",
                    foreignField: "card",
                    as: "prices",
                    pipeline: [{ $sort: { date: 1 } }],
                },
            },
        ]);

        return NextResponse.json(historyData[0]);
    } catch (err: any) {
        return NextResponse.json(err, { status: 500 });
    }
}
