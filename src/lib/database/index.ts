import mongoose from "mongoose";
import "./models/card";
import "./models/cardSet";
import "./models/price";

interface DatabaseCache {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Mongoose> | null;
}

const cache: DatabaseCache = {
    conn: null,
    promise: null,
};

async function dbConnect(): Promise<mongoose.Connection> {
    if (cache.conn !== null) {
        return cache.conn;
    }

    if (cache.promise === null) {
        const opts: mongoose.ConnectOptions = {
            bufferCommands: false,
            dbName: "app",
        };
        cache.promise = mongoose.connect(process.env.MONGODB_URI!, opts);
    }

    try {
        cache.conn = (await cache.promise).connection;

        const requiredModels = ["CardSet", "Card", "Price"];
        for (const name of requiredModels) {
            if (!mongoose.modelNames().includes(name)) {
                throw new Error(`Model '${name}' not registered`);
            }
        }
    } catch (err: any) {
        if (err instanceof Error) {
            throw err;
        } else {
            throw new Error(JSON.stringify(err));
        }
    }
    return cache.conn;
}

export default dbConnect;
