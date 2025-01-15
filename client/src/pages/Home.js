import NavBar from '../components/NavBar';
import Login from '../components/user/Login';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Hero from './hero/Hero';
import FlightResults from './flights/FlightResults';
import Booking from './flights/booking';
import Validation from './flights/Validation';
import Footer from '../components/Footer';
import { Box } from '@mui/material';
import Contact from './Contact';
import About from './About';
import Destinations from './Destinations';
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
                    <Route path="booking/:id" element={<Booking />} />
                    <Route path="/validation" element={<Validation />} />
                    <Route path="/pay/:reservationId" element={<CheckoutForm />} />
                    <Route path="/thankyou" element={<ThankYou />} />
                    <Route path="/" element={<Hero onFlightSelect={handleFlightSelect} />} />
                    <Route path="/flights" element={<FlightResults />} />
                    <Route path="/myflights" element={<MyReservations />} />
                    <Route path="/destinations" element={<Destinations />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
                <Footer />
            </Box>
        </>
    );
};

export default Home;
