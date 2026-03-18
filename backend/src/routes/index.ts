import express from 'express';
import movieRouter from '../modules/movie/movie.route';
import theaterRouter from '../modules/theater/theater.routes';
import showRouter from '../modules/show/show.route';

const router = express.Router();

router.use("/movies", movieRouter);
router.use("/theaters", theaterRouter);
router.use("/show", showRouter);

export default router;