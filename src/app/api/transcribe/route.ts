import Server from 'next/server';
import fs from "fs";
import { NextRestApiRoute, RestError } from "_lib/NextRestApiRoute";
import path from "path";
import OpenAI from "openai";

export const POST = async (req: Request) => {
    const body = await req.json();

    console.log("Generating audio buffer from upload data");
    const rawAudio = Buffer.from(body.audio, "base64");
    const outputPath = path.join(process.cwd(), "output.mp3");
    fs.writeFileSync(outputPath, rawAudio);

    try {
        const openai = new OpenAI();
        const transcription = await openai.audio.transcriptions.create({
            file: fs.createReadStream(outputPath),
            model: "whisper-1",
            language: "zh"
        });
        console.log("Got transcription: " + transcription.text);
        return Server.NextResponse.json(transcription);

    } catch (e: any) {
        throw new RestError("Failed to transcribe audio: " + e.message, 500);
    }
}
