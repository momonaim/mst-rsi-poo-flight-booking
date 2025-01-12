import NavBar from '../components/NavBar';
import Login from '../components/user/Login';
import BookingDetails from './reservation/BookingDetails';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Hero from './hero/Hero';
import FlightResults from './flights/FlightResults';
import Booking from './flights/booking';
import Validation from './flights/Validation';
import Payment from './flights/Payment';
import Footer from '../components/Footer';
import { Box, Button, Typography } from '@mui/material';
import Contact from './Contact';
import About from './About';
import MyFlights from './MyFlights';
import TEST from './test';
import Destinations from './Destinations';
// import Dashboard from './dashboard/main/Dashboard';
import CheckoutForm from './flights/CheckoutForm';
import ThankYou from './flights/ThankYou';
import MyReservations from './MyReservations';
import NotFound from './NotFound';

const Home = () => {
    const navigate = useNavigate();

    const handleFlightSelect = (flight) => {
        navigate(`/flight/${flight.id}`, { state: { flight } });
    };

    return (
        <>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "100vh",
                }}
            >
                <Login />
                <NavBar />
                <Routes>
                    {/* <Route path="flight/:id" element={<BookingDetails />} /> */}
                    <Route path="booking/:id" element={<Booking />} />
                    <Route path="/validation" element={<Validation />} />
                    {/* <Route path="/payment" element={<Payment />} /> */}
                    <Route path="/pay/:reservationId" element={<CheckoutForm />} />
                    {/* <Route path="/confirmation" element={<h1>Réservation confirmée !</h1>} /> */}
                    <Route path="/thankyou" element={<ThankYou />} />
                    <Route path="/" element={<Hero onFlightSelect={handleFlightSelect} />} />
                    <Route path="/flights" element={<FlightResults />} />
                    {/* <Route path="hero" element={<Hero onFlightSelect={handleFlightSelect} />} /> */}
                    {/* <Route path="/myflights" element={<MyFlights />} /> */}
                    <Route path="/myflights" element={<MyReservations />} />
                    {/* <Route path="/myreservations" element={<MyReservations />} /> */}
                    <Route path="/destinations" element={<Destinations />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    {/* <Route path="/t" element={<TEST />} /> */}
                    {/* <Route path="/tt" element={<Dashboard />} /> */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
                <Footer />
            </Box>
        </>
    );
};

export default Home;
