import Footer from "@/lib/components/footer";
import Navbar from "@/lib/components/navbar";
import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
    title: "Glaceon Master Set",
    description: "Tool for tracking a collection of Glaceon cards",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="flex flex-col min-h-screen w-full">
                <Navbar />
                <div className="mx-5">{children}</div>
                <Footer />
            </body>
        </html>
    );
}
