import Address from "./address/models/addresses.model";
import Country from "./address/models/countries.model";
import Province from "./address/models/provinces.model";
import Booking from "./bookings/models/bookings.model";
import AvailableSlot from "./shops/models/availableSlots.model";
import Image from "./shops/models/images.model";
import Schedule from "./shops/models/schedules.model";
import ShopAddress from "./shops/models/shopAddresses.model";
import Shop from "./shops/models/shops.model";
import Subcategory from "./shops/models/subcategories.model";


export function initAssociations() {
    Province.belongsTo(Country, { foreignKey: "country_id", onDelete: "CASCADE" });
    Country.hasMany(Province, { foreignKey: "country_id" });

    ShopAddress.belongsTo(Address, { foreignKey: 'address_id' });
    Address.hasMany(ShopAddress, { foreignKey: 'address_id' });

    Shop.belongsTo(Subcategory, {  foreignKey: "subcategory_id",  as: "subcategory",});

    Shop.hasMany(ShopAddress, { foreignKey: "shop_id" });
    ShopAddress.belongsTo(Shop, { foreignKey: "shop_id" });

    Shop.hasMany(Image, { foreignKey: "shop_id" });
    Image.belongsTo(Shop, { foreignKey: "shop_id" });

    Shop.hasMany(Schedule, { foreignKey: "shop_id", as: "schedules" }); 
    Schedule.belongsTo(Shop, { foreignKey: "shop_id" });

    Shop.hasMany(Booking, { foreignKey: "shop_id", as: "bookings"});
    Booking.belongsTo(Shop, {foreignKey: "shop_id"});

    Shop.hasMany(AvailableSlot, {foreignKey: "shop_id", as: "available_slots"});
    AvailableSlot.belongsTo(Shop, {foreignKey: "shop_id"});

    AvailableSlot.hasMany(Booking, {foreignKey: "booked_slot_id", as: "bookings"});
    Booking.belongsTo(AvailableSlot, {foreignKey: "booked_slot_id"});
}