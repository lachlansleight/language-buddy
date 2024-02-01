import Server from 'next/server';
import OpenAI from "openai";

export const POST = async (req: Request) => {
    const body = await req.json();

    const messages = body.messages;
    const openai = new OpenAI();
    const completion = await openai.chat.completions.create({
        messages,
        model: "gpt-4-0125-preview",
    });
    const responseText = completion.choices[0].message.content || "";
    console.log("Got response: " + responseText);

    const mp3 = await openai.audio.speech.create({
        model: body.hd ? "tts-1-hd" : "tts-1",
        voice: body.voice || "shimmer",
        input: responseText,
        response_format: "mp3",
        speed: body.speed || 1.0,
    });
    const buffer = Buffer.from(await mp3.arrayBuffer());
    const audio = buffer.toString("base64");
    console.log("Finished converting message to audio");

    return Server.NextResponse.json({ text: responseText, audio });
}
