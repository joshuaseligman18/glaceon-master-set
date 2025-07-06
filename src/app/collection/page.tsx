import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Table from "./table";

const CollectionPage: React.FC = async () => {
    const session = await auth();
    if (!session) return redirect("/");

    return <Table />;
};

export default CollectionPage;
