import { Route, Routes, useMatch } from "react-router-dom";
import Header from "./components/shared/Header";
import Footer from "./components/shared/Footer";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import Profile from "./pages/Profile";
import MovieDetails from "./pages/MovieDetails";
import SeatLayout from "./pages/seat-layout";
import Checkout from "./pages/Checkout";
import { SeatProvider } from "./context/SeatContext";

function App() {
  const isSeatLayoutPage = useMatch("/movies/:movieId/:movieName/:state/theater/:theaterId/show/:showId/seat-layout");
  const isCheckoutPage = useMatch("/checkout");
  const hideHeaderFooter = isSeatLayoutPage || isCheckoutPage;

  return (
    <SeatProvider>
      <div className="flex flex-col min-h-screen">
        {!hideHeaderFooter && <Header />}
        <main className="grow">
          <Routes>
            {/* Define your routes here */}
            <Route path="/" element={<Home />} />
            <Route path="/profile/:id" element={<h1>Profile Page</h1>} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/movies/:state/:movieName/:id/ticket" element={<MovieDetails />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/movies/:movieId/:movieName/:state/theater/:theaterId/show/:showId/seat-layout" element={<SeatLayout />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </main>
        {!hideHeaderFooter && <Footer />}
      </div>
    </SeatProvider>
  );
}

export default App;