import { Routes, Route } from "react-router-dom";

import Homepage from "./pages/homepage";
import SigninPage from "./pages/sign-in";
import SignupPage from "./pages/sign-up";
import DashboardPage from "./pages/dashboard";
import Explore from "./pages/explore";
import MoviesPage from "./pages/movies";
import PersonPage from "./pages/person";
import BookShowPage from "./pages/bookShow";
import BookSeatPage from "./pages/bookSeat";
import UserDashboard from "./pages/dashboard/user-dashboard";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CheckOutPage from "./pages/checkoutPage";
import OnSuccess from "./pages/checkoutPage/conversionPage/OnSuccess";
import OnFailure from "./pages/checkoutPage/conversionPage/OnFailure";
import AdminDashboard from "./pages/dashboard/admin-dashboard";


function App() {
  return ( 
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/movies/:id" element={<MoviesPage />} />
          <Route path="/person/:id" element={<PersonPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/sign-in" element={<SigninPage />} />
          <Route path="/sign-up" element={<SignupPage />} />  
          <Route path="/:location/movies/:movieId/bookShow" element={<BookShowPage />} />
          <Route path="/bookShow/:bookShowId/bookseat" element={<BookSeatPage />} /> 
          <Route path="/userDashboard" element={<UserDashboard/>} />
          <Route path="/adminDashboard" element={<AdminDashboard/>} />
          <Route path="/bookShow/:bookShowId/bookseat/checkout" element={<CheckOutPage /> } />
          <Route path="/success" element={<OnSuccess />} />
          <Route path="/failure" element={<OnFailure />} />
          <Route path="*" element={<h1 className="text-center text-2xl py-10">Not Found</h1>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
