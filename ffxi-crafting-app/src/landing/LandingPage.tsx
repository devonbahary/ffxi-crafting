import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Fade from '@mui/material/Fade';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { NAVIGABLE_ROUTE_ITEMS } from '../routes';
import { LandingPageCard } from './LandingPageCard';
import { useFadeIn } from '../hooks/use-fade-in';
import { FADE_IN_TIMEOUT } from '../common/constants';

export const LandingPage = () => {
    const { ref, fadeIn } = useFadeIn();

    return (
        <main>
            <Fade in timeout={FADE_IN_TIMEOUT}>
                <Container maxWidth="sm">
                    <Box
                        display="flex"
                        flexDirection="column"
                        minHeight="90vh"
                        justifyContent="space-around"
                    >
                        <Box>
                            <Typography
                                component="h1"
                                variant="h2"
                                align="center"
                                color="primary"
                                gutterBottom
                            >
                                FFXI Crafting
                            </Typography>
                            <Typography
                                variant="h5"
                                align="center"
                                color="text.secondary"
                                paragraph
                            >
                                A tool to maximize profits in the online
                                videogame Final Fantasy XI.
                            </Typography>
                        </Box>
                        <Fade in={fadeIn} timeout={FADE_IN_TIMEOUT}>
                            <Box pt={12} pb={6} ref={ref}>
                                <Typography
                                    variant="subtitle1"
                                    fontStyle="italic"
                                >
                                    "I've logged in but what items should I
                                    craft to make the most money?"
                                </Typography>
                                <Typography variant="subtitle1" align="right">
                                    - Me (every time)
                                </Typography>
                            </Box>
                        </Fade>
                    </Box>
                </Container>
            </Fade>
            <Container sx={{ py: 8 }} maxWidth="lg">
                <Grid container spacing={4}>
                    {NAVIGABLE_ROUTE_ITEMS.map((r) => (
                        <LandingPageCard key={r.path} routeItem={r} />
                    ))}
                </Grid>
            </Container>
        </main>
    );
};
