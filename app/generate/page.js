'use client'
import { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  DialogActions,
  CardActionArea,
  CircularProgress,
  AppBar,
  Toolbar,
} from '@mui/material';
import { SignedIn, SignedOut, SignIn, UserButton, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { doc, collection, getDoc, writeBatch } from 'firebase/firestore';
import { db } from '@/firebase';
import { styled } from '@mui/system';
import Head from 'next/head';


const HeroBox = styled(Box)({
  position: 'relative',
  backgroundImage: 'url("/hero-bg.png")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  minHeight: '50vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  padding: '2rem',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  color: '#fff',
  zIndex: 1,
});

const HeroContent = styled(Box)({
  position: 'relative',
  zIndex: 2,
  color: '#fff',
  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)', 
});

const StyledContainer = styled(Container)({
  marginTop: '2rem',
});

const StyledButton = styled(Button)({
  background: '#007bff',
  borderRadius: '50px',
  padding: '0.75rem 1.5rem',
  fontSize: '1rem',
  fontWeight: 'bold',
  color: '#fff',
  '&:hover': {
    background: '#0056b3',
  },
});

const StyledButtonAppBar = styled('a')(({ theme }) => ({
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

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser();  
  const [text, setText] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert('Please enter some text to generate flashcards.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate flashcards');
      }

      const data = await response.json();
      setFlashcards(data);
    } catch (error) {
      console.error('Error generating flashcards:', error);
      alert('An error occurred while generating flashcards. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (index) => {
    setFlipped((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const saveFlashcards = async () => {
    if (!name.trim()) {
      alert('Please enter a name for your flashcard set.');
      return;
    }

    const batch = writeBatch(db);
    const userDocRef = doc(collection(db, 'users'), user.id);
    const docSnap = await getDoc(userDocRef);

    if(docSnap.exists()) {
      const collections = docSnap.data().flashcards || [];
      if(collections.find((f) => f.name === name)) {
        alert('Flashcard collection with the same name already exists.');
        return;
      } else {
        collections.push({name});
        batch.set(userDocRef, {flashcards: collections}, {merge: true});
      }
    } else {
      batch.set(userDocRef, {flashcards: [{name}]});
    }

    const colRef = collection(userDocRef, name);
    flashcards.forEach((flashcard) => {
      const cardDocRef = doc(colRef);
      batch.set(cardDocRef, flashcard);
    });

    await batch.commit();
    handleClose();
    router.push('/flashcards');
  };

  return (
    <>
      <Head>
        <title>Flashcard SaaS</title>
        <meta name="description" content="Create flashcards from your text" />
      </Head>

      <AppBar position="static" sx={{ backgroundColor: '#333', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, color: 'white', fontWeight: 'bold', mr: 1 }}> 
            Flashcard SaaS
          </Typography>
          <StyledButtonAppBar href="/">Home</StyledButtonAppBar>
          <StyledButtonAppBar href="/flashcards">Flashcard Collections</StyledButtonAppBar>
          <SignedOut>
            <Button 
              variant="outlined" 
              href="/sign-in" 
              sx={{ color: 'white', borderColor: 'white', ml: 2, textTransform: 'none' }}
            >
              Login
            </Button>
            <Button 
              variant="outlined" 
              href="/sign-up" 
              sx={{ color: 'white', borderColor: 'white', ml: 2, textTransform: 'none' }}
            >
              Sign Up
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton sx={{ color: 'white', ml: 2 }} />
          </SignedIn>
        </Toolbar>
      </AppBar>





      <HeroBox>
        <HeroContent>
          <Typography variant="h2" component="h1" gutterBottom>
            Generate Flashcards
          </Typography>
          <Typography variant="h5" component="p" gutterBottom>
            Create your flashcards with ease.
          </Typography>
        </HeroContent>
      </HeroBox>
      
      <StyledContainer maxWidth="md">
        <Typography variant="h4" component="h2" sx={{ mb: 4 }}>
          Generate Flashcards from Text
        </Typography>
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          label="Enter text"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#007bff',
              },
              '&:hover fieldset': {
                borderColor: '#0056b3',
              },
            },
          }}
        />
        <StyledButton
          variant="contained"
          onClick={handleSubmit}
          fullWidth
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate Flashcards'}
        </StyledButton>

        {flashcards.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Generated Flashcards Preview
            </Typography>
            <Typography variant="body1" component="p" sx={{ mb: 4 }}>
              Click on the flashcards to see the answers.
            </Typography>
            <Grid container spacing={2}>
              {flashcards.map((flashcard, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card
                    sx={{
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  >
                    <CardActionArea onClick={() => handleCardClick(index)}>
                      <CardContent
                        sx={{
                          minHeight: 120,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: flipped[index] ? '#0056b3' : '#007bff',
                          color: '#fff',
                        }}
                      >
                        <Typography variant="h6">
                          {flipped[index] ? flashcard.back : flashcard.front}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <StyledButton onClick={handleOpen}>
                Save Flashcards
              </StyledButton>
            </Box>
          </Box>
        )}

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Save Flashcard Set</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter a name for your flashcard set.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Set Name"
              type="text"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <StyledButton onClick={saveFlashcards}>
              Save
            </StyledButton>
          </DialogActions>
        </Dialog>
      </StyledContainer>
    </>
  );
}
