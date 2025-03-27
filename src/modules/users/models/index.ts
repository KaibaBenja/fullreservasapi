import User from "./users.model";
import Merchant from "./merchants.model";
import { setupAssociations } from "../../../config/associations";

setupAssociations(User, Merchant);

export { User, Merchant };
