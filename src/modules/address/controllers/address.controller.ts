import countriesController from "./countries.controller";
import provincesController from "./provinces.controller";
import citiesController from "./cities.controller";

const addressController = {
  countries: countriesController,
  provinces: provincesController,
  cities: citiesController
};

export default addressController;