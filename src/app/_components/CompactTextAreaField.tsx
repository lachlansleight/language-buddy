const CompactTextAreaField = ({
    className,
    label,
    value,
    onChange,
    onFocus,
}: {
    className?: string;
    label: string;
    value: string;
    onChange?: (value: string) => void;
    onFocus?: () => void;
}): JSX.Element => {
    return (
        <div className={`flex flex-col items-start ${className}`}>
            <label className="w-24 text-xs italic text-white text-opacity-60">{label}</label>
            <textarea
                className={`flex-grow bg-gray-700 rounded px-2 py-1 resize-none ${className?.includes("w-full") ? "w-full" : ""}`}
                value={value}
                onChange={e => {
                    if (onChange) onChange(e.target.value);
                }}
                onFocus={onFocus}
            />
        </div>
    );
};

export default CompactTextAreaField;
