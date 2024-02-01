import axios from "axios";
import OpenAI from "openai";
import { useCallback, useRef, useState } from "react";
import { FaPause, FaPlay, FaSync } from "react-icons/fa";

const AssistantMessage = ({
    message,
    audio
}: {
    message: OpenAI.ChatCompletionMessageParam,
    audio: string,
}): JSX.Element => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [audioPlaying, setAudioPlaying] = useState(false);
    const [translation, setTranslation] = useState("");
    const [loadingTranslation, setLoadingTranslation] = useState(false);

    const getTranslation = useCallback(async () => {
        if(loadingTranslation) return;
        setLoadingTranslation(true);

        const response = await axios.post("/api/translate", {message: message.content as string});
        setTranslation(response.data.text);

        setLoadingTranslation(false);
    }, [message, loadingTranslation]);

    return (
        <div className={`flex flex-col w-3/4`}>
            <audio src={`data:audio/mp3;base64,${audio}`} autoPlay onPlay={() => setAudioPlaying(true)} onEnded={() => setAudioPlaying(false)} ref={audioRef} />
            <div className="flex gap-2 justify-start">
                <p className={`rounded p-2 bg-neutral-800`}>{message.content as string}</p>
                <div className="mt-3 flex flex-col items-center gap-4">
                    <button className="" onClick={() => {
                        if(!audioRef.current) return;
                        if(audioPlaying) {
                            audioRef.current.pause();
                            audioRef.current.currentTime = 0;
                        } else audioRef.current.play();
                    }}>
                        {audioPlaying ? <FaPause /> : <FaPlay />}
                    </button>
                </div>
            </div>
            <div className="flex justify-start text-sm">
                {translation ? (
                    <p className="text-white text-opacity-60 italic mr-8">{translation}</p>
                ) : loadingTranslation ? (
                    <FaSync className="animate-spin" />  
                ) : (
                    <button onClick={() => {
                        getTranslation();
                    }}>Translate</button>
                )}
            </div>
        </div>
    )
}

export default AssistantMessage;