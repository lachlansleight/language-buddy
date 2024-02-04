import { simplifyMessage } from "api/simplify/simplify";
import Server from "next/server";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";

const getNaiveResponse = async (openai: OpenAI, messages: ChatCompletionMessageParam[]) => {
    const completion = await openai.chat.completions.create({
        messages,
        model: "gpt-4-0125-preview",
    });
    return completion.choices[0].message.content || "";
}

const getAnyErrors = async (openai: OpenAI, question: string, response: string) => {
    const completion = await openai.chat.completions.create({
        messages: [{ 
            role: "system", 
            content: "You are a polite language tutor. I'll give you a chinese question + response pair. If there are any errors in the response, please point them out and correct them as concisely as possible. If there are no errors, simply respond 'no error'. Your responses must always be in english."
        }, {
            role: "assistant",
            content: question
        }, {
            role: "user",
            content: response
        }],
        model: "gpt-4-0125-preview",
    });
    return completion.choices[0].message.content || "";
}

export const POST = async (req: Request) => {
    const body = await req.json();

    const messages: ChatCompletionMessageParam[] = body.messages;
    const openai = new OpenAI();
    const responses = await Promise.all([
        getNaiveResponse(openai, messages),
        getAnyErrors(openai, messages.slice(-2)[0].content as string, messages.slice(-1)[0].content as string)
    ]);
    const responseText = responses[1].toLowerCase().includes("no error") ? responses[0] : responses[1];
    console.log("Got response: " + responseText);
    const simplified = await simplifyMessage(responseText);
    console.log("Simplified form : " + simplified);

    const mp3 = await openai.audio.speech.create({
        model: body.hd ? "tts-1-hd" : "tts-1",
        voice: body.voice || "shimmer",
        input: simplified,
        response_format: "mp3",
        speed: body.speed || 1.0,
    });
    const buffer = Buffer.from(await mp3.arrayBuffer());
    const audio = buffer.toString("base64");
    console.log("Finished converting message to audio");

    return Server.NextResponse.json({ text: simplified, audio });
};
