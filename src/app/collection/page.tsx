"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Table from "./table";

const queryClient: QueryClient = new QueryClient();

const CollectionPage: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="mx-5">
                <Table />
            </div>
        </QueryClientProvider>
    );
};

export default CollectionPage;
