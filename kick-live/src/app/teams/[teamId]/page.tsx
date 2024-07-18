'use client'
import { useState, useEffect } from "react";
import { Avatar, Box, Button, Card, CardActions, CardHeader, Typography, Skeleton } from "@mui/material";

import baseApi from "@/app/core/baseApi";
import { Team } from "./types";
import TeamOverview from "./components/overview";
import TeamFixtures from "./components/fixtures";
import TeamSquad from "./components/sqaud";


async function fetchTeam(teamId: string) {
    try {
        const response = await baseApi.get(`/teams/${teamId}`);
        const data = await response.data;
        return data;
    } catch (error) {
        console.error("Failed to fetch team:", error);
        return null;
    }
}

const activeButtonProps = {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    color: '#202124',
    '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
    borderBottom: '2px solid #202124',
}

const inactiveButtonProps = {
    backgroundColor: 'transparent',
    color: '#202124',
    '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
}

export default function TeamComponent( {params}: {
    params: {
        teamId: string
    };
} ) {
    const [team, setTeam] = useState<Team | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeButton, setActiveButton] = useState('Fixtures');

    useEffect(() => {
        fetchTeam(params.teamId)
        .then(data => {
            setTeam(data);
            setIsLoading(false);
        });
    }, [params.teamId]);

    return (
        <>
            {isLoading ? (
                <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    padding: '20px',
                    margin: '0',
                }}
                >
                    <Skeleton variant="rounded" width="100%" height="182px" />
                </Box>
            ) : (
                <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    padding: '20px',
                }}>
                    <Card>
                        <CardHeader
                            title={team?.name}
                            titleTypographyProps={{
                                variant: 'h5',
                            }}
                            subheader={team?.shortName}
                            subheaderTypographyProps={{
                                variant: 'body1',
                            }}
                            avatar={<Avatar src={team?.emblem} alt={team?.name} variant="square"/>}
                            sx={{
                                marginBottom: '2rem',
                            }}
                        />
                        <CardActions sx={{ paddingBottom: '1rem' }}>
                            {/* <Button
                            sx={activeButton === 'Overview' ? activeButtonProps : inactiveButtonProps}
                            onClick={() => setActiveButton('Overview')}>
                                Overview
                            </Button> */}
                            <Button
                            sx={activeButton === 'Fixtures' ? activeButtonProps : inactiveButtonProps}
                            onClick={() => setActiveButton('Fixtures')}>
                                Fixtures
                            </Button>
                            <Button
                            sx={activeButton === 'Squad' ? activeButtonProps : inactiveButtonProps}
                            onClick={() => setActiveButton('Squad')}>
                                Squad
                            </Button>
                        </CardActions>
                    </Card>
                    <Box>
                        {/* {activeButton === 'Overview' && (
                            <TeamOverview teamId={params.teamId} runningCompetitions={team?.runningCompetitions}/>
                        )} */}
                        {activeButton === 'Fixtures' && (
                            <TeamFixtures teamId={team!.id} />
                        )}
                        {activeButton === 'Squad' && (
                            <TeamSquad squad={team?.squad} coach={team?.coach} />
                        )}
                    </Box>
                </Box>
            )}
        </>
    )
}