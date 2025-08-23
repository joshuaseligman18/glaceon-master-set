import { auth } from "@/auth";
import { redirect } from "next/navigation";

const CollectionHistoryPage: React.FC = async () => {
    const session = await auth();
    if (!session) return redirect("/");

    return <h1>Collection history page</h1>;
};

export default CollectionHistoryPage;
