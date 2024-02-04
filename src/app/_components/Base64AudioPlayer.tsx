import { useCallback, useEffect, useMemo, useState } from "react";

const Base64AudioPlayer = ({
    audioData = null,
    isPlaying,
    onEnded,
}: {
    audioData?: string | null;
    isPlaying: boolean;
    onEnded?: () => void;
}): JSX.Element => {
    const [ctx, setCtx] = useState<AudioContext | null>(null);

    const [playingKey, setPlayingKey] = useState("");
    const audio = useMemo<{
        key: string;
        data: string | null;
    }>(() => {
        if (audioData) return { key: audioData.substring(1000, 1010), data: audioData };
        return { key: "no-audio", data: null };
    }, [audioData]);

    const [audioSource, setAudioSource] = useState<AudioBufferSourceNode | null>(null);
    const [isActuallyPlaying, setIsActuallyPlaying] = useState(false);

    //setup audio context
    useEffect(() => {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        setCtx(audioCtx);
        //console.log("Created audio context");
    }, []);

    //ensure that the onEnded event fires when the audio finishes playing
    useEffect(() => {
        if (!audioSource) return;
        audioSource.onended = () => {
            //console.log("Audio playback complete");
            setIsActuallyPlaying(false);
            if (onEnded) onEnded();
            setAudioSource(null);
            setPlayingKey("no-audio");
        };
    }, [audioSource, onEnded]);

    //decode the base64 audio string when it comes in
    useEffect(() => {
        if (!ctx) return;
        if (audio.key === playingKey) return;

        //console.log("Audio changed to " + audio.key);

        if (audioSource) {
            //console.log("Stopping currently-playing audio source");
            try {
                audioSource.onended = null;
                audioSource.stop();
            } catch {
                //console.warn("Audio source wasn't playing");
            }
            setAudioSource(null);
            setIsActuallyPlaying(false);
        }

        if (!audio.data) return;

        //console.log(`Received audio '${audio.key}' decoding to audio buffer`);
        const asArray = Buffer.from(audio.data, "base64");
        ctx.decodeAudioData(asArray.buffer, buffer => {
            //console.log("Got audio buffer for " + audio.key);
            const source = new AudioBufferSourceNode(ctx);
            source.buffer = buffer;
            source.connect(ctx.destination);
            setAudioSource(source);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ctx, audio, playingKey]);

    //ensure that we actually play/pause when declaratively required to
    useEffect(() => {
        if (!audioSource) return;

        if (isPlaying === isActuallyPlaying) return;

        if (isPlaying) {
            //console.log("Playing audio source " + audio.key);
            try {
                audioSource.start();
                setIsActuallyPlaying(true);
                setPlayingKey(audio.key);
            } catch {
                //console.warn(`Audio ${audio.key} was already playing`);
            }
        } else {
            //console.log("Stopping audio source " + audio.key);
            try {
                audioSource.stop();
                setIsActuallyPlaying(false);
                setPlayingKey("no-audio");
            } catch {
                //console.warn(`Audio ${audio.key} wasn't playing`);
            }
        }
    }, [audioSource, isPlaying, isActuallyPlaying, audio.key]);

    return <></>;
};

export default Base64AudioPlayer;
