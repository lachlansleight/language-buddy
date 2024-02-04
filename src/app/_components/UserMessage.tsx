import OpenAI from "openai";
import HoverableText from "./HoverableText";

const UserMessage = ({ 
    message,
    onCharacterHoverOn,
    onCharacterHoverOff
 }: { 
    message: OpenAI.ChatCompletionMessageParam,
    onCharacterHoverOn: (index: number, character: string, position: {x: number, y: number}) => void;
    onCharacterHoverOff: () => void;
 }): JSX.Element => {
    return (
        <div className={`flex flex-col gap-2 items-end`}>
            <p className={`rounded p-2 bg-primary-800`}><HoverableText message={message.content as string} onHover={onCharacterHoverOn} onExit={onCharacterHoverOff} /></p>
        </div>
    );
};

export default UserMessage;
