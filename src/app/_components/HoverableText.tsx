import { useState } from "react";

const HoverableText = ({
    message,
    onHover,
    onExit,
}: {
    message: string;
    onHover: (index: number, character: string, position: {x: number, y: number}) => void;
    onExit: () => void;
}): JSX.Element => {

    const [hoverIndex, setHoverIndex] = useState(-1);

    return (
        <div onMouseLeave={_ => {
            onExit()
            setHoverIndex(-1);
        }}>
            {message.split("").map((character, index) => {
                return (
                    <span
                        key={index}
                        onMouseEnter={(e) => {
                            onExit();
                            const rect = e.currentTarget.getBoundingClientRect();
                            onHover(index, character, { x: rect.x + rect.width * 0.5, y: rect.y });
                            setHoverIndex(index);
                        }}
                        onClick={(e) => {
                            onExit();
                            const rect = e.currentTarget.getBoundingClientRect();
                            onHover(index, character, { x: rect.x + rect.width * 0.5, y: rect.y });
                            setHoverIndex(index);
                        }}
                        onMouseLeave={_ => {
                            onExit()
                            setHoverIndex(-1);
                        }}
                        className={`${hoverIndex === index ? "border border-primary-800 border-opacity-50 -m-[1px]" : ""}`}
                    >
                        {character}
                    </span>
                );
            })}
        </div>
    )
}

export default HoverableText;