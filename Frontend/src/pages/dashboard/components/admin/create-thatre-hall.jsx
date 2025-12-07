import { useState, useEffect } from "react";
import {
  useCreateTheaterHall,
  useGetAllTheaters,
  useGetTheaterHall,
} from "../../../../hooks/theatre.hook";

const CreateTheatreHallTab = () => {
  const [theatreId, setTheatreId] = useState(null);

  const { data: halls } = useGetTheaterHall(theatreId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <CreateTheatreHallForm
          theatreId={theatreId}
          setTheatreId={setTheatreId}
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold mb-4">Theatre Halls</h3>
        <div className="space-y-2">
          {halls?.map((hall) => (
            <div key={hall._id} className="card bg-neutral shadow-sm">
              <div className="card-body p-4">
                <pre className="text-xs overflow-auto">{JSON.stringify(hall, null, 2)}</pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// eslint-disable-next-line react/prop-types
function CreateTheatreHallForm({ theatreId, setTheatreId }) {
  const { data: theatres } = useGetAllTheaters();

  const [number, setNumber] = useState("");
  const [seatingCapacity, setSeatingCapacity] = useState("");

  const { mutateAsync: createTheatreHallAsync, isPending } = useCreateTheaterHall();

  useEffect(() => {
    if (theatres && theatres.length > 0) setTheatreId(theatres[0]._id);
  }, [setTheatreId, theatres]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!theatreId) {
      alert(`Please select a theatre`);
      return;
    }
    await createTheatreHallAsync({
      number: Number(number),
      seatingCapacity: Number(seatingCapacity),
      theatreId,
    });
    setNumber("");
    setSeatingCapacity("");
  };

  return (
    <div className="card bg-neutral shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Create Theatre Hall</h2>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text">Select Theatre</span>
          </label>
          <select 
            className="select select-bordered w-full" 
            value={theatreId || ""} 
            onChange={(e) => setTheatreId(e.target.value)}>
            {theatres?.map((e) => (
              <option key={e._id} value={e._id}>
                {e.name}
              </option>
            ))}
          </select>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4 mt-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Hall Number</span>
            </label>
            <input
              type="number"
              placeholder="Enter hall number"
              className="input input-bordered w-full"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Seating Capacity</span>
            </label>
            <input
              type="number"
              placeholder="Enter seating capacity"
              className="input input-bordered w-full"
              value={seatingCapacity}
              onChange={(e) => setSeatingCapacity(e.target.value)}
              required
            />
          </div>

          <div className="card-actions justify-end mt-6">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={!theatreId || isPending}>
              {isPending ? "Creating..." : "Create Hall"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTheatreHallTab;
