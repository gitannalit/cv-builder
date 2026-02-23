import React, { useRef, useEffect, useState } from "react";

interface EditableFieldProps {
    value: string;
    onChange: (newValue: string) => void;
    editable?: boolean;
    tag?: keyof JSX.IntrinsicElements;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}

export const EditableField: React.FC<EditableFieldProps> = ({
    value,
    onChange,
    editable = false,
    tag: Tag = "span",
    className = "",
    style,
}) => {
    const ref = useRef<HTMLElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    // Sync the DOM text with the value prop when it changes externally
    useEffect(() => {
        if (ref.current && !isFocused && ref.current.textContent !== value) {
            ref.current.textContent = value;
        }
    }, [value, isFocused]);

    if (!editable) {
        return React.createElement(Tag, { className, style }, value);
    }

    const editableStyles: React.CSSProperties = {
        ...style,
        outline: "none",
        cursor: "text",
        borderRadius: "4px",
        transition: "all 0.15s ease",
        position: "relative" as const,
    };

    return React.createElement(Tag, {
        ref,
        className: `editable-field ${isFocused ? "editable-field--focused" : ""} ${className}`,
        style: editableStyles,
        contentEditable: true,
        suppressContentEditableWarning: true,
        spellCheck: false,
        onFocus: () => setIsFocused(true),
        onBlur: (e: React.FocusEvent<HTMLElement>) => {
            setIsFocused(false);
            const newValue = e.currentTarget.textContent || "";
            if (newValue !== value) {
                onChange(newValue);
            }
        },
        onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
            // Prevent newlines in single-line fields
            if (e.key === "Enter" && Tag !== "p" && Tag !== "div") {
                e.preventDefault();
                (e.currentTarget as HTMLElement).blur();
            }
            // Escape to cancel
            if (e.key === "Escape") {
                if (ref.current) ref.current.textContent = value;
                (e.currentTarget as HTMLElement).blur();
            }
        },
        dangerouslySetInnerHTML: undefined,
        children: value,
    });
};

// CSS styles to be injected — add to index.css or include via style tag
export const editableFieldStyles = `
  .editable-field {
    position: relative;
    border: 1.5px dashed transparent;
    padding: 1px 3px;
    margin: -1px -3px;
    transition: all 0.15s ease;
    min-width: 20px;
    display: inline-block;
  }
  .editable-field:hover {
    border-color: rgba(0, 209, 160, 0.4);
    background: rgba(0, 209, 160, 0.04);
  }
  .editable-field--focused,
  .editable-field--focused:hover {
    border-color: rgba(0, 209, 160, 0.8);
    background: rgba(0, 209, 160, 0.08);
    box-shadow: 0 0 0 3px rgba(0, 209, 160, 0.12);
  }
`;
