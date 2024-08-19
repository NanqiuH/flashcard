'use client'

import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AppBar, Container, Toolbar, Typography, Button, Box, Grid } from "@mui/material";
import Head from "next/head";
import BackgroundImage from '@/public/hero-bg.png';
import BookIcon from '@mui/icons-material/Book';
import AssignmentIcon from "@mui/icons-material/Assignment"
import BarChartIcon from "@mui/icons-material/BarChart"
import { styled } from '@mui/system';

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

export default function Home() {

  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_session', {
      method: 'POST',
      headers: { origin: 'http://localhost:3000' },
    })
    const checkoutSessionJson = await checkoutSession.json()
  
    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })
  
    if (error) {
      console.warn(error.message)
    }
  }

  const handleSubmitTeam = async () => {
    const checkoutSession = await fetch('/api/checkout_session_team', {
      method: 'POST',
      headers: { origin: 'http://localhost:3000' },
    })
    const checkoutSessionJson = await checkoutSession.json()
  
    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })
  
    if (error) {
      console.warn(error.message)
    }
  }

  return (
    <Container maxWidth="100vw" disableGutters>
      <Head>
        <title>Flashcard Saas</title>
        <meta name="description" content="Create flashcard from your text"></meta>
      </Head>

      <AppBar position="static" sx={{ backgroundColor: '#333' }}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, color: 'white' }}>
            Flashcard SaaS
          </Typography>
          <StyledButton href="/flashcards">Your collections</StyledButton>
          <SignedOut>
            <Button color="inherit" href="/sign-in" sx={{ color: 'white', borderColor: 'white', ml: 2 }}>
              Login
            </Button>
            <Button color="inherit" href="/sign-up" sx={{ color: 'white', borderColor: 'white', ml: 2 }}>
              Sign Up
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton sx={{ color: 'white' }} />
          </SignedIn>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', my: 4, backgroundImage: `url(${BackgroundImage.src})`, backgroundSize: 'cover', backgroundPosition: 'center', color: 'white', py: 10, position: 'relative' }}>
        {/* Background overlay for better text visibility */}
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />
        <Typography variant="h1" component="h1" gutterBottom sx={{ fontWeight: 'bold', position: 'relative', zIndex: 1 }}>
          Welcome to Flashcard SaaS
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4, position: 'relative', zIndex: 1 }}>
          The easiest way to create flashcards from your text.
        </Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2, mr: 2, position: 'relative', zIndex: 1 }} href="/generate">
          Get Started
        </Button>
        <Button variant="outlined" color="secondary" sx={{ mt: 2, position: 'relative', zIndex: 1, color: 'white', borderColor: 'white' }}>
          Learn More
        </Button>
      </Box>

      {/* Features */}
      <Box sx={{ my: 6 }}>
        <Typography variant="h3" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 6 }}>
          Features
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4} sx={{ textAlign: 'center' }}>
            <BookIcon fontSize="large" />
            <Typography variant="h5" component="h3" gutterBottom>
              Adaptive Learning
            </Typography>
            <Typography variant="body1">
              Flashcards adapt to the user&apos;s learning pace and difficulty level, focusing on areas where they need the most practice.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} sx={{ textAlign: 'center' }}>
            <AssignmentIcon fontSize="large" />
            <Typography variant="h5" component="h3" gutterBottom>
              AI-Powered Content Generation
            </Typography>
            <Typography variant="body1">
              Automatically generate flashcard content from uploaded documents, lectures, or other learning materials using AI.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} sx={{ textAlign: 'center' }}>
            <BarChartIcon fontSize="large" />
            <Typography variant="h5" component="h3" gutterBottom>
              AI-Based Difficulty Adjustment
            </Typography>
            <Typography variant="body1">
              The system automatically adjusts the difficulty of flashcards based on the user’s performance, presenting harder cards more frequently and easier ones less often.
            </Typography>
          </Grid>
        </Grid>
      </Box>


      {/* Pricing */}
      <Box sx={{ my: 6, textAlign: 'center', py: 6, backgroundColor: '#f7f7f7' }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Pricing
        </Typography>
        <Grid container spacing={4} justifyContent="center" alignItems="stretch">

          {/* Free Plan */}
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ 
              borderRadius: 4, 
              p: 4, 
              textAlign: 'center', 
              backgroundColor: '#fff', 
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <Box>
                <Typography variant="h4" component="h3" gutterBottom sx={{ 
                  mt: 3, 
                  fontFamily: '"Comic Sans MS", cursive, sans-serif', 
                  fontWeight: 'bold',
                  fontSize: '3rem'
                }}>
                  Free
                </Typography>
                <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                  $0
                  <Typography variant="body1" component="span" sx={{ fontWeight: 'normal', fontSize: '1.25rem', ml: 1 }}>
                    / month
                  </Typography>
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, mb: 3 }}>
                  Perfect for individuals who want to try out the basic features.
                </Typography>
                <ul style={{ paddingLeft: 20, textAlign: 'left', marginTop: '16px' }}>
                  <li>Basic flashcard creation</li>
                  <li>Limited to 50 flashcards</li>
                  <li>AI-based content generation (limited)</li>
                  <li>Basic support</li>
                </ul>
              </Box>
              <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} href="/generate">
                Get Started
              </Button>
            </Box>
          </Grid>

          {/* Pro Plan */}
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ 
              borderRadius: 4, 
              p: 4, 
              textAlign: 'center',  
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
              backgroundColor: '#fff',
              position: 'relative',
              overflow: 'hidden',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <Typography variant="caption" component="div" sx={{ 
                backgroundColor: '#ff9800', 
                color: '#fff', 
                borderRadius: '4px', 
                padding: '15px 20px', 
                position: 'absolute', 
                top: '-12px', 
                left: '-15px',
                transform: 'rotate(-12deg)',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
              }}>
                Best deal
              </Typography>
              <Box>
                <Typography variant="h4" component="h3" gutterBottom sx={{ 
                  mt: 6, 
                  fontFamily: '"Comic Sans MS", cursive, sans-serif', 
                  fontWeight: 'bold',
                  fontSize: '3rem'
                }}>
                  Pro
                </Typography>
                <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                  $9.99
                  <Typography variant="body1" component="span" sx={{ fontWeight: 'normal', fontSize: '1.25rem', ml: 1 }}>
                    / month
                  </Typography>
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, mb: 3 }}>
                  For advanced learners who need more features and flexibility.
                </Typography>
                <ul style={{ paddingLeft: 20, textAlign: 'left', marginTop: '16px' }}>
                  <li>Unlimited flashcard creation</li>
                  <li>Enhanced AI-based content generation</li>
                  <li>Advanced adaptive learning features</li>
                  <li>Priority support</li>
                  <li>Export flashcards to PDF</li>
                </ul>
              </Box>
              <Button variant="contained" color="primary" fullWidth sx={{ mt: 2, backgroundColor: '#ff9800', color: '#fff' }} onClick={handleSubmit}>
                Choose Pro
              </Button>
            </Box>
          </Grid>

          {/* Team Plan */}
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ 
              borderRadius: 4, 
              p: 4, 
              textAlign: 'center', 
              backgroundColor: '#fff', 
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <Box>
                <Typography variant="h4" component="h3" gutterBottom sx={{ 
                  mt: 3, 
                  fontFamily: '"Comic Sans MS", cursive, sans-serif', 
                  fontWeight: 'bold',
                  fontSize: '3rem'
                }}>
                  Team
                </Typography>
                <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                  $29.99
                  <Typography variant="body1" component="span" sx={{ fontWeight: 'normal', fontSize: '1.25rem', ml: 1 }}>
                    / month
                  </Typography>
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, mb: 3 }}>
                  Ideal for teams or educational institutions with collaborative features.
                </Typography>
                <ul style={{ paddingLeft: 20, textAlign: 'left', marginTop: '16px' }}>
                  <li>Everything in Pro, plus:</li>
                  <li>Team management features</li>
                  <li>Collaborative flashcard creation</li>
                  <li>Analytics and performance tracking</li>
                  <li>Dedicated account manager</li>
                </ul>
              </Box>
              <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleSubmitTeam}>
                Choose Team
              </Button>
            </Box>
          </Grid>

        </Grid>
      </Box>


    </Container>
  )
}