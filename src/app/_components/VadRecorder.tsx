"use client";

import { useMicVAD } from "@ricky0123/vad-react";
import { useEffect, useState } from "react";
import { chunksToMp3 } from "_lib/audioEncode";
import audioBufferToWav from "audiobuffer-to-wav";
import axios from "axios";

export interface VadRecorderState {
    error?: string;
    loading: boolean;
    listening: boolean;
    speaking: boolean;
}

const DefaultVadRecorderRender = (state: VadRecorderState): JSX.Element => {
    return (
        <div>
            {state.error && <p className="text-red-300">{state.error}</p>}
            {state.loading && <p>Loading</p>}
            {!state.listening && <p className="text-red-700 font-bold">Inactive</p>}
            {state.listening && state.speaking && (
                <p className="text-green-700 font-bold">Speaking</p>
            )}
            {state.listening && !state.speaking && (
                <p className="text-yellow-700 font-bold">Waiting</p>
            )}
        </div>
    );
};

const VadRecorder = ({
    active,
    onStateChange,
    onBeginTranscription,
    onGetTranscription,
    render = DefaultVadRecorderRender,
}: {
    active: boolean;
    onStateChange: (newState: VadRecorderState) => void;
    onBeginTranscription?: () => void;
    onGetTranscription: (text: string) => void;
    render?: (state: VadRecorderState) => JSX.Element;
}): JSX.Element => {
    const [state, setState] = useState<VadRecorderState>({
        loading: false,
        listening: false,
        speaking: false,
    });

    const getFileAsBase64 = async (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                try {
                    const base64 = (reader.result as string).split(",")[1];
                    resolve(base64);
                } catch {
                    reject("Failed to get base64 string from audio data");
                }
            };
        });
    };

    const vad = useMicVAD({
        modelURL: "/silero_vad.onnx",
        workletURL: "/vad.worklet.bundle.min.js",
        startOnLoad: false,
        redemptionFrames: 30,
        onSpeechEnd: audio => {
            setState(cur => ({ ...cur, speaking: false }));
            const doUpload = async () => {
                if (onBeginTranscription) onBeginTranscription();
                const audioBuffer = new AudioBuffer({
                    sampleRate: 16000,
                    length: audio.length,
                    numberOfChannels: 1,
                });
                audioBuffer.getChannelData(0).set(audio);
                const asWav = audioBufferToWav(audioBuffer, {
                    sampleRate: 16000,
                    numberOfChannels: 1,
                });
                const asMp3 = await chunksToMp3([new Blob([asWav])]);
                const asFile = new File([asMp3], "recording.mp3");
                const data = await getFileAsBase64(asFile);
                const jsonUpload = { audio: data };
                const transcription = (
                    await axios.post("/api/transcribe", jsonUpload, {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    })
                ).data;
                onGetTranscription(transcription.text);
            };
            doUpload();
        },
        onSpeechStart: () => {
            setState(cur => ({ ...cur, speaking: true }));
        },
    });

    useEffect(() => {
        if (vad.errored) setState(cur => ({ ...cur, error: (vad.errored as any).message }));
        else setState(cur => ({ ...cur, error: undefined }));
    }, [vad.errored]);

    useEffect(() => {
        setState(cur => ({ ...cur, loading: vad.loading }));
    }, [vad.loading]);

    useEffect(() => {
        if (active && !vad.listening) vad.start();
        else if (!active && vad.listening) vad.pause();
        setState(cur => ({ ...cur, listening: vad.listening }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vad.listening, active]);

    useEffect(() => {
        onStateChange(state);
    }, [onStateChange, state]);

    return render(state);
};

export default VadRecorder;
