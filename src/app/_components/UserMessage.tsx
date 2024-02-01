import OpenAI from "openai";

const UserMessage = ({
    message
}: {
    message: OpenAI.ChatCompletionMessageParam
}): JSX.Element => {
    return (
        <div className={`flex flex-col gap-2 items-end`}>
            <p className={`rounded p-2 bg-blue-800`}>{message.content as string}</p>
        </div>
    )
}

export default UserMessage;