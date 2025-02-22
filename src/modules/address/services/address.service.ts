import countriesServices from "./countries.service";
import provincesServices from "./provinces.service";
import citiesServices from "./cities.service";

const addressServices = {
  countries: countriesServices,
  provinces: provincesServices,
  cities: citiesServices
};

export default addressServices;