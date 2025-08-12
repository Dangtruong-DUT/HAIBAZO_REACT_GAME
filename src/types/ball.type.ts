export interface BallType {
    x: number;
    y: number;
    active: boolean;
    number: number;
}

export type GameStatusType = "ready" | "playing" | "success" | "fail";
