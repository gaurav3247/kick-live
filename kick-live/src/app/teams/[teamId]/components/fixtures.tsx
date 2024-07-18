import { useState, useEffect } from "react";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Avatar, Box, Divider, IconButton, Table, TableBody, TableContainer, Skeleton, TableRow, Typography } from "@mui/material";

import { Team, Score, Competition } from "@/app/components/matchesTable";
import { renderMatchStatus } from "@/app/components/matchesTable";
import baseApi from "@/app/core/baseApi";

// Types
interface Area {
    id: number;
    name: string;
    code: string;
    flag: string;
}

interface Season {
    id: number;
    startDate: string;
    endDate: string;
    currentMatchday: number;
    winner: null;
}

interface Fixture {
    area: Area;
    competition: Competition;
    season: Season;
    id: number;
    utcDate: string;
    status: string;
    matchday: number;
    stage: string;
    group: null;
    lastUpdated: string;
    homeTeam: Team;
    awayTeam: Team;
    score: Score;
    referees: any[];
    time: string;
    date: string;
}

interface Fixtures extends Array<Fixture> {}
export default function TeamFixtures({ teamId }: { teamId: string}) {
    const [fixtures, setFixtures] = useState<Fixture[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0);
    const rowsPerPage = 10;

    useEffect(() => {
            let timeZone = sessionStorage.getItem('timeZone');
            if (timeZone === null) {
                timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                sessionStorage.setItem('timeZone', timeZone);
            }

            baseApi.post(`/team/fixtures`, {
                teamId: teamId,
                timeZone: timeZone,
            })
            .then(response => response.data)
            .then(data => {
                setFixtures(data.matches);
                setIsLoading(false);
            });
    }, [teamId]);

    return isLoading ? (
        <>
            <Skeleton variant="rectangular" width="100%" height={100} sx={{ borderRadius: '8px', marginBottom: '16px' }} />
            <Skeleton variant="rectangular" width="100%" height={100} sx={{ borderRadius: '8px', marginBottom: '16px' }} />
            <Skeleton variant="rectangular" width="100%" height={100} sx={{ borderRadius: '8px', marginBottom: '16px' }} />
            <Skeleton variant="rectangular" width="100%" height={100} sx={{ borderRadius: '8px', marginBottom: '16px' }} />
            <Skeleton variant="rectangular" width="100%" height={100} sx={{ borderRadius: '8px', marginBottom: '16px' }} />
        </>
    ) : (
        <>
            <TableContainer>
                <Table
                sx={{
                    width: '100%',
                    borderCollapse: 'separate',
                    borderSpacing: '0 8px',
                    padding: '0px 16px',
                    borderRadius: '8px',
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                    marginBottom: '16px',
                    border: 'solid 1px rgba(240, 240, 240, 1.0)',
                }}>
                    <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '16px',
                        padding: '16px',
                        margin: '0',
                        textAlign: 'center',
                    }}>
                        <IconButton onClick={() => setPage(page - 1)} disabled={page === 0}>
                            <KeyboardArrowLeftIcon />
                        </IconButton>
                        <Typography
                        sx={{
                            fontSize: {
                                xs: '0.6rem',
                                sm: '0.875rem',
                                md: '1rem',
                        },
                        textAlign: 'center',
                        wordWrap: 'break-word'
                        }}>
                            Upcoming Fixtures
                        </Typography>
                        <IconButton onClick={() => setPage(page + 1)} disabled={fixtures.length <= (page + 1) * rowsPerPage}>
                            <KeyboardArrowRightIcon />
                        </IconButton>
                    </Box>
                    <Divider />
                    <TableBody>
                        {fixtures && fixtures.
                        slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((fixture, index) => (
                            <TableRow key={fixture.id}>
                                <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    padding: '16px 0px 10px',
                                    placeItems: 'center',
                                    height: '85px',
                                }}>
                                    <Box
                                    sx={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}>
                                        <Typography
                                        sx={{
                                            fontSize: {
                                                xs: '0.5rem',
                                                sm: '0.75rem',
                                                md: '0.875rem',
                                        },
                                        textAlign: 'center',
                                        wordWrap: 'break-word'
                                        }}>
                                            {fixture.date}
                                        </Typography>
                                        <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            textAlign: 'center',
                                            gap: '8px',
                                        }}>
                                            <Typography
                                            sx={{
                                                fontSize: {
                                                    xs: '0.5rem',
                                                    sm: '0.75rem',
                                                    md: '0.875rem',
                                            },
                                            textAlign: 'center',
                                            wordWrap: 'break-word'
                                            }}>
                                                {fixture.competition.name}
                                            </Typography>
                                            <Avatar src={fixture.competition.emblem} variant="square" sx={{ width: 28, height: 28 }}/> 
                                        </Box>
                                    </Box>
                                        <Box
                                        sx={{
                                            display: 'grid',
                                            gridTemplateColumns: 'minmax(50px, 1fr) 25px 50px 25px minmax(50px, 1fr)',
                                            alignItems: 'center',
                                            columnGap: '16px',
                                            height: '45px',
                                        }}>
                                            <Typography
                                            sx={{
                                                fontSize: {
                                                    xs: '0.6rem',
                                                    sm: '0.875rem',
                                                    md: '1rem',
                                            },
                                            textAlign: 'center',
                                            wordWrap: 'break-word'
                                            }}>
                                                {fixture.homeTeam.name}
                                            </Typography>
                                            <Avatar src={fixture.homeTeam.crest} alt={fixture.homeTeam.name} variant="square" sx={{ width: 28, height: 28 }} />
                                            <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: '5px',
                                                position: 'relative',
                                            }}>
                                                <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexDirection: 'column',
                                                    background: 'none',
                                                    borderRadius: '6px',
                                                    height: '22px',
                                                    minHeight: 'fit-content',
                                                    padding: '2px 6px',
                                                }}>
                                                    {renderMatchStatus(fixture)}
                                                </Box>
                                            </Box>
                                            <Avatar src={fixture.awayTeam.crest} alt={fixture.awayTeam.name} variant="square" sx={{ width: 28, height: 28 }} />
                                            <Typography
                                            sx={{
                                                fontSize: {
                                                    xs: '0.6rem',
                                                    sm: '0.875rem',
                                                    md: '1rem',
                                            },
                                            textAlign: 'center',
                                            wordWrap: 'break-word'
                                            }}>
                                                {fixture.awayTeam.name}
                                            </Typography>
                                        </Box>
                                </Box>
                                {
                                    !(index >= rowsPerPage-1 || index + rowsPerPage * page + 1 === fixtures.length) && <Divider />
                                }
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}