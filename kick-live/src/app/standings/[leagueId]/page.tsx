'use client'
import { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Avatar, Box, Skeleton, Link, Divider } from '@mui/material';

import { Competition } from '@/app/components/matchesTable';
import baseApi from '@/app/core/baseApi';
// import Link from 'next/link';


interface TeamInfo {
    id: number;
    name: string;
    shortName: string;
    tla: string;
    crest: string;
}

interface Standing {
    position: number;
    team: TeamInfo;
    playedGames: number;
    form: string | null;
    won: number;
    draw: number;
    lost: number;
    points: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
}

async function fetchStandings(league: string | null) {
    if (!league) {
        return [];
    }
    try {
        const response = await baseApi.get(`/standings/${league}`);
        const data = await response.data;
        return data;
    } catch (error) {
        console.error("Failed to fetch standings:", error);
        return [];
    }
}

export default function Standings( { params }: {
    params: {
        leagueId: string;
    };
}
) {
    const [standings, setStandings] = useState<Standing[]>([]);
    const [leagueInfo, setLeagueInfo] = useState<Competition>({} as Competition);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchStandings(params.leagueId)
        .then(data => {
            setLeagueInfo(data.competition);
            setStandings(data.standings || []);
            setIsLoading(false);
        });
    }, [params.leagueId]);

    return isLoading ? (
        <>
            <h1>Standings</h1>
            <Skeleton variant='circular' width={40} height={40} sx={{ marginBottom: '20px' }}/>
            <Skeleton variant='rectangular' width='100%' height='600px' sx={{ borderRadius: '5px' }}/>
        </>
    ) : (
        <>
            <h1>Standings</h1>
            <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: '10px',
                marginBottom: '20px',
            }}>
                <Avatar src={leagueInfo?.emblem} alt={leagueInfo?.code} variant='square'/>
                <h2 style={{margin: 0, alignSelf: 'center'}}>{leagueInfo?.name}</h2>
            </Box>
            <TableContainer
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: '10px',
              alignItems: 'center',
              justifyContent: 'center',
            //   paddingBottom: '10px',
              marginBottom: '20px',
              borderRadius: '5px',
              backgroundColor: '#f5f5f5',
            }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Team</TableCell>
                  <TableCell>PL</TableCell>
                  <TableCell>W/D/L</TableCell>
                  <TableCell>PTS</TableCell>
                  <TableCell>+/-</TableCell>
                  <TableCell>GD</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {standings.map((standing, index) => (
                  <TableRow key={standing.team.id} hover>
                    <TableCell sx={{ display: 'flex' }}>
                        <Divider variant='middle' orientation='vertical' sx={{ bgcolor: index <= 3 ? 'green' : index === 4 ? 'black' : index === 5 ? 'pink' : '' }}/>
                        <span style={{ paddingLeft: '0.5rem' }}>
                            {index + 1}
                        </span>
                    </TableCell>
                    <TableCell>
                        <Link href={`/teams/${standing.team.id}`} underline='none' sx={{ display: 'flex', alignItems: 'center', gap: '1rem', width: 'max-content' }}>
                            <Avatar alt={standing.team.tla} variant='square' src={standing.team.crest} sx={{ width: 18, height: 18, objectFit: 'contain' }}/>
                            {standing.team.name}
                        </Link>
                    </TableCell>
                    <TableCell>{standing.playedGames}</TableCell>
                    <TableCell>{standing.won}/{standing.draw}/{standing.lost}</TableCell>
                    <TableCell>{standing.points}</TableCell>
                    <TableCell>{standing.goalsFor}/{standing.goalsAgainst}</TableCell>
                    <TableCell>{standing.goalDifference}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
    );
}