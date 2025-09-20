import { auth } from "@/auth";
import { redirect } from "next/navigation";

const Home: React.FC = async () => {
    const session = await auth();
    if (session) return redirect("/collection");

    return <div className="text-center">Welcome, sign in to continue.</div>;
};

export default Home;
