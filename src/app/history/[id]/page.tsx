import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CardHistory from "./history";

interface Params {
    params: Promise<{ id: string }>;
}

const CardHistoryPage: React.FC<Params> = async ({ params }) => {
    const { id } = await params;

    const session = await auth();
    if (!session) return redirect("/");

    return <CardHistory id={id} />;
};

export default CardHistoryPage;
