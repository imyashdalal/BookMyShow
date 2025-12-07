const { z } = require('zod')

const createMovieValidationSchema = z.object({
  title: z.string().min(1).max(50),
  description: z.string().min(3).max(500).optional(),
  language: z.string().min(3).max(50).optional(),
  genre: z.array(
    z.enum([
      'Action',
      'Adventure',
      'Animation',
      'Biography',
      'Comedy',
      'Crime',
      'Documentary',
      'Drama',
      'Family',
      'Fantasy',
      'Horror',
      'Musical',
      'Mystery',
      'Romance',
      'Sci-Fi',
      'Thriller',
      'War',
      'Western'
    ])
  ).optional(),
  categories: z.array(
    z.enum(['2D', '3D', 'IMAX', 'IMAX 3D', '4DX', 'MX4D', 'ScreenX', 'Dolby Cinema', 'Standard'])
  ).optional(),
  adultRating: z.enum(['U', 'UA', 'A', 'S', 'U/A 7+', 'U/A 13+', 'U/A 16+']).optional(),
  imageURL: z.string().url().optional(),
  durationInMinutes: z.number().optional(),
})

module.exports = {
  createMovieValidationSchema,
}
