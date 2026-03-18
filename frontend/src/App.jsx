import { Route, Routes } from "react-router-dom";
import Header from "./components/shared/Header";
import Footer from "./components/shared/Footer";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import Profile from "./pages/Profile";

function App() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
      <Header />
        <main className="grow">
          <Routes>
            {/* Define your routes here */}
            <Route path="/" element={<Home />} />
            <Route path="/profile/:id" element={<h1>Profile Page</h1>} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/Profile" element={<Profile />} />
          </Routes> 
         </main>
        <Footer />
      </div>
    </>
  );
}

export default App;