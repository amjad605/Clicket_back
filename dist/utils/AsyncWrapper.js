"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncWrapper = void 0;
const AsyncWrapper = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
exports.AsyncWrapper = AsyncWrapper;
