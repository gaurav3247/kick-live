import { useState, useEffect } from "react";

import { Competition } from "@/app/components/matchesTable";


export default function TeamOverview( {teamId, runningCompetitions} :{
    teamId: string;
    runningCompetitions?: Competition[];
}) {
    const [fixtures, setFixtures] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    return (
        <div>
            <h1>Team Overview</h1>
            <p>Team overview page</p>
        </div>
    );
}