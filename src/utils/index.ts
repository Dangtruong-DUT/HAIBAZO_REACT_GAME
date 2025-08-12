import type { GameStatusType } from "../types/ball.type";

export function getTitleGameFromStatus(status: GameStatusType): string {
    switch (status) {
        case "ready":
            return "LET'S PLAY";
        case "playing":
            return "LET'S PLAY";
        case "success":
            return "ALL CLEANED";
        case "fail":
            return "GAME OVER";
        default:
            return "LET'S PLAY";
    }
}
