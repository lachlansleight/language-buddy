import Server from "next/server";
import fs from "fs";
import os from "os";
import { NextRestApiRoute, RestError } from "_lib/NextRestApiRoute";
import path from "path";
import OpenAI from "openai";
import { simplifyMessage } from "api/simplify/simplify";

export const POST = async (req: Request) => {
    const body = await req.json();

    console.log("Generating audio buffer from upload data");
    const rawAudio = Buffer.from(body.audio, "base64");

    const outputPath = path.join(os.tmpdir(), "output.mp3");
    fs.writeFileSync(outputPath, rawAudio);

    try {
        const openai = new OpenAI();
        const transcription = await openai.audio.transcriptions.create({
            file: fs.createReadStream(outputPath),
            model: "whisper-1",
            language: "zh",
        });
        console.log("Got transcription: " + transcription.text);
        const simplified = await simplifyMessage(transcription.text);
        console.log("Simplified form : " + simplified);
        return Server.NextResponse.json({ text: simplified });
    } catch (e: any) {
        throw new RestError("Failed to transcribe audio: " + e.message, 500);
    }
};
