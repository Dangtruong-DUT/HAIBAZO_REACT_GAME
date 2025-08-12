import { useCallback, useEffect, useState } from "react";
import type { GameStatusType } from "../types/ball.type";

interface ControlPanelProps {
    ballCount: number;
    onBallCountChange: (count: number) => void;
    autoPlay: boolean;
    gameStatus: GameStatusType;
    onPlay: () => void;
    onToggleAutoPlay: () => void;
}

export default function ControlPanel({
    ballCount,
    gameStatus,
    autoPlay,
    onToggleAutoPlay,
    onBallCountChange,
    onPlay,
}: ControlPanelProps) {
    const [time, setTime] = useState<number>(0);

    useEffect(() => {
        if (gameStatus !== "playing") return;

        const timeOut = setTimeout(() => {
            setTime(time + 0.1);
        }, 100);

        return () => clearTimeout(timeOut);
    }, [gameStatus, time]);

    const handleOnPlay = useCallback(() => {
        onPlay();
        setTime(0);
    }, [onPlay, setTime]);

    const handleChangePointsCount = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value.trim();
            if (!isNaN(Number(value)) && Number(value) >= 0) {
                onBallCountChange(Number(value));
            }
        },
        [onBallCountChange]
    );

    return (
        <div className="mb-5">
            <div className="flex items-center gap-10 mb-2">
                <label className="font-semibold">Points:</label>
                <input type="text" value={ballCount} onChange={handleChangePointsCount} className="border px-2  w-30" />
            </div>
            <div className="flex items-center gap-10 mb-2">
                <label className="font-semibold">Time:</label>
                <span>{time.toFixed(1)}s</span>
            </div>
            <div className="flex gap-2 mb-2">
                {gameStatus == "ready" && (
                    <button className="border px-6  rounded bg-gray-100 hover:bg-gray-200" onClick={handleOnPlay}>
                        Play
                    </button>
                )}
                {gameStatus != "ready" && (
                    <button className="border px-6  rounded bg-gray-100 hover:bg-gray-200" onClick={handleOnPlay}>
                        Restart
                    </button>
                )}
                {gameStatus == "playing" && (
                    <button className="border px-6  rounded bg-gray-100 hover:bg-gray-200" onClick={onToggleAutoPlay}>
                        Auto Play {!autoPlay ? "ON" : "OFF"}
                    </button>
                )}
            </div>
        </div>
    );
}
