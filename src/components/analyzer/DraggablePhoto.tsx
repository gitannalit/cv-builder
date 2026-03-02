import React, { useRef, useState, useCallback, useEffect } from "react";
import { Camera, X, Move, Maximize, Square, Circle } from "lucide-react";

export interface PhotoPosition {
    x: number; // percentage 0-100
    y: number; // percentage 0-100
}

interface DraggablePhotoProps {
    photoUrl: string | null;
    position: PhotoPosition;
    size: number;
    shape: 'circle' | 'rect';
    onPhotoChange: (url: string | null) => void;
    onPositionChange: (pos: PhotoPosition) => void;
    onSizeChange: (size: number) => void;
    onShapeChange: (shape: 'circle' | 'rect') => void;
    editable?: boolean;
    containerRef: React.RefObject<HTMLDivElement>;
}

export const DraggablePhoto: React.FC<DraggablePhotoProps> = ({
    photoUrl,
    position,
    size,
    shape,
    onPhotoChange,
    onPositionChange,
    onSizeChange,
    onShapeChange,
    editable = false,
    containerRef,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const photoRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    const [isDraggingState, setIsDraggingState] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
            const result = ev.target?.result as string;
            onPhotoChange(result);
        };
        reader.readAsDataURL(file);
        // Reset so same file can be re-uploaded
        e.target.value = "";
    };

    const clamp = (value: number, min: number, max: number) =>
        Math.max(min, Math.min(max, value));

    const onMouseDown = useCallback(
        (e: React.MouseEvent) => {
            if (!editable || !photoRef.current || !containerRef.current) return;
            e.preventDefault();
            e.stopPropagation();

            const containerRect = containerRef.current.getBoundingClientRect();
            const photoRect = photoRef.current.getBoundingClientRect();

            // Offset from top-left of the photo element to where we clicked
            dragOffset.current = {
                x: e.clientX - photoRect.left,
                y: e.clientY - photoRect.top,
            };

            isDragging.current = true;
            setIsDraggingState(true);

            const onMouseMove = (ev: MouseEvent) => {
                if (!isDragging.current || !containerRef.current) return;
                const rect = containerRef.current.getBoundingClientRect();

                // Position of the photo top-left relative to container
                const rawX = ev.clientX - rect.left - dragOffset.current.x;
                const rawY = ev.clientY - rect.top - dragOffset.current.y;

                // Convert to percentage of container
                const xPct = clamp((rawX / rect.width) * 100, 0, 90);
                const yPct = clamp((rawY / rect.height) * 100, 0, 95);

                onPositionChange({ x: xPct, y: yPct });
            };

            const onMouseUp = () => {
                isDragging.current = false;
                setIsDraggingState(false);
                window.removeEventListener("mousemove", onMouseMove);
                window.removeEventListener("mouseup", onMouseUp);
            };

            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener("mouseup", onMouseUp);
        },
        [editable, containerRef, onPositionChange]
    );

    // Touch support
    const onTouchStart = useCallback(
        (e: React.TouchEvent) => {
            if (!editable || !photoRef.current || !containerRef.current) return;
            e.stopPropagation();
            const touch = e.touches[0];

            const containerRect = containerRef.current.getBoundingClientRect();
            const photoRect = photoRef.current.getBoundingClientRect();

            dragOffset.current = {
                x: touch.clientX - photoRect.left,
                y: touch.clientY - photoRect.top,
            };

            isDragging.current = true;
            setIsDraggingState(true);

            const onTouchMove = (ev: TouchEvent) => {
                if (!isDragging.current || !containerRef.current) return;
                ev.preventDefault();
                const t = ev.touches[0];
                const rect = containerRef.current.getBoundingClientRect();

                const rawX = t.clientX - rect.left - dragOffset.current.x;
                const rawY = t.clientY - rect.top - dragOffset.current.y;

                const xPct = clamp((rawX / rect.width) * 100, 0, 90);
                const yPct = clamp((rawY / rect.height) * 100, 0, 95);
                onPositionChange({ x: xPct, y: yPct });
            };

            const onTouchEnd = () => {
                isDragging.current = false;
                setIsDraggingState(false);
                window.removeEventListener("touchmove", onTouchMove);
                window.removeEventListener("touchend", onTouchEnd);
            };

            window.addEventListener("touchmove", onTouchMove, { passive: false });
            window.addEventListener("touchend", onTouchEnd);
        },
        [editable, containerRef, onPositionChange]
    );

    if (!photoUrl && !editable) return null;

    if (!photoUrl && editable) {
        // Upload placeholder
        return (
            <div
                style={{
                    position: "absolute",
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                    zIndex: 20,
                    width: size,
                    height: size,
                }}
            >
                <button
                    onClick={() => fileInputRef.current?.click()}
                    title="Añadir foto de perfil"
                    style={{
                        width: size,
                        height: size,
                        borderRadius: shape === 'circle' ? "50%" : "8px",
                        background: "rgba(0,209,160,0.12)",
                        border: "2px dashed rgba(0,209,160,0.7)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "#00D1A0",
                        fontSize: 10,
                        fontWeight: 600,
                        gap: 4,
                        transition: "background 0.2s",
                    }}
                >
                    <Camera size={size * 0.28} />
                    <span>Foto</span>
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                />
            </div>
        );
    }

    return (
        <div
            ref={photoRef}
            style={{
                position: "absolute",
                left: `${position.x}%`,
                top: `${position.y}%`,
                zIndex: 20,
                width: size,
                height: size,
                cursor: editable ? (isDraggingState ? "grabbing" : "grab") : "default",
                userSelect: "none",
            }}
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
        >
            {/* Photo circle */}
            <div
                style={{
                    width: size,
                    height: size,
                    borderRadius: shape === 'circle' ? "50%" : "8px",
                    overflow: "hidden",
                    border: editable ? "2.5px solid rgba(0,209,160,0.8)" : "3px solid white",
                    boxShadow: editable
                        ? "0 0 0 3px rgba(0,209,160,0.18), 0 4px 12px rgba(0,0,0,0.2)"
                        : "0 4px 12px rgba(0,0,0,0.2)",
                    background: "#e0e0e0",
                    flexShrink: 0,
                }}
            >
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        backgroundImage: `url(${photoUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        pointerEvents: "none",
                    }}
                />
            </div>

            {/* Controls when editable */}
            {editable && (
                <>
                    {/* Drag indicator */}
                    <div
                        style={{
                            position: "absolute",
                            top: -8,
                            left: "50%",
                            transform: "translateX(-50%)",
                            background: "#00D1A0",
                            borderRadius: 8,
                            padding: "2px 5px",
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            pointerEvents: "none",
                        }}
                    >
                        <Move size={10} color="white" />
                    </div>

                    {/* Delete button */}
                    <button
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                            e.stopPropagation();
                            onPhotoChange(null);
                        }}
                        title="Eliminar foto"
                        style={{
                            position: "absolute",
                            bottom: -4,
                            right: -4,
                            width: 22,
                            height: 22,
                            borderRadius: "50%",
                            background: "#ef4444",
                            border: "2px solid white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                        }}
                    >
                        <X size={11} color="white" />
                    </button>

                    {/* Change photo button */}
                    <button
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                        }}
                        title="Cambiar foto"
                        style={{
                            position: "absolute",
                            bottom: -4,
                            left: -4,
                            width: 22,
                            height: 22,
                            borderRadius: "50%",
                            background: "#00D1A0",
                            border: "2px solid white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                        }}
                    >
                        <Camera size={11} color="white" />
                    </button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />

                    {/* Resize and Shape Controls Panel */}
                    <div
                        onMouseDown={(e) => e.stopPropagation()}
                        style={{
                            position: "absolute",
                            top: "calc(100% + 10px)",
                            left: "50%",
                            transform: "translateX(-50%)",
                            background: "white",
                            border: "1px solid #e2e8f0",
                            borderRadius: "12px",
                            padding: "8px 12px",
                            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                            minWidth: "140px",
                            zIndex: 30,
                        }}
                    >
                        {/* Size Slider */}
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <Maximize size={14} className="text-gray-400" />
                            <input
                                type="range"
                                min="60"
                                max="200"
                                value={size}
                                onChange={(e) => onSizeChange(parseInt(e.target.value))}
                                style={{
                                    flex: 1,
                                    height: "4px",
                                    appearance: "none",
                                    background: "#e2e8f0",
                                    borderRadius: "2px",
                                    outline: "none",
                                    cursor: "pointer",
                                }}
                                className="accent-[#00D1A0]"
                            />
                        </div>

                        {/* Shape Toggles */}
                        <div style={{ display: "flex", gap: "4px" }}>
                            <button
                                onClick={() => onShapeChange('circle')}
                                style={{
                                    flex: 1,
                                    padding: "4px",
                                    borderRadius: "6px",
                                    background: shape === 'circle' ? "#f0fdf9" : "transparent",
                                    border: shape === 'circle' ? "1px solid #00D1A0" : "1px solid #e2e8f0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                }}
                            >
                                <Circle size={14} color={shape === 'circle' ? "#00D1A0" : "#64748b"} />
                            </button>
                            <button
                                onClick={() => onShapeChange('rect')}
                                style={{
                                    flex: 1,
                                    padding: "4px",
                                    borderRadius: "6px",
                                    background: shape === 'rect' ? "#f0fdf9" : "transparent",
                                    border: shape === 'rect' ? "1px solid #00D1A0" : "1px solid #e2e8f0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                }}
                            >
                                <Square size={14} color={shape === 'rect' ? "#00D1A0" : "#64748b"} />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
