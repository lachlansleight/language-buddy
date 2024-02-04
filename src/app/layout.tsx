import "./globals.css";
import { Inter } from "next/font/google";
import { IoLanguage } from "react-icons/io5";
import packageJson from "../../package.json";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Language Buddy",
    description: "A language-learning listening and speaking partner powered by OpenAI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={`bg-black text-white ${inter.className}`}>
                <div className="h-8 flex justify-between items-center px-4 bg-neutral-900">
                    <div className="flex gap-2 items-center text-orange-400">
                        <span className="text-2xl"><IoLanguage /></span>
                        <span className="text-sm">LanguageBuddy</span>
                    </div>
                    <div className="text-white text-opacity-50 italic text-xs">
                        {packageJson.version}
                    </div>
                </div>
                {children}
            </body>
        </html>
    );
}
