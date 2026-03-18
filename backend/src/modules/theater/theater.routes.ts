import express from "express";
import * as TheaterController from "./theater.controller";
import { validate } from "../../middlewares/validate";
import { TheaterSchema } from "./theater.validation";

const router = express.Router();

router.post("/", validate(TheaterSchema), TheaterController.createTheater);
router.get("/", TheaterController.getTheaters);

export default router;