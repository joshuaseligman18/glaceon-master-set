import mongoose from "mongoose";
import { ICard } from "./card";

export interface IPrice extends mongoose.Document {
    card: ICard;
    date: Date;
    tgcMarketPrice?: number;
    priceChartingUngradedPrice?: number;
    priceChartingGrade7Price?: number;
    priceChartingGrade8Price?: number;
    priceChartingGrade9Price?: number;
    priceChartingGrade95Price?: number;
    priceChartingGrade10Price?: number;
}

const PriceSchema = new mongoose.Schema<IPrice>({
    card: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Card",
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    tgcMarketPrice: {
        type: Number,
        required: false,
    },
    priceChartingUngradedPrice: {
        type: Number,
        required: false,
    },
    priceChartingGrade7Price: {
        type: Number,
        required: false,
    },
    priceChartingGrade8Price: {
        type: Number,
        required: false,
    },
    priceChartingGrade9Price: {
        type: Number,
        required: false,
    },
    priceChartingGrade95Price: {
        type: Number,
        required: false,
    },
    priceChartingGrade10Price: {
        type: Number,
        required: false,
    },
});

export default mongoose.models.PriceSchema ||
    mongoose.model<IPrice>("Price", PriceSchema);
