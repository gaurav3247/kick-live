'use client'
import { useEffect, useState } from "react";

import baseApi from "@/app/core/baseApi";
import { Match } from "./types";

async function fetchMatch(matchId: string) {
    try {
        const response = await baseApi.get(`/matches/${matchId}`);
        const data = await response.data;
        return data;
    } catch (error) {
        console.error("Failed to fetch match:", error);
        return null;
    }
}

export default function MatchComponent( { params }: {
    params: {
        matchId: string;
    };
} ) {
    const [match, setMatch] = useState<Match | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        fetchMatch(params.matchId)
        .then(data => {
            setMatch(data);
            setIsLoading(false);
        });
    }, [params.matchId]);

    return (
        <>
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    <h1>{match?.homeTeam.shortName} vs {match?.awayTeam.shortName}</h1>
                    <div>
                        <span>{match?.homeTeam.shortName}</span>
                        <span>{match?.score.fullTime.homeTeam}</span>
                        <span>{match?.score.fullTime.awayTeam}</span>
                        <span>{match?.awayTeam.shortName}</span>
                    </div>
                </div>
            )}
        </>
    )
}