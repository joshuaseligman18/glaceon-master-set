import mongoose from "mongoose";
import { User } from "next-auth";
import { ICard } from "./card";

export interface ITransaction extends mongoose.Document {
    user: User;
    card: ICard;
    date: Date;
    grade: "10" | "9.5" | "9" | "8" | "7" | "Ungraded";
    purchasePrice: number;
}

const TransactionSchema = new mongoose.Schema<ITransaction>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    card: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Card",
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    grade: {
        type: String,
        required: true,
    },
    purchasePrice: {
        type: Number,
        required: true,
    },
});

export default mongoose.models.Transaction ||
    mongoose.model<ITransaction>("Transaction", TransactionSchema);
