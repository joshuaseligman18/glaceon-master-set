import dbConnect from "@/lib/database";
import CardSet from "@/lib/database/models/cardSet";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest): Promise<NextResponse> {
    try {
        await dbConnect();

        const tableData = await CardSet.aggregate([
            { $sort: { releaseDate: 1 } },
            {
                $lookup: {
                    from: "cards",
                    localField: "_id",
                    foreignField: "cardSet",
                    as: "cards",
                    pipeline: [
                        {
                            $addFields: {
                                cardNumberSort: {
                                    $cond: [
                                        {
                                            $regexMatch: {
                                                input: "$cardNumber",
                                                regex: "^\\d+$",
                                            },
                                        },
                                        { $toInt: "$cardNumber" },
                                        "$cardNumber",
                                    ],
                                },
                            },
                        },
                        {
                            $sort: { cardNumberSort: 1, cardType: 1 },
                        },
                        {
                            $lookup: {
                                from: "prices",
                                localField: "_id",
                                foreignField: "card",
                                as: "prices",
                                pipeline: [
                                    { $sort: { date: -1 } },
                                    { $limit: 2 },
                                ],
                            },
                        },
                    ],
                },
            },
        ]);

        return NextResponse.json(tableData);
    } catch (err: any) {
        return NextResponse.json(err, { status: 500 });
    }
}
