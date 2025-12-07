import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { useGetLatest10Movies} from "../../hooks/movie.hooks";
import {fetchMovie} from '../../store/slices/movieSlice';

const Homepage = () => {
  const{data : movies} = useGetLatest10Movies();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toExplorePage = () => {
    navigate("/explore");
  }

  const toMoviePage = (id) => {
    dispatch(fetchMovie(id));
    navigate(`/movies/${id}`);
  };

  const scrollToSlide = (index) => {
    const element = document.getElementById(`slide${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a23]">
      {/* Hero Section */}
      <div 
        className="hero min-h-[70vh] relative flex items-center justify-center" 
        style={{
          backgroundImage: "linear-gradient(rgba(10,10,35,0.7),rgba(10,10,35,0.7)), url(https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1500&q=80)",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}>
        <div className="hero-content text-center relative z-10 flex flex-col items-center">
          <h1 className="mb-4 text-5xl md:text-6xl font-extrabold text-white drop-shadow-[0_0_24px_#00eaff]">Book Your <span className='text-[#00eaff]'>Movie</span> Night</h1>
          <p className="mb-6 text-lg md:text-xl text-white/90 max-w-xl">Experience the magic of cinema. Browse the latest releases, reserve your seats, and enjoy the show!</p>
          <button className="btn px-10 py-3 rounded-full bg-[#ff3cac] text-white font-bold text-lg border-none shadow-lg hover:bg-[#00eaff] hover:text-[#232946] transition-all" onClick={toExplorePage}>
            Book Tickets
          </button>
        </div>
      </div>

      {/* Featured Movies Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-[#00eaff] drop-shadow-[0_0_8px_#00eaff]">Featured Movies</h2>
          <button className="btn btn-sm px-5 py-1 rounded-full bg-[#ff3cac] text-white font-bold border-none shadow hover:bg-[#00eaff] hover:text-[#232946] transition-all" onClick={toExplorePage}>
            See More →
          </button>
        </div>

        {/* Movies Carousel */}
        <div className="relative group">
          <div className="carousel w-full space-x-4 rounded-box scroll-smooth">
            {(movies && movies.length > 0 ? movies.slice(0, 6) : [
              {
                _id: '1',
                title: 'Neon Nights',
                description: 'A dazzling journey through the city lights.',
                imageURL: 'https://images.unsplash.com/photo-1517602302552-471fe67acf66?auto=format&fit=crop&w=400&q=80',
              },
              {
                _id: '2',
                title: 'Cinema Dreams',
                description: 'Experience the magic of the big screen.',
                imageURL: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
              },
              {
                _id: '3',
                title: 'Blockbuster',
                description: 'The most awaited movie of the year.',
                imageURL: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80',
              },
            ]).map((movie, index) => (
              <div key={movie._id} id={`slide${index}`} className="carousel-item w-80 scroll-mt-0">
                <div className="card bg-[#181830] image-full w-full shadow-xl border-2 border-[#00eaff]">
                  <figure>
                    <img
                      src={movie.imageURL}
                      alt={movie.title} />
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title text-[#00eaff] drop-shadow-[0_0_4px_#00eaff]">{movie.title}</h2>
                    <p className="line-clamp-2 text-white/90">{movie.description}</p>
                    <div className="card-actions justify-end">
                      <button className="btn px-6 py-1 rounded-full bg-[#ff3cac] text-white font-bold border-none shadow hover:bg-[#00eaff] hover:text-[#232946] transition-all" onClick={() => toMoviePage(movie._id)}>Book Now</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Info Section */}
      <div className="bg-[#181830] py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl mb-4">🎬</div>
              <h3 className="text-xl font-bold mb-2 text-[#00eaff]">Latest Releases</h3>
              <p className="text-white">
                Stay updated with the newest movies hitting theaters
              </p>
            </div>
            <div>
              <div className="text-4xl mb-4">💺</div>
              <h3 className="text-xl font-bold mb-2 text-[#00eaff]">Easy Booking</h3>
              <p className="text-white">
                Book your favorite seats in just a few clicks
              </p>
            </div>
            <div>
              <div className="text-4xl mb-4">🎫</div>
              <h3 className="text-xl font-bold mb-2 text-[#00eaff]">Best Prices</h3>
              <p className="text-white">
                Get the best deals on movie tickets
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
