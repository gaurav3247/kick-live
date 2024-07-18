import { Box  , List, ListItem, ListItemText, Link, Divider, Typography, Grid } from '@mui/material';
import MatchesTable from './components/matchesTable';


export default function Home() {

  return (
    <Box>
      <Box
        id='matchamte'
        sx={{
          paddingTop: '50px',
        }}>
          <Grid container rowSpacing={5} columnSpacing={15} sx={{ justifyContent: 'center' }}>
            <Grid item xs={8} md={2} order={{ xs: 2, md: 0 }}>
              <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: 'max-content',
                bgcolor: 'background.default',
                color: 'text.primary',
                minWidth: '200px',
                border: '1px solid',
                borderRadius: '5px',
                paddingTop: '10px',
              }}>
                <Typography sx={{ paddingLeft: '10px' }} variant='h6' color='textPrimary'>Leagues</Typography>
                <Divider variant='fullWidth' />
                <List sx={{ padding: 0 }}>
                  <ListItem sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      color: '#202124',
                    },
                  }}>
                    <Link href='/standings/PL' underline='none' color='inherit'>
                      <ListItemText primary='Premier League' sx={{ paddingLeft: '10px' }}/>
                    </Link>
                  </ListItem >
                  <Divider />
                  <ListItem sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      color: '#202124',
                    },
                  }}>
                    <Link href='/standings/PD' underline='none' color='inherit'>
                      <ListItemText primary='La Liga' sx={{ paddingLeft: '10px' }}/>
                    </Link>
                  </ListItem>
                  <Divider />
                  <ListItem sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      color: '#202124',
                    },
                  }}>
                    <Link href='/standings/SA' underline='none' color='inherit'>
                      <ListItemText primary='Serie A' sx={{ paddingLeft: '10px' }}/>
                    </Link>
                  </ListItem>
                  <Divider />
                  <ListItem sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      color: '#202124',
                    },
                  }}>
                    <Link href='/standings/BL1' underline='none' color='inherit'>
                      <ListItemText primary='Bundesliga' sx={{ paddingLeft: '10px' }}/>
                    </Link>
                  </ListItem>
                  <Divider />
                  <ListItem sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      color: '#202124',
                    },
                  }}>
                    <Link href='/standings/FL1' underline='none' color='inherit'>
                      <ListItemText primary='Ligue 1' sx={{ paddingLeft: '10px' }}/>
                    </Link>
                  </ListItem>
                </List>
              </Box>
            </Grid>
            <Grid item xs={12} md={10} order={{ xs: 1, md: 0 }}>
              <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                height: 'auto',
                bgcolor: 'background.default',
                color: 'text.primary',
                flexGrow: 1,
              }}>
                <MatchesTable />
              </Box>
            </Grid>
          </Grid>
      </Box>
    </Box>
  );
}
