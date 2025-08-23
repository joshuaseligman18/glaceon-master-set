import { auth } from "@/auth";
import dbConnect from "@/lib/database";
import Transaction, { ITransaction } from "@/lib/database/models/transaction";
import { HydratedDocument } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    try {
        const { id } = await params;
        await dbConnect();
        const session = await auth();
        if (!session) {
            return NextResponse.json("User is not authenticated", {
                status: 401,
            });
        }

        const userTransactions: HydratedDocument<ITransaction>[] =
            await Transaction.find({ user: session.user!.id, card: id }).sort({
                date: 1,
            });
        return NextResponse.json(userTransactions);
    } catch (err: any) {
        return NextResponse.json(err, { status: 500 });
    }
}
