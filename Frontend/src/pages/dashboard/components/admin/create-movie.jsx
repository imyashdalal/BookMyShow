import { useState } from 'react';
import { useCreateMovie, useGetAllMovies } from '../../../../hooks/movie.hooks';
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import { storage } from '../../../../util/storageService/firebase';
import { v4 } from 'uuid';

const CreateMovieTab = () => {
  const { data: movies } = useGetAllMovies();
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '50%' }}>
        <CreateMovieForm />
      </div>
      <div style={{ width: '50%', padding: '10px' }}>
        {movies &&
          movies.map((movie) => (
            <div key={movie._id}>
              <pre>{JSON.stringify(movie, null, 2)}</pre>
            </div>
          ))}
      </div>
    </div>
  );
};

const CreateMovieForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('');
  const [durationInMinutes, setDurationInMinutes] = useState('');
  const [imageUpload, setImageUpload] = useState(null);
  const [genre, setGenre] = useState([]);
  const [categories, setCategories] = useState([]);
  const [adultRating, setAdultRating] = useState('U');

  const availableGenres = [
    'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime',
    'Documentary', 'Drama', 'Family', 'Fantasy', 'Horror', 'Musical',
    'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western'
  ];

  const availableCategories = [
    '2D', '3D', 'IMAX', 'IMAX 3D', '4DX', 'MX4D', 'ScreenX', 'Dolby Cinema', 'Standard'
  ];

  const { mutateAsync: createMovieAsync } = useCreateMovie();

  const uploadFile = async () => {
    if (imageUpload == null || imageUpload == '') return;
    let urlImg = '';
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    await uploadBytes(imageRef, imageUpload);
    urlImg = await getDownloadURL(imageRef);
    return urlImg;
  };

  const handleAddGenre = (selectedGenre) => {
    if (selectedGenre && !genre.includes(selectedGenre)) {
      setGenre([...genre, selectedGenre]);
    }
  };

  const handleRemoveGenre = (genreToRemove) => {
    setGenre(genre.filter(g => g !== genreToRemove));
  };

  const handleAddCategory = (selectedCategory) => {
    if (selectedCategory && !categories.includes(selectedCategory)) {
      setCategories([...categories, selectedCategory]);
    }
  };

  const handleRemoveCategory = (categoryToRemove) => {
    setCategories(categories.filter(c => c !== categoryToRemove));
  };


  const handleCreateMovie = async (e) => {
    e.preventDefault();
    try {
      const url = await uploadFile();
      const movieData = {
        title,
        description,
        language,
        imageURL: url,
        durationInMinutes: Number(durationInMinutes),
        genre: genre.length > 0 ? genre : undefined,
        categories: categories.length > 0 ? categories : undefined,
        adultRating,
      };
      console.log('movieData', movieData);
      const filteredMovieData = Object.fromEntries(
        // eslint-disable-next-line no-unused-vars
        Object.entries(movieData).filter(([_, value]) => value)
      );

      await createMovieAsync(filteredMovieData);
      setTitle('');
      setDescription('');
      setLanguage('');
      setImageUpload(null);
      setDurationInMinutes('');
      setGenre([]);
      setCategories([]);
      setAdultRating('U');
    } catch (error) {
      console.log(error);
    }
  };

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };
  const handleDescription = (e) => {
    setDescription(e.target.value);
  };
  const handleLanguage = (e) => {
    setLanguage(e.target.value);
  };
  const handleImageUpload = (e) => {
    setImageUpload(e.target.files[0]);
  };
  const handleDurationInMinutes = (e) => {
    setDurationInMinutes(e.target.value);
  };

  return (
    <div>
      <div className='form flex flex-col gap-2'>
        {/* title */}
          <input type="text" className="grow input input-bordered" placeholder="TITLE" value={title} onChange={handleTitle}/>
        {/* description */}
        <input type="text" className="grow input input-bordered" placeholder="DESCRIPTION" value={description} onChange={handleDescription}/>
        {/* language */}
          <input type="text" className="grow input input-bordered" placeholder="LANGUAGE" value={language} onChange={handleLanguage}/>
        
        {/* Genre */}
        <div>
          <div className="flex gap-2">
            <select 
              className="select select-bordered grow" 
              onChange={(e) => handleAddGenre(e.target.value)}
              value=""
            >
              <option value="" disabled>SELECT GENRE</option>
              {availableGenres.filter(g => !genre.includes(g)).map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          {genre.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {genre.map((g, index) => (
                <span key={index} className="badge badge-primary gap-2">
                  {g}
                  <button type="button" className="btn btn-ghost btn-xs" onClick={() => handleRemoveGenre(g)}>✕</button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Categories */}
        <div>
          <div className="flex gap-2">
            <select 
              className="select select-bordered grow" 
              onChange={(e) => handleAddCategory(e.target.value)}
              value=""
            >
              <option value="" disabled>SELECT CATEGORY</option>
              {availableCategories.filter(c => !categories.includes(c)).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {categories.map((c, index) => (
                <span key={index} className="badge badge-secondary gap-2">
                  {c}
                  <button type="button" className="btn btn-ghost btn-xs" onClick={() => handleRemoveCategory(c)}>✕</button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Adult Rating */}
        <select 
          className="select select-bordered w-full" 
          value={adultRating} 
          onChange={(e) => setAdultRating(e.target.value)}
        >
          <option value="U">U - Universal</option>
          <option value="UA">UA - Universal Adult</option>
          <option value="U/A 7+">U/A 7+ - Universal Adult 7+</option>
          <option value="U/A 13+">U/A 13+ - Universal Adult 13+</option>
          <option value="U/A 16+">U/A 16+ - Universal Adult 16+</option>
          <option value="A">A - Adult</option>
          <option value="S">S - Restricted</option>
        </select>

        {/* image URL */}
        <input type="file" className="file-input file-input-bordered w-full grow" placeholder='ADD MOVIE BANER' onChange={handleImageUpload}/>
        {/* duration in minutes */}
          <input type="text" className="grow input input-bordered" placeholder="DURATION IN MINUTES" value={durationInMinutes} onChange={handleDurationInMinutes} />
        {/* submit Button */}
          <button className="btn btn-outline btn-primary" onClick={handleCreateMovie}>CREATE MOVIE</button>
      </div>
    </div>
  );
};

export default CreateMovieTab;
