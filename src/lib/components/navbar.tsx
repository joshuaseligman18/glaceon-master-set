import Link from "next/link";

const Navbar: React.FC = () => {
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
                        <Link href="/collection">Collection</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Navbar;
