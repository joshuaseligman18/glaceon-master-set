import { auth } from "@/auth";
import dbConnect from "@/lib/database";
import Card from "@/lib/database/models/card";
import CardSet from "@/lib/database/models/cardSet";
import { TableData } from "@/lib/types/tableData";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest): Promise<NextResponse> {
    try {
        await dbConnect();

        const session = await auth();
        if (!session) {
            return NextResponse.json("User is not authenticated", {
                status: 401,
            });
        }

        const apiTableData = await CardSet.aggregate([
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

        const manualTableData = await Card.aggregate([
            { $match: { source: "manual" } },
            {
                $lookup: {
                    from: "prices",
                    localField: "_id",
                    foreignField: "card",
                    as: "prices",
                    pipeline: [{ $sort: { date: -1 } }, { $limit: 2 }],
                },
            },
        ]);

        const tableData: TableData = {
            apiData: apiTableData,
            manualData: manualTableData,
        };

        return NextResponse.json(tableData);
    } catch (err: any) {
        return NextResponse.json(err, { status: 500 });
    }
}
