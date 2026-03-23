"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopRecommendedMovies = exports.getMovieById = exports.getMovies = exports.createMovie = void 0;
const MovieService = __importStar(require("./movie.service"));
const createMovie = async (req, res, next) => {
    try {
        const movie = await MovieService.createMovie(req.body);
        res.status(201).json({ movie });
    }
    catch (error) {
        next(error);
    }
};
exports.createMovie = createMovie;
const getMovies = async (req, res, next) => {
    try {
        const movies = await MovieService.getAllMovies();
        res.status(200).json({ movies });
    }
    catch (error) {
        next(error);
    }
};
exports.getMovies = getMovies;
const getMovieById = async (req, res, next) => {
    try {
        const movie = await MovieService.getMovieById(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
        res.status(200).json({ movie });
    }
    catch (error) {
        next(error);
    }
};
exports.getMovieById = getMovieById;
const getTopRecommendedMovies = async (req, res, next) => {
    try {
        const topMovies = await MovieService.getTopMovieByVotes(5);
        res.status(200).json({ topMovies });
    }
    catch (error) {
        next(error);
    }
};
exports.getTopRecommendedMovies = getTopRecommendedMovies;
