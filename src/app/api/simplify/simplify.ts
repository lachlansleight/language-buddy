import Server from "next/server";
import OpenAI from "openai";

export const simplifyMessage = async (message: string) => {
    const openai = new OpenAI();
    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content:
                    "You convert chinese characters to their simplified forms and respond with the simplified text. Respond with the original message if no simplification is needed. Never add any new information. Leave any english in the message unchanged.",
            },
            {
                role: "user",
                content: message,
            },
        ],
        model: "gpt-4-0125-preview",
    });
    return completion.choices[0].message.content || "";
};

export const POST = async (req: Request) => {
    const body = await req.json();

    const message = body.message;
    const responseText = await simplifyMessage(message);
    console.log("Translated message: " + responseText);

    return Server.NextResponse.json({ text: responseText });
};
