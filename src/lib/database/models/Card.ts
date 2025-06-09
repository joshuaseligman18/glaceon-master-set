import mongoose from "mongoose";

export interface Card extends mongoose.Document {
    source: "api" | "manual";
    pokemonName: string;
    tcgId: string;
    cardName: string;
    cardNumber: string;
    imageLink: string;
    cardType: string;
    tcgPlayerMarketPrice: number;
}

const CardSchema = new mongoose.Schema<Card>({
    source: {
        type: String,
        required: true,
    },
    pokemonName: {
        type: String,
        required: true,
    },
    tcgId: {
        type: String,
        required: false,
    },
    cardName: {
        type: String,
        required: false,
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
    tcgPlayerMarketPrice: {
        type: Number,
        required: false,
    },
});

export default mongoose.models.Card || mongoose.model<Card>("Card", CardSchema);
