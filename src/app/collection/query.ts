import { ZTableData } from "@/lib/types/tableData";
import { QueryClient, useQuery } from "@tanstack/react-query";

async function fetchPricingData() {
    const res = await fetch("/api/table");
    if (!res.ok) {
        throw new Error("Failed to fetch table data");
    }
    const data = await res.json();
    return ZTableData.parse(data);
}

export default function usePriceDataQuery() {
    return useQuery(
        {
            queryKey: ["usePriceData"],
            queryFn: fetchPricingData,
        },
        new QueryClient()
    );
}
