import { Box, Avatar, Typography, Card, CardHeader } from "@mui/material";
import { Squad, Person } from "../types";
import { Competition } from "@/app/components/matchesTable";


function PersonCard({person}: {person?: Person}) {
    return (
        <Card sx={{ width: 240 } }>
            <CardHeader
            title={person?.name}
            subheader={person?.nationality}
            avatar={
                <Avatar variant="square">
                    {person?.name.split(' ').filter((part, index) => index < 2).map(namePart => namePart[0]).join('')}
                </Avatar>
            }
            />
        </Card>
    );
}

export default function TeamSquad( {squad, coach} : {
    squad?: Squad;
    coach?: Person;
}) {

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
            }}>
            <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                border: '1px solid #ccc',
                padding: '16px',
                borderRadius: '5px',
            }}>
                <Typography
                sx={{
                    fontSize: {
                        xs: '0.75rem',
                        sm: '0.875rem',
                        md: '1rem',
                    },
                wordWrap: 'break-word'
                }}>
                    Coach
                </Typography>
                <PersonCard person={coach} />
            </Box>
            {
                squad && Object.keys(squad).map((position) => (
                    <Box
                        key={position}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
                            border: '1px solid #ccc',
                            padding: '16px',
                            borderRadius: '5px',
                        }}>
                            <Typography
                            sx={{
                                fontSize: {
                                    xs: '0.75rem',
                                    sm: '0.875rem',
                                    md: '1rem',
                                },
                            wordWrap: 'break-word'
                            }}>
                                {position}
                            </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: '16px',
                                flexWrap: 'wrap',
                                
                            }}>
                            {squad[position].map((player) => (
                                <PersonCard key={player.id} person={player} />
                            ))}
                        </Box>
                    </Box>
                ))
            }
        </Box>
    );
}