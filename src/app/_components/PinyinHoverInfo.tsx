import pinyin from "_lib/data/pinyin";
import { useMemo } from "react";


const PinyinHoverInfo = ({
    character = "",
    position = {x: 0, y: 0}, 
}: {
    character?: string,
    position: {x: number, y: number},
}): JSX.Element => {

    const currentPinyin = useMemo(() => {
        if(!character) return null;
        const pinyins = pinyin[character];
        if(!pinyins) return null;
        if(pinyins.length <= 0) return null;
        return pinyin[character].join(", ");
    }, [character]);

    if(!currentPinyin) return <></>

    return (
        <div className="fixed flex flex-col items-center justify-end w-0 h-0 overflow-visible" style={
            {
                left: position.x,
                top: position.y,
            }
        }>
            <span className="bg-primary-800 rounded px-1 mb-1 font-bold">
                {currentPinyin}
            </span>
        </div>
    )
}

export default PinyinHoverInfo;