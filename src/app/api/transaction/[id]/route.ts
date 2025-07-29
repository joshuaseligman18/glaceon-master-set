import { auth } from "@/auth";
import dbConnect from "@/lib/database";
import Transaction from "@/lib/database/models/transaction";
import { DeleteResult } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
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

        const deleteRes: DeleteResult = await Transaction.deleteOne({
            _id: id,
            user: session.user!.id,
        });
        if (deleteRes.deletedCount == 0) {
            return NextResponse.json({}, { status: 404 });
        } else {
            return NextResponse.json({}, { status: 202 });
        }
    } catch (err: any) {
        console.error(err);
        return NextResponse.json(err, { status: 500 });
    }
}
