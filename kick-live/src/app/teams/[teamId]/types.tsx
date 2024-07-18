import { Competition } from "@/app/components/matchesTable";

export interface Person {
    id: number;
    name: string;
    nationality: string;
}

export interface Player extends Person {
    position: string;
}

export interface Squad {
    [position: string]: Player[];
}

export interface Team {
    id: string;
    name: string;
    shortName: string;
    tla: string;
    emblem: string;
    venue: string;
    runningCompetitions: Competition[];
    coach: Person;
    squad: Squad;
}