import Server from "next/server";
import OpenAI from "openai";

export const simplifyMessage = async (message: string) => {
    const openai = new OpenAI();
    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content:
                    "You return the input message unchanged, except with any traditional chinese characters converted to their simplified forms. If no traditional chinese characters exist in the input message, simply respond \"no changes\"",
            },
            {
                role: "user",
                content: message,
            },
        ],
        model: "gpt-4-0125-preview",
    });
    if((completion.choices[0].message.content as string).toLowerCase().includes("no changes")) {
        return message;
    }
    return completion.choices[0].message.content || "";
};

export const POST = async (req: Request) => {
    const body = await req.json();

    const message = body.message;
    const responseText = await simplifyMessage(message);
    console.log("Translated message: " + responseText);

    return Server.NextResponse.json({ text: responseText });
};
