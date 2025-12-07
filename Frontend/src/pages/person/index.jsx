import { useParams, useNavigate } from "react-router-dom";
import { useGetPersonById, useGetMoviesByPerson } from "../../hooks/person.hooks";

const PersonPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: person, isLoading: personLoading } = useGetPersonById(id);
  const { data: movies, isLoading: moviesLoading } = useGetMoviesByPerson(id);

  if (personLoading) {
    return (
      <div className="p-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="skeleton h-96 w-80"></div>
          <div className="flex-1 space-y-4">
            <div className="skeleton h-12 w-3/4"></div>
            <div className="skeleton h-6 w-1/4"></div>
            <div className="skeleton h-32 w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="p-10">
        <h1 className="text-2xl">Person not found</h1>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="p-10">
      {/* Person Details Section */}
      <div className="hero bg-neutral rounded-lg mb-10">
        <div className="hero-content flex-col lg:flex-row gap-8 py-10">
          <img
            src={person.imageURL || "https://img.daisyui.com/images/stock/photo-1567653418876-5bb0e566e1c2.webp"}
            className="rounded-lg shadow-2xl w-80 h-96 object-cover"
            alt={person.name}
          />
          <div className="flex-1">
            <h1 className="text-5xl font-bold mb-4">{person.name}</h1>
            
            {/* Personal Info */}
            <div className="space-y-2 mb-6">
              {person.dateOfBirth && (
                <p className="text-lg">
                  <span className="font-semibold">Born:</span> {formatDate(person.dateOfBirth)}
                  {person.placeOfBirth && ` in ${person.placeOfBirth}`}
                </p>
              )}
              {person.nationality && (
                <p className="text-lg">
                  <span className="font-semibold">Nationality:</span> {person.nationality}
                </p>
              )}
              {person.gender && (
                <p className="text-lg">
                  <span className="font-semibold">Gender:</span> {person.gender}
                </p>
              )}
            </div>

            {/* Biography */}
            {person.bio && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Biography</h2>
                <p className="text-base leading-relaxed">{person.bio}</p>
              </div>
            )}

            {/* Known For */}
            {person.knownFor && person.knownFor.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Known For</h3>
                <div className="flex flex-wrap gap-2">
                  {person.knownFor.map((work, index) => (
                    <span key={index} className="badge badge-primary badge-lg">
                      {work}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Awards */}
            {person.awards && person.awards.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Awards</h3>
                <div className="flex flex-wrap gap-2">
                  {person.awards.map((award, index) => (
                    <span key={index} className="badge badge-secondary badge-lg">
                      🏆 {award}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social Media */}
            {person.socialMedia && (
              <div className="flex gap-4 mt-4">
                {person.socialMedia.instagram && (
                  <a
                    href={person.socialMedia.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-circle btn-outline"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                )}
                {person.socialMedia.twitter && (
                  <a
                    href={person.socialMedia.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-circle btn-outline"
                  >
                    𝕏
                  </a>
                )}
                {person.socialMedia.facebook && (
                  <a
                    href={person.socialMedia.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-circle btn-outline"
                  >
                    f
                  </a>
                )}
                {person.socialMedia.website && (
                  <a
                    href={person.socialMedia.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-circle btn-outline"
                  >
                    🌐
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Movies Section */}
      <div className="divider divider-primary"></div>
      <div>
        <h2 className="text-3xl font-bold mb-6">Filmography</h2>
        {moviesLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="skeleton h-80"></div>
            <div className="skeleton h-80"></div>
            <div className="skeleton h-80"></div>
            <div className="skeleton h-80"></div>
          </div>
        ) : movies && movies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movieRole) => (
              <div
                key={movieRole._id}
                className="card bg-neutral shadow-xl cursor-pointer hover:scale-105 transition-transform"
                onClick={() => navigate(`/movies/${movieRole.movieId._id}`)}
              >
                <figure>
                  <img
                    src={movieRole.movieId.imageURL || "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"}
                    alt={movieRole.movieId.title}
                    className="h-64 w-full object-cover"
                  />
                </figure>
                <div className="card-body p-4">
                  <h3 className="card-title text-lg">{movieRole.movieId.title}</h3>
                  <p className="text-sm text-gray-500 capitalize">{movieRole.role}</p>
                  {movieRole.characterName && (
                    <p className="text-sm">as {movieRole.characterName}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No movies found for this person</p>
        )}
      </div>
    </div>
  );
};

export default PersonPage;
