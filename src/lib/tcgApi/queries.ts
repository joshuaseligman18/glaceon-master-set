export interface TcgQuery {
    PokemonName: string;
    Query: string;
}

const queries: TcgQuery[] = [{ PokemonName: "Glaceon", Query: "name:glaceon" }];

export default queries;
