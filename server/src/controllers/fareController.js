import FareRate from "../models/fareRateModel.js";

class FareController {
  // Calculate fare for a journey
  static async calculateFare(req, res, next) {
    try {
      const { train_id, coach_type_id, from_station_id, to_station_id } = req.body;

      if (!train_id || !coach_type_id || !from_station_id || !to_station_id) {
        return res.status(400).json({
          success: false,
          message: "Missing required parameters: train_id, coach_type_id, from_station_id, to_station_id"
        });
      }

      const fareCalculation = await FareRate.calculateFare(
        train_id, 
        coach_type_id, 
        from_station_id, 
        to_station_id
      );

      res.status(200).json({
        success: true,
        data: {
          fareCalculation
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get fare rates for a specific train
  static async getFareRatesByTrain(req, res, next) {
    try {
      const { train_id } = req.params;

      if (!train_id) {
        return res.status(400).json({
          success: false,
          message: "Missing required parameter: train_id"
        });
      }

      const fareRates = await FareRate.findByTrain(train_id);

      res.status(200).json({
        success: true,
        data: {
          fareRates
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Calculate fares for multiple coach types
  static async calculateMultipleFares(req, res, next) {
    try {
      const { train_id, coach_type_ids, from_station_id, to_station_id } = req.body;

      if (!train_id || !coach_type_ids || !Array.isArray(coach_type_ids) || !from_station_id || !to_station_id) {
        return res.status(400).json({
          success: false,
          message: "Missing required parameters: train_id, coach_type_ids (array), from_station_id, to_station_id"
        });
      }

      const fareCalculations = await Promise.all(
        coach_type_ids.map(async (coach_type_id) => {
          try {
            return await FareRate.calculateFare(train_id, coach_type_id, from_station_id, to_station_id);
          } catch (error) {
            return {
              coach_type_id,
              error: error.message
            };
          }
        })
      );

      res.status(200).json({
        success: true,
        data: {
          fareCalculations
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

export default FareController;