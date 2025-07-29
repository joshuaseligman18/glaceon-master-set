import { auth } from "@/auth";
import dbConnect from "@/lib/database";
import Transaction, { ITransaction } from "@/lib/database/models/transaction";
import { ZTransactionForm } from "@/lib/types/transactionForm";
import { HydratedDocument } from "mongoose";
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

        const userTransactions: HydratedDocument<ITransaction>[] =
            await Transaction.find({ user: session.user!.id }).sort({
                date: 1,
            });
        return NextResponse.json(userTransactions);
    } catch (err: any) {
        return NextResponse.json(err, { status: 500 });
    }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        await dbConnect();
        const session = await auth();
        if (!session) {
            return NextResponse.json("User is not authenticated", {
                status: 401,
            });
        }

        const data = await req.formData();
        const formData = ZTransactionForm.parse(
            Object.fromEntries(data.entries())
        );
        await Transaction.create({
            user: session.user!.id,
            card: formData.card,
            date: formData.date,
            grade: formData.grade,
            purchasePrice: formData.purchasePrice,
        });

        return NextResponse.json({}, { status: 201 });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json(err, { status: 500 });
    }
}
