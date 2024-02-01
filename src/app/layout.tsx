import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Language Buddy",
    description: "A language-learning listening and speaking partner powered by OpenAI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={`bg-black text-white ${inter.className}`}>
                {children}
            </body>
        </html>
    );
}
