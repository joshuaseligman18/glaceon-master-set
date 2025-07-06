import { auth } from "@/auth";
import { redirect } from "next/navigation";

const Home: React.FC = async () => {
    const session = await auth();
    if (session) return redirect("/collection");

    return <div>Welcome</div>;
};

export default Home;
