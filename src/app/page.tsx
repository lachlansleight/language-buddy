"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import VadRecorder, { VadRecorderState } from "_components/VadRecorder";
import OpenAI from "openai";
import CompactTextField from "_components/CompactTextAreaField";
import { FaMicrophone, FaSync } from "react-icons/fa";
import UserMessage from "_components/UserMessage";
import AssistantMessage from "_components/AssistantMessage";
import EnterWrapper from "_components/EnterWrapper";
import AudioPlayer from "_components/Base64AudioPlayer";
import debugConversation from "_lib/debugConversation";

export default function Chat() {
    const [ttsConfig, setTtsConfig] = useState<
        Partial<{
            hd: boolean;
            voice: "shimmer" | "alloy" | "echo" | "fable" | "onyx" | "nova";
            speed: number;
        }>
    >({
        voice: "shimmer",
        hd: false,
        speed: 1,
    });

    const [recorderActive, setRecorderActive] = useState(false);
    const [recorderState, setRecorderState] = useState<VadRecorderState>({
        listening: false,
        speaking: false,
        loading: false,
    });

    const baseSystemPrompt =
        "You are a bilingual language tutor helping me with my mandarin chinese practice. Respond to me in Chinese unless I make a mistake, in which case you should correct and clarify in English before proceeding in Chinese. Try to keep your language complexity at a similar level to mine. The situation we're roleplaying is: ";

    type ChatMessageWithExtras = OpenAI.ChatCompletionMessageParam & {
        id: number;
        audio?: string;
    };
    const [conversation, setConversation] = useState<ChatMessageWithExtras[]>(debugConversation);

    const [currentlyPlayingAudio, setCurrentlyPlayingAudio] = useState(-1);

    const [situation, setSituation] = useState(
        "You are a waiter and I am ordering food in a chinese restaurant."
    );

    useEffect(() => {
        setConversation(cur =>
            cur.map(m => {
                if (m.id === 0)
                    return {
                        ...m,
                        content: baseSystemPrompt + situation,
                    };
                return m;
            })
        );
    }, [situation]);

    const [everStarted, setEverStarted] = useState(false);
    const [status, setStatus] = useState<
        "waiting-for-user" | "recording" | "transcribing" | "responding"
    >("waiting-for-user");

    useEffect(() => {
        if (recorderActive) setEverStarted(true);
    }, [recorderActive]);

    const addUserMessage = (message: string, nextId: number) => {
        const doSend = async () => {
            const newConversation: ChatMessageWithExtras[] = [
                ...conversation,
                {
                    id: nextId,
                    role: "user",
                    content: message,
                },
            ];
            nextId++;
            setConversation(newConversation);
            setStatus("responding");
            const response = await axios.post("/api/respond", {
                messages: newConversation.map(m => ({
                    role: m.role,
                    content: m.content,
                })),
                ...ttsConfig,
            });
            console.log(response.data);
            setConversation(cur => [
                ...cur,
                {
                    id: nextId,
                    role: "assistant",
                    content: response.data.text,
                    audio: response.data.audio,
                },
            ]);
            setCurrentlyPlayingAudio(nextId);
            setStatus("waiting-for-user");
            setRecorderActive(true);
        };
        doSend();
    };

    return (
        <EnterWrapper>
            <div className="flex flex-col w-full max-w-md py-8 mx-auto stretch">
                {everStarted ? (
                    <div className={`flex flex-col items-start w-full h-24 my-4`}>
                        <label className="w-24 text-xs italic text-white text-opacity-60">
                            Situation
                        </label>
                        <p className="flex-grow border border-white border-opacity-20 rounded px-2 py-1">
                            {situation}
                        </p>
                    </div>
                ) : (
                    <CompactTextField
                        label="Situation"
                        value={situation}
                        onChange={setSituation}
                        className="w-full h-24 my-4"
                    />
                )}

                <VadRecorder
                    active={recorderActive}
                    onStateChange={setRecorderState}
                    onBeginTranscription={() => {
                        setRecorderActive(false);
                        setStatus("transcribing");
                    }}
                    onGetTranscription={t => addUserMessage(t, conversation.length)}
                    render={state => (
                        <div className="w-full flex flex-col items-center gap-2">
                            {state.error && <p>Error: {state.error}</p>}
                            {state.loading && <p>Loading</p>}
                            {state.listening ? (
                                <>
                                    <button
                                        className="w-72 text-lg bg-yellow-700 rounded p-1"
                                        onClick={() => setRecorderActive(false)}
                                    >
                                        Pause
                                    </button>
                                    <p
                                        className={`${state.speaking ? "text-green-600" : "text-yellow-600"} font-bold`}
                                    >
                                        {state.speaking ? "Recording" : "Waiting"}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <button
                                        className="w-72 text-lg bg-green-800 rounded p-1"
                                        onClick={() => setRecorderActive(true)}
                                    >
                                        {everStarted ? "Resume" : "Begin Situation"}
                                    </button>
                                    {everStarted && (
                                        <button
                                            className="w-72 text-lg bg-red-900 rounded p-1"
                                            onClick={() => {
                                                setEverStarted(false);
                                                setConversation([
                                                    {
                                                        id: 0,
                                                        role: "system",
                                                        content: baseSystemPrompt + situation,
                                                    },
                                                ]);
                                                setRecorderActive(false);
                                            }}
                                        >
                                            End Situation
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                />

                {/* <audio src={`data:audio/mp3;base64,${lastAudioBase64}`} autoPlay={true} onPlay={() => {
                    setRecorderActive(false);
                }} onEnded={() => {
                    setRecorderActive(true);
                }} /> */}

                <div className="flex flex-col gap-4">
                    {conversation
                        .filter(m => m.role !== "system")
                        .map((m, i) => {
                            return m.role === "user" ? (
                                <UserMessage key={i} message={m} />
                            ) : (
                                <AssistantMessage
                                    key={i}
                                    message={m}
                                    audioPlaying={currentlyPlayingAudio === m.id}
                                    onPlay={() => setCurrentlyPlayingAudio(m.id)}
                                    onPause={() => setCurrentlyPlayingAudio(-1)}
                                />
                            );
                        })}
                    {status === "waiting-for-user" && recorderState.listening && (
                        <div className={`flex flex-col gap-2 items-end`}>
                            <p
                                className={`rounded p-2 ${recorderState.speaking ? "border border-blue-800" : "bg-blue-800"}`}
                            >
                                {recorderState.speaking ? (
                                    <FaMicrophone className="text-2xl text-red-700" />
                                ) : (
                                    <FaMicrophone className="text-2xl" />
                                )}
                            </p>
                        </div>
                    )}
                    {status === "transcribing" && (
                        <div className={`flex flex-col gap-2 items-end`}>
                            <p className={`rounded p-2 bg-blue-800`}>
                                <FaSync className="text-2xl animate-spin" />
                            </p>
                        </div>
                    )}
                    {status === "responding" && (
                        <div className={`flex flex-col gap-2 items-start`}>
                            <p className={`rounded p-2 bg-neutral-800`}>
                                <FaSync className="text-2xl animate-spin" />
                            </p>
                        </div>
                    )}
                </div>

                <AudioPlayer
                    audioData={conversation.find(m => m.id === currentlyPlayingAudio)?.audio}
                    isPlaying={!!conversation.find(m => m.id === currentlyPlayingAudio)}
                    onEnded={() => setCurrentlyPlayingAudio(-1)}
                />

                {/* <pre>{JSON.stringify(conversation, null, 2)}</pre> */}
            </div>
        </EnterWrapper>
    );
}
