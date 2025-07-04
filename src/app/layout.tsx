import Footer from "@/lib/components/footer";
import Navbar from "@/lib/components/navbar";
import type { Metadata } from "next";
import "./globals.css";

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
                {children}
                <Footer />
            </body>
        </html>
    );
}
