import { Competition } from "@/app/components/matchesTable";

export interface Coach {
    id: number;
    name: string;
    nationality: string;
}

export interface Player {
    id: number;
    name: string;
    position: string;
    shirtNumber: number;
}

export interface Statistics {
    corner_kicks: number;
    free_kicks: number;
    goal_kicks: number;
    offsides: number;
    fouls: number;
    ball_possession: number;
    saves: number;
    throw_ins: number;
    shots: number;
    shots_on_goal: number;
    shots_off_goal: number;
    yellow_cards: number;
    yellow_red_cards: number;
    red_cards: number;
}

export interface Referee {
    id: number;
    name: string;
    type: string;
    nationality: string;
}

export interface Team {
    id: number;
    name: string;
    shortName: string;
    tla: string;
    crest: string;
    coach: Coach;
    leagueRank: number | null;
    formation: string;
    lineup: Player[];
    bench: Player[];
    statistics: Statistics;
}

export interface Goal {
    minute: number;
    injuryTime: number | null;
    type: string;
    team: {
        id: number;
        name: string;
    }
    scorer: {
        id: number;
        name: string;
    };
    assist: {
        id: number;
        name: string;
    } | null;
    score: {
        homeTeam: number;
        awayTeam: number;
    };
}

export interface Match {
    id: number;
    competition: Competition;
    venue: string;
    homeTeam: Team;
    awayTeam: Team;
    utcDate: string;
    status: string;
    score: {
        winner: string;
        duration: string;
        fullTime: {
            homeTeam: number;
            awayTeam: number;
        };
        halfTime: {
            homeTeam: number;
            awayTeam: number;
        };
    }
    minute: number | null;
    referees: Referee[];
    goals: Goal[];
}
