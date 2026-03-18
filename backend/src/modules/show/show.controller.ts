import { Request, Response, NextFunction } from "express";
import * as ShowService from "./show.service";

// 1. Create a new show
export const createShow = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const show = await ShowService.createShow(req.body);
    res.status(201).json(show);
  } catch (error) {
    next(error);
  }
};

// 2. Get shows filtered by Movie, Date, and State (Location)
export const getShowsByMovieDateLocation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { movieId, state, date } = req.query;
    const shows = await ShowService.getShowsByMovieDateLocation(
      movieId as string,
      date as string,
      state as string
    );
    res.status(200).json(shows);
  } catch (error) {
    next(error);
  }
};

// 3. Get a specific show by its ID
export const getShowById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const show = await ShowService.getShowById(req.params.id as string);
    res.status(200).json(show);
  } catch (error) {
    next(error);
  }
};

// 4. Update the status of a specific seat (AVAILABLE | BOOKED | BLOCKED)
export const updateSeatStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {row, seatNumber, status } = req.query;
    
    const updatedShow = await ShowService.updateSeatStatus(
      req.params.showId as string,
      row as string,
      Number(seatNumber),
      status as "AVAILABLE" | "BOOKED" | "BLOCKED"
    );

    res.status(201).json(updatedShow);
  } catch (error) {
    next(error);
  }
};