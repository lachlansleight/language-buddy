import axios from "axios";
import OpenAI from "openai";
import { useCallback, useRef, useState } from "react";
import { FaPause, FaPlay, FaSync } from "react-icons/fa";
import HoverableText from "./HoverableText";

const AssistantMessage = ({
    message,
    audioPlaying,
    onPlay,
    onPause,
    onCharacterHoverOn,
    onCharacterHoverOff
}: {
    message: OpenAI.ChatCompletionMessageParam;
    audioPlaying: boolean;
    onPlay: () => void;
    onPause: () => void;
    onCharacterHoverOn: (index: number, character: string, position: {x: number, y: number}) => void;
    onCharacterHoverOff: () => void;
}): JSX.Element => {
    const [translation, setTranslation] = useState("");
    const [loadingTranslation, setLoadingTranslation] = useState(false);

    const getTranslation = useCallback(async () => {
        if (loadingTranslation) return;
        setLoadingTranslation(true);

        const response = await axios.post("/api/translate", { message: message.content as string });
        setTranslation(response.data.text);

        setLoadingTranslation(false);
    }, [message, loadingTranslation]);

    return (
        <div className={`flex flex-col w-3/4`}>
            {/* <audio src={`data:audio/mp3;base64,${audio}`} autoPlay onPlay={() => setAudioPlaying(true)} onEnded={() => setAudioPlaying(false)} ref={audioRef} /> */}
            <div className="flex gap-2 justify-start">
                <p className={`rounded p-2 bg-neutral-800`}><HoverableText message={message.content as string} onHover={onCharacterHoverOn} onExit={onCharacterHoverOff} /></p>
                <div className="mt-3 flex flex-col items-center gap-4">
                    <button
                        className=""
                        onClick={() => {
                            if (audioPlaying) onPause();
                            else onPlay();
                        }}
                    >
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
                    <button
                        onClick={() => {
                            getTranslation();
                        }}
                    >
                        Translate
                    </button>
                )}
            </div>
        </div>
    );
};

export default AssistantMessage;
