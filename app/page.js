import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AppBar, Container, Toolbar, Typography, Button, Box, Grid } from "@mui/material";
import Head from "next/head";

export default function Home() {
  return (
    <Container maxWidth="100vw">
      <Head>
        <title>Flashcard Saas</title>
        <meta name="description" content="Create flashcard from your text"></meta>
      </Head>

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{flexGrow: 1}}>
            Flashcard SaaS
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">Login</Button>
            <Button color="inherit" href="/sign-up">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{textAlign: 'center', my: 4}}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Flashcard SaaS
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          The easiest way to create flashcards from your text.
        </Typography>
        <Button variant="contained" color="primary" sx={{mt: 2, mr: 2}} href="/generate">
          Get Started
        </Button>
        <Button variant="outlined" color="primary" sx={{mt: 2}}>
          Learn More
        </Button>
      </Box>

      {/* Features */}
      <Box sx={{ my: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Features
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" component="h3" gutterBottom>
              Adaptive Learning
            </Typography>
            <Typography variant="body1">
              Flashcards adapt to the user's learning pace and difficulty level, focusing on areas where they need the most practice.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" component="h3" gutterBottom>
              AI-Powered Content Generation
            </Typography>
            <Typography variant="body1">
              Automatically generate flashcard content from uploaded documents, lectures, or other learning materials using AI.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" component="h3" gutterBottom>
              AI-Based Difficulty Adjustment
            </Typography>
            <Typography variant="body1">
              The system automatically adjusts the difficulty of flashcards based on the user’s performance, presenting harder cards more frequently and easier ones less often.
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Pricing */}
      <Box sx={{ my: 6, textAlign: 'center' }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Pricing
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          
          {/* Free Plan */}
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 3, textAlign: 'left', minHeight: 350 }}>
              <Typography variant="h5" component="h3" gutterBottom>
                Free
              </Typography>
              <Typography variant="h6" component="p">
                $0 / month
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Perfect for individuals who want to try out the basic features.
              </Typography>
              <ul>
                <li>Basic flashcard creation</li>
                <li>Limited to 50 flashcards</li>
                <li>AI-based content generation (limited)</li>
                <li>Basic support</li>
              </ul>
              <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} href="/sign-up">
                Get Started
              </Button>
            </Box>
          </Grid>
          
          {/* Pro Plan */}
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 3, textAlign: 'left', minHeight: 350 }}>
              <Typography variant="h5" component="h3" gutterBottom>
                Pro
              </Typography>
              <Typography variant="h6" component="p">
                $9.99 / month
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                For advanced learners who need more features and flexibility.
              </Typography>
              <ul>
                <li>Unlimited flashcard creation</li>
                <li>Enhanced AI-based content generation</li>
                <li>Advanced adaptive learning features</li>
                <li>Priority support</li>
                <li>Export flashcards to PDF</li>
              </ul>
              <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} href="/sign-up">
                Choose Pro
              </Button>
            </Box>
          </Grid>
          
          {/* Team Plan */}
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 3, textAlign: 'left', minHeight: 350 }}>
              <Typography variant="h5" component="h3" gutterBottom>
                Team
              </Typography>
              <Typography variant="h6" component="p">
                $29.99 / month
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Ideal for teams or educational institutions with collaborative features.
              </Typography>
              <ul>
                <li>Everything in Pro, plus:</li>
                <li>Team management features</li>
                <li>Collaborative flashcard creation</li>
                <li>Analytics and performance tracking</li>
                <li>Dedicated account manager</li>
              </ul>
              <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} href="/sign-up">
                Choose Team
              </Button>
            </Box>
          </Grid>
          
        </Grid>
      </Box>


  </Container>
  )
}
