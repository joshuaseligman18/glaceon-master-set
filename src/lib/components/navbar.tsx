import { auth, signIn, signOut } from "@/auth";
import Link from "next/link";

const Navbar: React.FC = async () => {
    const session = await auth();

    if (session) {
        return (
            <div className="navbar bg-base-100 shadow-sm">
                <div className="flex-1">
                    <Link href="/collection" className="btn btn-ghost text-xl">
                        Glaceon Master Set
                    </Link>
                </div>
                <div className="flex-none">
                    <ul className="menu menu-horizontal px-1">
                        <li>
                            <Link href="/newCardForm">Add Card</Link>
                        </li>
                        <li>
                            <button
                                onClick={async () => {
                                    "use server";
                                    await signOut({ redirectTo: "/" });
                                }}
                            >
                                Sign Out
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        );
    } else {
        return (
            <div className="navbar bg-base-100 shadow-sm">
                <div className="flex-1">
                    <Link href="/" className="btn btn-ghost text-xl">
                        Glaceon Master Set
                    </Link>
                </div>
                <div className="flex-none">
                    <ul className="menu menu-horizontal px-1">
                        <li>
                            <button
                                onClick={async () => {
                                    "use server";
                                    await signIn(undefined, {
                                        redirectTo: "/collection",
                                    });
                                }}
                            >
                                Sign In
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
};

export default Navbar;
