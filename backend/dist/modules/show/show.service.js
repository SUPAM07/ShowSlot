"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSeatStatus = exports.getShowById = exports.getShowsByMovieDateLocation = exports.createShow = void 0;
const mongoose_1 = require("mongoose");
const utils_1 = require("../../utils"); // Custom utility to build the initial grid
const show_model_1 = require("./show.model");
// 1. Create a show
const createShow = async (showData) => {
    const seatLayout = (0, utils_1.generateSeatLayout)();
    const showToCreate = { ...showData, seatLayout };
    return await show_model_1.ShowModel.create(showToCreate);
};
exports.createShow = createShow;
// 2. Get shows by movie, date and location
const getShowsByMovieDateLocation = async (movieId, date, location) => {
    const query = {
        movie: new mongoose_1.Types.ObjectId(movieId),
        location: { $regex: new RegExp(location, 'i') }
    };
    if (date) {
        query.date = date;
    }
    return await show_model_1.ShowModel.find(query)
        .populate("movie theater")
        .sort({ startTime: 1 });
};
exports.getShowsByMovieDateLocation = getShowsByMovieDateLocation;
// 3. Get show by id
const getShowById = async (showId) => {
    return await show_model_1.ShowModel.findById(showId).populate("movie theater");
};
exports.getShowById = getShowById;
// 4. Update seat status
const updateSeatStatus = async (showId, row, seatNumber, status) => {
    return await show_model_1.ShowModel.updateOne({
        _id: new mongoose_1.Types.ObjectId(showId),
        "seatLayout.row": row
    }, {
        $set: { "seatLayout.$.seats.$[elem].status": status }
    }, {
        arrayFilters: [{ "elem.number": seatNumber }]
    });
};
exports.updateSeatStatus = updateSeatStatus;
