import { useState, useCallback } from "react";
import type { BallType, GameStatusType } from "../types/ball.type";
import Ball from "./Ball";
import ControlPanel from "./ControlPanel";
import clsx from "clsx";
import { getTitleGameFromStatus } from "../utils";
import { GAME_CONFIG } from "../config";

export default function GameContainer() {
    const [balls, setBalls] = useState<BallType[]>([]);
    const [nextNumber, setNextNumber] = useState(1);
    const [gameStatus, setGameStatus] = useState<GameStatusType>("ready");
    const [autoPlay, setAutoPlay] = useState(false);
    const [ballCount, setBallCount] = useState(5);

    const startGame = useCallback(
        (count: number = ballCount) => {
            setGameStatus("playing");
            setNextNumber(1);

            const generatedBalls: BallType[] = Array.from({ length: count }, (_, i) => ({
                number: i + 1,
                x: Math.floor(Math.random() * (GAME_CONFIG.areaWidth - GAME_CONFIG.ballSize)),
                y: Math.floor(Math.random() * (GAME_CONFIG.areaHeight - GAME_CONFIG.ballSize)),
                active: false,
            }));

            setBalls(generatedBalls);
        },
        [ballCount]
    );

    const handleBallClick = useCallback(
        (number: number) => {
            if (number === nextNumber) {
                setNextNumber(number + 1);

                setBalls((prev) => {
                    const idx = prev.findIndex((b) => b.number === number);
                    if (idx === -1) return prev;
                    const updated = [...prev];
                    updated[idx] = { ...updated[idx], active: true };
                    return updated;
                });
            } else {
                setGameStatus("fail");
            }
        },
        [nextNumber]
    );

    const handlePlayGame = useCallback(() => {
        setBalls([]);
        startGame(ballCount);
    }, [ballCount, startGame]);

    const handleToggleAutoPlay = useCallback(() => {
        setAutoPlay((prev) => !prev);
    }, []);

    const handleOnBallDisappear = useCallback(
        (number: number) => {
            if (number === balls.length) {
                setGameStatus("success");
            }
        },
        [balls.length]
    );

    return (
        <div
            className="mx-auto"
            style={{
                width: GAME_CONFIG.areaWidth,
            }}
        >
            <p
                className={clsx("text-xl font-bold mb-3", {
                    "text-black": gameStatus == "playing" || gameStatus == "ready",
                    "text-green-500": gameStatus == "success",
                    "text-red-500": gameStatus == "fail",
                })}
            >
                {getTitleGameFromStatus(gameStatus)}
            </p>
            <ControlPanel
                gameStatus={gameStatus}
                ballCount={ballCount}
                autoPlay={autoPlay}
                onToggleAutoPlay={handleToggleAutoPlay}
                onBallCountChange={setBallCount}
                onPlay={handlePlayGame}
            />
            <div
                className="relative border-2 border-black bg-gray-100 overflow-hidden mt-5"
                style={{
                    width: GAME_CONFIG.areaWidth,
                    height: GAME_CONFIG.areaHeight,
                }}
            >
                {balls
                    .sort((a, b) => a.number - b.number)
                    .map((ball) => (
                        <Ball
                            ballSize={GAME_CONFIG.ballSize}
                            onBallDisappear={handleOnBallDisappear}
                            key={ball.number}
                            number={ball.number}
                            x={ball.x}
                            y={ball.y}
                            active={ball.active}
                            activeTime={GAME_CONFIG.activeTimeOfBall}
                            onBallClick={handleBallClick}
                            autoPlay={autoPlay}
                            nextNumber={nextNumber}
                            zIndex={balls.length + 10 - ball.number}
                            gameStatus={gameStatus}
                        />
                    ))}
            </div>
        </div>
    );
}
