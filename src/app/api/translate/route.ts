import Server from "next/server";
import OpenAI from "openai";

const util = require("util");

export const POST = async (req: Request) => {
    const body = await req.json();

    const message = body.message;
    const openai = new OpenAI();
    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content:
                    "You are a translation assistant, responding with nothing more than the english translation of the provided message",
            },
            {
                role: "user",
                content: message,
            },
        ],
        model: "gpt-4-0125-preview",
    });
    const responseText = completion.choices[0].message.content || "";
    console.log("Translated message: " + responseText);

    return Server.NextResponse.json({ text: responseText });
};
