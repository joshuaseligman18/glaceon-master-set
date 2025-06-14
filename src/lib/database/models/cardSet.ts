import mongoose from "mongoose";

export interface ICardSet extends mongoose.Document {
    tcgId?: string;
    name: string;
    series: string;
    releaseDate: Date;
    priceChartingBaseUrl: string;
}

const CardSetSchema = new mongoose.Schema<ICardSet>({
    tcgId: {
        type: String,
        required: false,
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    series: {
        type: String,
        required: true,
    },
    releaseDate: {
        type: Date,
        required: true,
    },
    priceChartingBaseUrl: {
        type: String,
        required: true,
    },
});

export default mongoose.models.CardSet ||
    mongoose.model<ICardSet>("CardSet", CardSetSchema);
