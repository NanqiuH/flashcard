'use client';

import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { useSearchParams } from "next/navigation";
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    CardActionArea,
    Toolbar,
    AppBar
} from '@mui/material';
import { styled } from '@mui/system';
import Head from "next/head";

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: '15px',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
        transform: 'translateY(-10px)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.15)',
    },
}));

const StyledButton = styled('a')(({ theme }) => ({
    color: 'white',
    borderColor: 'white',
    textTransform: 'none',
    marginRight: theme.spacing(2),
    textDecoration: 'none',
    padding: theme.spacing(1, 2),
    borderRadius: theme.shape.borderRadius,
    border: '1px solid white',
    transition: 'background-color 0.3s ease',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
}));

const StyledAppBar = styled(AppBar)({
    backgroundColor: '#333',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
});

const FlashcardContent = styled(CardContent)(({ flipped }) => ({
    minHeight: 150,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: '20px',
    borderRadius: '15px',
    backgroundColor: flipped ? '#6a11cb' : '#007bff',
    backgroundImage: flipped ? 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)' : 'none',
    color: '#fff',
    fontSize: '1.2rem',
    fontWeight: '500',
    transition: 'background-color 0.3s ease, color 0.3s ease',
}));

const Wrapper = styled('div')({
    display: 'flex',
    width: '100vw',
    height: '105vh',
});

const FlashcardSection = styled('div')({
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '30px',
    overflowY: 'auto',
});

const BackgroundSection = styled('div')({
    flex: 1,
    backgroundImage: `url('hero-bg.png')`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
});

export default function Flashcard() {
    // User authentication and state management
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState({});

    const searchParams = useSearchParams();
    const search = searchParams.get('id');

    useEffect(() => {
        // Fetch flashcards based on the search parameter and user ID
        async function getFlashcard() {
            if (!search || !user) return;

            const colRef = collection(doc(collection(db, 'users'), user.id), search);
            const docs = await getDocs(colRef);
            const flashcards = [];

            docs.forEach((doc) => {
                flashcards.push({ id: doc.id, ...doc.data() });
            });
            setFlashcards(flashcards);
        }
        getFlashcard();
    }, [search, user]);

    // Handle flashcard flipping
    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    if (!isLoaded || !isSignedIn) {
        return null; // Return null if user is not signed in or data is not loaded
    }

    return (
        <>
            <Head>
                <title>QuickStudy</title>
                <meta name="description" content="Manage your flashcard collections with ease." />
            </Head>

            <StyledAppBar position="static">
                <Toolbar>
                    <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                        QuickStudy
                    </Typography>
                    <StyledButton href="/">Home</StyledButton>
                    <StyledButton href="/generate">Generate Flashcard</StyledButton>
                    <StyledButton href="/flashcards">Your Collections</StyledButton>
                    <SignedOut>
                        <StyledButton href="/sign-in">Login</StyledButton>
                        <StyledButton href="/sign-up">Sign Up</StyledButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton showName={false} />
                    </SignedIn>
                </Toolbar>
            </StyledAppBar>

            <Wrapper>
                <FlashcardSection>
                    {flashcards.length > 0 ? (
                        <Box>
                            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
                                Flashcards Review
                            </Typography>
                            <Typography variant="body1" component="p" sx={{ mb: 4, fontSize: '1.5rem', color: '#333' }}>
                                Click on the flashcards to see the answers.
                            </Typography>
                            <Grid container spacing={3}>
                                {flashcards.map((flashcard, index) => (
                                    <Grid item xs={12} sm={6} md={4} key={index}>
                                        <StyledCard onClick={() => handleCardClick(index)}>
                                            <CardActionArea>
                                                <FlashcardContent flipped={flipped[index]}>
                                                    <Typography variant="h6">
                                                        {flipped[index] ? (flashcard.back || 'No content on the back') : (flashcard.front || 'No content on the front')}
                                                    </Typography>
                                                </FlashcardContent>
                                            </CardActionArea>
                                        </StyledCard>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    ) : (
                        <Typography variant="h6" color="textSecondary">
                            No flashcards found. Please generate some flashcards to review.
                        </Typography>
                    )}
                </FlashcardSection>
                <BackgroundSection />
            </Wrapper>
        </>
    );
}
