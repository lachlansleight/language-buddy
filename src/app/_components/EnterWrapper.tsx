import { ReactNode, useState } from "react";


const EnterWrapper = ({
    children
}: {
    children?: ReactNode
}): JSX.Element => {
    
    const [entered, setEntered] = useState(false);

    if(!entered) return (
        <div className="w-full h-96 grid place-items-center">
            <button className="px-4 py-2 rounded bg-blue-800 text-white" onClick={() => setEntered(true)}>Enter</button>
        </div>
    )

    return (
        <>
            {children}
        </>
    );
}

export default EnterWrapper;