'use client'
import { useEffect, useState } from 'react';
import { Box, Button, Link, Typography } from '@mui/material';
import { Avatar } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

import baseApi from '../core/baseApi';


export interface Team {
    id: number;
    name: string;
    shortName: string;
    tla: string;
    crest: string;
}

interface ScoreDetail {
    home: number | null;
    away: number | null;
}

export interface Score {
    winner: string | null;
    duration: string;
    fullTime: ScoreDetail;
    halfTime: ScoreDetail;
    regularTime: ScoreDetail;
    extraTime: ScoreDetail;
    penalties: ScoreDetail;
}

export interface Competition {
    id: number;
    name: string;
    code: string;
    emblem: string;
}

interface Match {
    id: number;
    homeTeam: Team;
    awayTeam: Team;
    utcDate: string;
    status: string;
    score: Score;
    competition: Competition;
    time: string;
}

interface Matches {
    [key: string]: {
        competition: Competition;
        matches: Match[];
    };
}


function formatDate(date: Date) {
    const offset = date.getTimezoneOffset();
    date = new Date(date.getTime() - offset * 60 * 1000);
    return date.toISOString().split('T')[0];
}

export const renderMatchStatus = (match: Match) => {
    switch (match.status) {
        case 'SCHEDULED':
        case 'TIMED':
            return  <Typography
                    sx={{
                        fontSize: {
                            xs: '0.75rem',
                            sm: '0.875rem',
                            md: '1rem',
                    },
                    textAlign: 'center',
                    wordWrap: 'break-word'
                    }}>
                        {match.time}
                    </Typography>;
        case 'SUSPENDED':
        case 'POSTPONED':
        case 'CANCELED':
        case 'AWARDED':
            return  <Typography
                    sx={{
                        fontSize: {
                            xs: '0.75rem',
                            sm: '0.875rem',
                            md: '1rem',
                        },
                        textDecoration: 'line-through',
                    textAlign: 'center',
                    wordWrap: 'break-word'
                    }}>
                        {match.time}
                    </Typography>;
        default:
            return  <Typography
                    sx={{
                        fontSize: {
                            xs: '0.75rem',
                            sm: '0.875rem',
                            md: '1rem',
                        },
                    textAlign: 'center',
                    wordWrap: 'break-word'
                    }}>
                        -
                    </Typography>;
    }
}

function LeagueMatchesTable({ league, matches }: { league: Competition, matches: Match[] }) {
    return (
        <Box
        sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            border: '1px solid',
            borderRadius: '5px',
            marginBottom: '10px',
        }}>
            <Link href={`/standings/${league.code}`} underline='none' sx={{ color: 'inherit' }} >
            <Box
            sx={{
                width: '100%',
                height: '50px',
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
                justifyContent: 'flex-start',
                borderRadius: '5px',
                marginBottom: '5px',
                backgroundColor: '#f5f5f5',
                paddingLeft: '10px 10px',
                boxSizing: 'border-box',
            }}>
                <Avatar src={league.emblem} sx={{ width: 28, height: 28 }}/>
                <Typography
                sx={{
                    fontSize: {
                        xs: '0.875rem',
                        sm: '1rem',
                        md: '1.25rem',
                    },
                    fontWeight: 'bold',
                textAlign: 'center',
                wordWrap: 'break-word'
                }}>
                    {league.name}
                </Typography>
            </Box>
            </Link>
            <Box>
                {matches.map((match) => (
                    // <Link href={`/match/${match.id}`} key={match.id} underline='none' sx={{ color: 'inherit' }}>
                        <Box key={match.id}
                            sx={{
                                // cursor: 'pointer',
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'row',
                                gap: '10px',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '10px',
                                ":hover": {
                                    // cursor: 'pointer',
                                    backgroundColor: '#f5f5f5',
                                },
                        }}>
                            <Box sx={{ marginLeft: '1rem' }}>
                                {match.status === 'FINISHED' ? (
                                    match.score.duration === 'PENALTY_SHOOTOUT' ? 
                                        (
                                            <Avatar sx={{ width: 28, height: 28, fontSize: 12 }}>Pen</Avatar>
                                        ) : match.score.duration === 'EXTRA_TIME' ? 
                                        (
                                            <Avatar sx={{ width: 28, height: 28, fontSize: 12 }}>ET</Avatar>
                                        ) : (
                                            <Avatar sx={{ width: 28, height: 28, fontSize: 12 }}>FT</Avatar>
                                        )
                                    ) : (
                                        match.status === 'PAUSED' ?
                                        (
                                            <Avatar sx={{ width: 28, height: 28, fontSize: 12 }}>HT</Avatar>
                                        ) : <Box sx={{ width: 28, height: 28 }}></Box>
                                    )
                                }
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '40%', justifyContent: 'flex-end', gap: '5px', marginRight: '1rem' }}>
                                <Typography variant='h4'
                                sx={{
                                    fontSize: {
                                        xs: '0.75rem',
                                        sm: '0.875rem',
                                        md: '1rem',
                                    },
                                textAlign: 'center',
                                wordWrap: 'break-word'
                                }}>
                                    {match.homeTeam.shortName}
                                </Typography>
                                <Avatar src={match.homeTeam.crest} sx={{ width: 28, height: 28 }}/>
                            </Box>
                            <Box sx={{ width: '4rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', marginRight: '1rem' }}>
                                <Typography variant='h4'
                                sx={{
                                    fontSize: {
                                        xs: '0.75rem',
                                        sm: '0.875rem',
                                        md: '1rem',
                                    },
                                textAlign: 'center',
                                wordWrap: 'break-word'
                                }}>
                                    {match.score.fullTime.home}
                                </Typography>
                                {renderMatchStatus(match)}
                                <Typography variant='h4'
                                sx={{
                                    fontSize: {
                                        xs: '0.75rem',
                                        sm: '0.875rem',
                                        md: '1rem',
                                    },
                                textAlign: 'center',
                                wordWrap: 'break-word'
                                }}>
                                    {match.score.fullTime.away}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '40%', justifyContent: 'flex-start', gap: '5px', marginRight: '1rem' }}>
                                <Avatar src={match.awayTeam.crest} sx={{ width: 28, height: 28 }}/>
                                <Typography variant='h4'
                                sx={{
                                    fontSize: {
                                        xs: '0.75rem',
                                        sm: '0.875rem',
                                        md: '1rem',
                                    },
                                textAlign: 'center',
                                wordWrap: 'break-word'
                                }}>
                                    {match.awayTeam.shortName}
                                </Typography>
                            </Box>
                        </Box>
                    // </Link>
                ))}
            </Box>
        </Box>
    );
}

export default function MatchesTable() {
    const [matches, setMatches] = useState<Matches>({});
    const [date, setDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const formattedDate = formatDate(date);
        let timeZone = sessionStorage.getItem('timeZone');
        if (timeZone === null) {
            timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            sessionStorage.setItem('timeZone', timeZone);
        }

        baseApi.post('/', {
            date: formattedDate,
            timeZone: timeZone,
        })
        .then((response) => {
            setMatches(response.data);
            setIsLoading(false);
        });
    }, [date]);

    return (
        <>
            <Button sx={{ alignSelf: 'flex-end', marginBottom: '-5px' }} fullWidth={false} variant="outlined" onClick={() => {setDate(new Date()); setIsLoading(true)}}>Jump to Today</Button>
            <Box
                id='matches-table'
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '10px',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: '1px solid',
                    borderRadius: '5px',
                    marginBottom: '10px',
                }}>
                <Box>
                    <IconButton onClick={() => {setDate(new Date(date.getTime() - 24 * 60 * 60 * 1000)); setIsLoading(true)}}>
                        <KeyboardArrowLeftIcon />
                    </IconButton>
                </Box>
                <Box>
                    <h2>{formatDate(date)}</h2>
                </Box>
                <Box>
                    <IconButton onClick={() => {setDate(new Date(date.getTime() + 24 * 60 * 60 * 1000)); setIsLoading(true)}}>
                        <KeyboardArrowRightIcon />
                    </IconButton>
                </Box>
            </Box>
            {isLoading ? (
                <>
                    <Box sx={{ height: '15rem', width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', border: '1px solid', borderRadius: '5px'}}>
                        <Skeleton variant="rounded" width="100%" height={50} />
                    </Box>
                    <Box sx={{ height: '15rem', width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', border: '1px solid', borderRadius: '5px'}}>
                        <Skeleton variant="rounded" width="100%" height={50} />
                    </Box>
                    <Box sx={{ height: '15rem', width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', border: '1px solid', borderRadius: '5px'}}>
                        <Skeleton variant="rounded" width="100%" height={50} />
                    </Box>
                </>
            ) : Object.keys(matches).length === 0 ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '15rem', width: '100%' }}>
                        <h3>No matches on this day</h3>
                    </Box>
                ) : (
                    Object.entries(matches).map(([league, leagueInfo]) => (
                        <div key={league}>
                            <LeagueMatchesTable league={leagueInfo.competition} matches={leagueInfo.matches} />
                        </div>
                    ))
                )
            }
        </>
    )
}
