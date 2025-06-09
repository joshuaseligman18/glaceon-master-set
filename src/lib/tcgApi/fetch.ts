import axios from "axios";
import { z } from "zod/v4";
import queries from "./queries";
import { TcgCard, ZTcgResponse } from "./types";

const TCG_API_URL: string = "https://api.pokemontcg.io/v2/cards";

export async function fetchTcgCards(): Promise<Map<string, TcgCard[]>> {
    const resMap: Map<string, TcgCard[]> = new Map();

    for (const query of queries) {
        try {
            const res = await axios.get(TCG_API_URL, {
                headers: {
                    "Content-Type": "application/json",
                    "X-Api-Key": process.env.TCG_API_KEY!,
                },
                params: {
                    q: query.Query,
                    select: "id,name,set,number,images,tcgplayer",
                },
            });

            const resData: TcgCard[] = (
                await z.parseAsync(ZTcgResponse, res.data)
            ).data;
            resMap.set(query.PokemonName, resData);
        } catch (err: any) {
            if (err instanceof Error) {
                throw err;
            } else {
                throw new Error(JSON.stringify(err));
            }
        }
    }

    return resMap;
}
