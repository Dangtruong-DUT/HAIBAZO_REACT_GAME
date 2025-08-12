import clsx from "clsx";
import { useState, useEffect, useRef } from "react";
import type { GameStatusType } from "../types/ball.type";

interface BallProps {
    number: number;
    x: number;
    y: number;
    active: boolean;
    activeTime: number;
    onBallClick: (number: number) => void;
    onBallDisappear: (number: number) => void;
    autoPlay: boolean;
    nextNumber: number;
    zIndex: number;
    gameStatus: GameStatusType;
}

export default function Ball({
    number,
    x,
    y,
    active,
    activeTime,
    onBallClick,
    onBallDisappear,
    autoPlay,
    nextNumber,
    zIndex,
    gameStatus,
}: BallProps) {
    const [timeLeft, setTimeLeft] = useState<number>(activeTime);
    const [fade, setFade] = useState<number>(1);
    const autoPlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (active == false) {
            setTimeLeft(activeTime);
            setFade(1);
        }
    }, [active, setFade, setTimeLeft, activeTime]);

    useEffect(() => {
        if (Math.floor(timeLeft) <= 0 && active == true) {
            onBallDisappear(number);
        }
    }, [timeLeft, onBallDisappear, number, active]);

    useEffect(() => {
        if (active === false || gameStatus != "playing") return;

        const timer = setTimeout(() => {
            setTimeLeft(Math.max(0, timeLeft - 0.1));
            setFade((f) => Math.max(0, f - 0.07));
        }, 100);
        return () => clearTimeout(timer);
    }, [active, gameStatus, timeLeft]);

    useEffect(() => {
        if (autoPlay && gameStatus == "playing" && number === nextNumber) {
            autoPlayTimerRef.current = setTimeout(() => onBallClick(number), (activeTime * 1000) / 3);
        }
        if (autoPlay == false && active == false && autoPlayTimerRef.current != null) {
            clearTimeout(autoPlayTimerRef.current);
        }
        return () => {
            if (autoPlayTimerRef.current) {
                clearTimeout(autoPlayTimerRef.current);
            }
        };
    }, [autoPlay, active, number, gameStatus, nextNumber, onBallClick, activeTime, autoPlayTimerRef]);

    if (active == true && timeLeft <= 0) return null;

    const opacity = active ? fade : 1;

    const ballCanClick = gameStatus === "playing" && !active;

    return (
        <div
            data-ball-id={number}
            onClick={() => ballCanClick && onBallClick(number)}
            className={clsx(
                "absolute flex flex-col items-center justify-center select-none cursor-pointer font-bold border-2 border-red-500 rounded-full w-[50px] h-[50px]",
                {
                    "bg-orange-500 text-white": active,
                    "bg-white/70 text-red-700": !active,
                    "shadow-lg": timeLeft > 0.5,
                    "cursor-pointer": ballCanClick,
                    "cursor-not-allowed": !ballCanClick,
                }
            )}
            style={{ top: `${y}px`, left: `${x}px`, zIndex, opacity }}
        >
            <span>{number}</span>
            {active && <span className="text-xs text-red-900 font-semibold">{timeLeft.toFixed(1)}s</span>}
        </div>
    );
}
