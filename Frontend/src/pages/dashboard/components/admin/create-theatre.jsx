import { useState } from "react";
import {
  useCreateTheater,
  useGetAllTheaters,
} from "../../../../hooks/theatre.hook";

const CreateTheatreTab = () => {
  const { data: theatres } = useGetAllTheaters();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <CreateTheatreForm />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold mb-4">Theatres</h3>
        <div className="space-y-2">
          {theatres?.map((theatre) => (
            <div key={theatre._id} className="card bg-base-200 shadow-sm">
              <div className="card-body p-4">
                <pre className="text-xs overflow-auto">{JSON.stringify(theatre, null, 2)}</pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function CreateTheatreForm() {
  const [name, setName] = useState("");
  const [plot, setPlot] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [pinCode, setPincode] = useState("");

  const { mutateAsync: createTheatreAsync, isPending } = useCreateTheater();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await createTheatreAsync({
      name,
      plot,
      street,
      city,
      state,
      country,
      pinCode: Number(pinCode),
    });
    // Reset form
    setName("");
    setPlot("");
    setStreet("");
    setCity("");
    setState("");
    setCountry("");
    setPincode("");
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Create Theatre</h2>
        
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Theatre Name</span>
            </label>
            <input
              type="text"
              placeholder="Enter theatre name"
              className="input input-bordered w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Plot Number</span>
              </label>
              <input
                type="text"
                placeholder="Plot number"
                className="input input-bordered w-full"
                value={plot}
                onChange={(e) => setPlot(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Street</span>
              </label>
              <input
                type="text"
                placeholder="Street name"
                className="input input-bordered w-full"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">City</span>
              </label>
              <input
                type="text"
                placeholder="City"
                className="input input-bordered w-full"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">State</span>
              </label>
              <input
                type="text"
                placeholder="State"
                className="input input-bordered w-full"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Country</span>
              </label>
              <input
                type="text"
                placeholder="Country"
                className="input input-bordered w-full"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Pincode</span>
              </label>
              <input
                type="number"
                placeholder="Pincode"
                className="input input-bordered w-full"
                value={pinCode}
                onChange={(e) => setPincode(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="card-actions justify-end mt-6">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isPending}>
              {isPending ? "Creating..." : "Create Theatre"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTheatreTab;
