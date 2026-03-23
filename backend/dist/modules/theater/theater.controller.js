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
exports.getTheaters = exports.createTheater = void 0;
const TheaterService = __importStar(require("./theater.service"));
const createTheater = async (req, res, next) => {
    try {
        const theater = await TheaterService.createTheater(req.body);
        res.status(201).json({
            success: true,
            message: "Theater created successfully",
            data: theater,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createTheater = createTheater;
const getTheaters = async (req, res, next) => {
    try {
        const { state } = req.query;
        let theaters;
        if (state) {
            theaters = await TheaterService.getTheaterByState(state);
        }
        else {
            theaters = await TheaterService.getAllTheaters();
        }
        res.status(200).json(theaters);
    }
    catch (error) {
        next(error);
    }
};
exports.getTheaters = getTheaters;
