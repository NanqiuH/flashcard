'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Box, Button, CircularProgress, Container, Typography } from "@mui/material";

const ResultPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const session_id = searchParams.get('session_id');

    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCheckoutSession = async () => {
            if (!session_id) return;

            try {
                const res = await fetch(`/api/checkout_sessions?session_id=${session_id}`);
                const sessionData = await res.json();

                if (res.ok) {
                    setSession(sessionData);
                } else {
                    setError(sessionData.error || 'Failed to retrieve session information.');
                }
            } catch (err) {
                setError('An error occurred while retrieving the session.');
            } finally {
                setLoading(false);
            }
        };

        fetchCheckoutSession();
    }, [session_id]);

    if (loading) {
        return (
            <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 4 }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Loading...
                </Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
                <Box sx={{ mt: 4 }}>
                    <img src="error.png" alt="Error illustration" style={{ maxWidth: '100%', height: 'auto', marginBottom: '20px' }} />
                    <Typography variant="body1" sx={{ mb: 4 }}>
                        Oops! Something went wrong while processing your request. Please try again later or return to the homepage.
                    </Typography>
                    <Button variant="contained" color="primary" onClick={() => router.push('/')}>
                        Go to Home Page
                    </Button>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 4 }}>
            {session?.payment_status === 'paid' ? (
                <>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        Thank you for your purchase!
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6">Session ID: {session_id}</Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            We have received your payment. You will receive an email with the order details shortly.
                        </Typography>
                    </Box>
                </>
            ) : (
                <>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        Payment failed
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            Your payment was not successful. Please try again.
                        </Typography>
                        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => router.push('/')}>
                            Go to Home Page
                        </Button>
                    </Box>
                </>
            )}
        </Container>
    );
};

export default ResultPage;
