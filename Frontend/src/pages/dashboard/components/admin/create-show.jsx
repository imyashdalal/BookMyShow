
import { useState, useEffect } from 'react';
import {
  useCreateShow,
  useGetAllTheaters,
  useGetShowsByMovieId,
  useGetTheaterHall,
} from '../../../../hooks/theatre.hook';
import { useGetAllMovies } from '../../../../hooks/movie.hooks';

const CreateShowTab = () => {
  const [movieId, setMovieId] = useState(null);

  const { data: shows } = useGetShowsByMovieId(movieId);

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '50%' }}>
        <CreateShowForm movieId={movieId} setMovieId={setMovieId} />
      </div>
      <div style={{ width: '50%', padding: '10px' }}>
        {shows?.map((show) => (
          <li style={{ listStyle: 'none' }} key={show._id}>
            <pre>{JSON.stringify(show, null, 2)}</pre>
          </li>
        ))}
      </div>
    </div>
  );
};

// eslint-disable-next-line react/prop-types
function CreateShowForm({ movieId, setMovieId }) {
  const [theatreId, setTheatreId] = useState(null);

  const [hallId, setHallId] = useState(null);

  const [price, setPrice] = useState('');
  const [showDate, setShowDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const { data: theatres } = useGetAllTheaters();

  const { data: movies } = useGetAllMovies();

  const { data: halls } = useGetTheaterHall(theatreId);

  useEffect(() => {
    if (theatres && theatres.length > 0) setTheatreId(theatres[0]._id);
  }, [theatres]);

  useEffect(() => {
    if (movies && movies.length > 0) setMovieId(movies[0]._id);
  }, [movies, setMovieId]);

  useEffect(() => {
    if (halls && halls.length > 0) setHallId(halls[0]._id);
  }, [halls, movies]);

  const { mutateAsync: createShowAsync } = useCreateShow();

  useEffect(() => {
    if (theatres && theatres.length > 0) setTheatreId(theatres[0]._id);
  }, [setTheatreId, theatres]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await createShowAsync({
      movieId,
      theatreHallId: hallId,
      showDate: showDate,
      startTimestamp: startTime,
      endTimestamp: endTime,
      price: Number(price),
    });
  };

  const today = new Date();
  const minDate = today.toISOString().slice(0, 10);
  const maxDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  return (
    <div>
      
      <div className="flex flex-col gap-2 p-2 border border-secondary rounded-xl">
        <h1 className="text-3xl text-secondary">Create Movie:</h1>
        <div className='flex gap-2'>
          {movies?.length > 0 && <select className="select select-primary grow" value={movieId} onChange={(e) => setMovieId(e.target.value)}>
            {movies?.map((e) => (
              <option key={e._id} value={e._id}>
                {e.title}
              </option>
            ))}
          </select>}
          {theatres?.length  >0 && <select className="select select-primary grow" value={theatreId} onChange={(e) => setTheatreId(e.target.value)}>
            {theatres?.map((e) => (
              <option key={e._id} value={e._id}>
                {e.name}
              </option>
            ))}
          </select>}
          {halls?.length > 0 && <select className="select select-primary grow" value={hallId} onChange={(e) => setHallId(e.target.value)}>
          {halls?.map((e) => (
            <option key={e._id} value={e._id}>
              {e.number} {`(${e.seatingCapacity})`}
            </option>
          ))}
          </select>}
        </div>
        <div className="flex grow">
          <div className="label w-1/2">
            <span className="text-xl">Price :</span>
          </div>
          <input
            type="number"
            className="p-3 rounded-lg border-primary bg-neutral border grow"
            onChange={(e) => setPrice(e.target.value)}
          ></input>
        </div>

        <div className="flex grow">
          <div className="label w-1/2">
            <span className="text-xl">Date : </span>
          </div>
          <input
            type="date"
            className="p-3 rounded-lg border-primary bg-neutral border grow"
            onChange={(e) => setShowDate(e.target.value)}
            min={minDate}
            max={maxDate}
          ></input>
        </div>

        <div className="flex grow">
          <div className="label w-1/2">
            <span className="text-xl">Start Time : </span>
          </div>
          <input
            type="time"
            className="p-3 rounded-lg border-primary bg-neutral border grow"
            onChange={(e) => setStartTime(e.target.value)}
          ></input>
        </div>
        <div className="flex grow">
          <div className="label w-1/2">
            <span className="text-xl">End Time : </span>
          </div>
          <input
            type="time"
            className="p-3 rounded-lg border-primary bg-neutral border grow"
            onChange={(e) => setEndTime(e.target.value)}
          ></input>
        </div>
        <div className='flex grow justify-end'>
          <button
            className="btn btn-primary w-1/4"
            onClick={handleFormSubmit}
            disabled={!theatreId}
          >
            Create Show
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateShowTab;
