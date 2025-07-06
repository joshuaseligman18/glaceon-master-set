import mongodbClient from "@/lib/database/mongodb";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth, { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";

const authConfig: NextAuthConfig = {
    adapter: MongoDBAdapter(mongodbClient, {
        databaseName: "app",
    }),
    providers: [GitHub],
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
