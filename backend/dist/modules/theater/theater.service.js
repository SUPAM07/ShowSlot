"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTheaterByState = exports.getTheaterById = exports.getAllTheaters = exports.createTheater = void 0;
const theater_model_1 = require("./theater.model");
// 1. CreateTheater
const createTheater = async (data) => {
    return await theater_model_1.TheaterModel.create(data);
};
exports.createTheater = createTheater;
// 2. GetAllTheaters
const getAllTheaters = async () => {
    return await theater_model_1.TheaterModel.find();
};
exports.getAllTheaters = getAllTheaters;
// 3. GetTheaterById
const getTheaterById = async (id) => {
    return await theater_model_1.TheaterModel.findById(id);
};
exports.getTheaterById = getTheaterById;
// 4. GetTheaterByState (Case-insensitive search)
const getTheaterByState = async (state) => {
    return await theater_model_1.TheaterModel.find({ state: { $regex: state, $options: "i" } });
};
exports.getTheaterByState = getTheaterByState;
