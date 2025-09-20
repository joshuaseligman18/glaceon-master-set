import mongoose from "mongoose";
import { User } from "next-auth";
import { ICardSet } from "./cardSet";

export interface ICard extends mongoose.Document {
    source: "api" | "manual";
    pokemonName?: string;
    tcgId?: string;
    cardName: string;
    cardNumber: string;
    imageLink?: string;
    cardType: "normal" | "holofoil" | "reverseHolofoil";
    cardSet?: ICardSet;
    priceChartingUrl?: string;
    createdBy?: User;
}

const CardSchema = new mongoose.Schema<ICard>({
    source: {
        type: String,
        required: true,
    },
    pokemonName: {
        type: String,
        required: false,
    },
    tcgId: {
        type: String,
        required: false,
    },
    cardName: {
        type: String,
        required: true,
    },
    cardNumber: {
        type: String,
        required: true,
    },
    imageLink: {
        type: String,
        required: false,
    },
    cardType: {
        type: String,
        required: true,
    },
    cardSet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CardSet",
        required: false,
    },
    priceChartingUrl: {
        type: String,
        required: false,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
});

CardSchema.index({ cardSet: 1, cardNumber: 1, cardType: 1 }, { unique: true });

CardSchema.virtual("prices", {
    ref: "Price",
    localField: "_id",
    foreignField: "card",
});
CardSchema.set("toObject", { virtuals: true });
CardSchema.set("toJSON", { virtuals: true });

export default mongoose.models.Card ||
    mongoose.model<ICard>("Card", CardSchema);
