const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrorsnew = require("../middleware/catchAsyncErrorsnew");

// this is for this

// router.get("/demo-data", async (req, res, next) => {
//     try {
//       res.status(200).json({
//         success: true,
//         message: "hello from dosrobajar",
//         withdraws,
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   });

  router.get(
    "/demo-data",
    catchAsyncErrorsnew(async (req, res) => {
      try {

        res.status(200).json({
            success: true,
            message: "hello from dosrobajar",
            withdraws,
          });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    })
  );

module.exports = router;
