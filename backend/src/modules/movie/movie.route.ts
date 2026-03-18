import express from 'express';
import * as MovieController from './movie.controller';
import { validate } from '../../middlewares/validate';
import { MovieSchema } from './movie.validation';

const router = express.Router();

router.post('/', validate(MovieSchema)  ,MovieController.createMovie);
router.get('/', MovieController.getMovies);
router.get('/recommended', MovieController.getTopRecommendedMovies);
router.get('/:id', MovieController.getMovieById);

export default router;