'use client';

import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  AppBar,
  Toolbar,
  Box,
} from '@mui/material';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
import { doc, getDoc, setDoc, collection } from 'firebase/firestore';
import { db } from '@/firebase';
import { useRouter } from 'next/navigation';
import { styled } from '@mui/system';
import Head from 'next/head';

const HeroBox = styled(Box)({
  position: 'relative',
  backgroundImage: 'url("/hero-bg.png")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  minHeight: '40vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  padding: '2rem',
  color: '#fff',
  zIndex: 1,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: -1,
  },
});

const HeroContent = styled(Box)({
  position: 'relative',
  zIndex: 2,
  color: '#fff',
  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',
});

const StyledAppBar = styled(AppBar)({
  backgroundColor: '#333',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
});

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

const FlashcardContainer = styled(Container)({
  marginTop: '2rem',
  marginBottom: '2rem',
});

const StyledCard = styled(Card)({
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
  },
});

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function getFlashcards() {
      if (!user) return;
      const docRef = doc(collection(db, 'users'), user.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const collections = docSnap.data().flashcards || [];
        setFlashcards(collections);
      } else {
        await setDoc(docRef, { flashcards: [] });
      }
    }
    getFlashcards();
  }, [user]);

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  const handleCardClick = (id) => {
    router.push(`/flashcard?id=${id}`);
  };

  return (
    <>
      <Head>
        <title>Flashcard SaaS</title>
        <meta name="description" content="Manage your flashcard collections with ease." />
      </Head>

      <StyledAppBar position="static">
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Flashcard SaaS
          </Typography>
          <StyledButton href="/">Home</StyledButton>
          <StyledButton href="/generate">Generate Flashcard</StyledButton>
          <SignedOut>
            <StyledButton href="/sign-in">Login</StyledButton>
            <StyledButton href="/sign-up">Sign Up</StyledButton>
          </SignedOut>
          <SignedIn>
            <UserButton showName={false} />
          </SignedIn>
        </Toolbar>
      </StyledAppBar>

      <HeroBox>
        <HeroContent>
          <Typography variant="h3" component="h1" gutterBottom>
            Your Flashcard Collections
          </Typography>
          <Typography variant="h6" component="p">
            Click on a collection to view and study your flashcards.
          </Typography>
        </HeroContent>
      </HeroBox>

      <FlashcardContainer maxWidth="md">
        {flashcards.length === 0 ? (
          <Typography variant="h6" align="center" sx={{ mt: 4 }}>
            You don't have any flashcard collections yet. Start by creating one!
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <StyledCard onClick={() => handleCardClick(flashcard.name)}>
                  <CardActionArea>
                    <CardContent
                      sx={{
                        height: 150,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#f5f5f5',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Adding a background gradient and a more dynamic text styling */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
                          zIndex: 1,
                          opacity: 0.9,
                        }}
                      />
                      <Typography
                        variant="h6"
                        align="center"
                        sx={{
                          position: 'relative',
                          zIndex: 2,
                          color: '#fff',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          letterSpacing: 1.5,
                          textShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
                        }}
                      >
                        {flashcard.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </StyledCard>

              </Grid>
            ))}
          </Grid>
        )}
      </FlashcardContainer>
    </>
  );
}
