import Address from "../../modules/address/models/addresses.model";
import Country from "../../modules/address/models/countries.model";
import Province from "../../modules/address/models/provinces.model";
import Booking from "../../modules/bookings/models/bookings.model";
import Membership from "../../modules/memberships/models/memberships.model";
import MembershipPlan from "../../modules/memberships/models/membershipsPlans.model";
import AvailableSlot from "../../modules/shops/models/availableSlots.model";
import ClosedDay from "../../modules/shops/models/closedDays.model";
import Image from "../../modules/shops/models/images.model";
import Menu from "../../modules/shops/models/menus.model";
import Rating from "../../modules/shops/models/ratings.model";
import Schedule from "../../modules/shops/models/schedules.model";
import ShopAddress from "../../modules/shops/models/shopAddresses.model";
import Shop from "../../modules/shops/models/shops.model";
import Subcategory from "../../modules/shops/models/subcategories.model";
import MerchantSetting from "../../modules/users/models/merchants.model";
import OperatorSetting from "../../modules/users/models/operators.model";
import Role from "../../modules/users/models/roles.model";
import UserRole from "../../modules/users/models/userroles.model";
import User from "../../modules/users/models/users.model";
import ResetToken from "../../modules/users/models/resetToken.model";


export function initAssociations() {
    Province.belongsTo(Country, { foreignKey: "country_id", onDelete: "CASCADE" });
    Country.hasMany(Province, { foreignKey: "country_id" });

    Address.hasMany(ShopAddress, { foreignKey: 'address_id' });
    ShopAddress.belongsTo(Address, { foreignKey: 'address_id' });

    Shop.belongsTo(Subcategory, { foreignKey: "subcategory_id", as: "subcategory", });

    Shop.hasMany(ShopAddress, { foreignKey: "shop_id" });
    ShopAddress.belongsTo(Shop, { foreignKey: "shop_id" });

    Shop.hasMany(Image, { foreignKey: "shop_id" });
    Image.belongsTo(Shop, { foreignKey: "shop_id" });

    Shop.hasMany(Schedule, { foreignKey: "shop_id", as: "schedules" });
    Schedule.belongsTo(Shop, { foreignKey: "shop_id" });

    Shop.hasMany(Booking, { foreignKey: "shop_id", as: "bookings" });
    Booking.belongsTo(Shop, { foreignKey: "shop_id" });

    Shop.hasMany(AvailableSlot, { foreignKey: "shop_id", as: "available_slots" });
    AvailableSlot.belongsTo(Shop, { foreignKey: "shop_id" });

    AvailableSlot.hasMany(Booking, { foreignKey: "booked_slot_id", as: "bookings" });
    Booking.belongsTo(AvailableSlot, { foreignKey: "booked_slot_id" });

    Shop.hasOne(Menu, { foreignKey: 'shop_id', sourceKey: 'id' });
    Menu.belongsTo(Shop, { foreignKey: 'shop_id', targetKey: 'id' });

    Shop.hasMany(ClosedDay, { foreignKey: "shop_id", as: "closed_days" });
    ClosedDay.belongsTo(Shop, { foreignKey: "shop_id" });

    Booking.hasOne(Rating, { foreignKey: 'booking_id', as: "rating" });
    Rating.belongsTo(Booking, { foreignKey: 'booking_id' });

    Shop.hasMany(Rating, { foreignKey: 'shop_id', as: 'rating' });
    Rating.belongsTo(Shop, { foreignKey: 'shop_id' });

    User.hasMany(Rating, { foreignKey: 'user_id', as: 'rating' });
    Rating.belongsTo(User, { foreignKey: 'user_id' });

    User.hasOne(Membership, { foreignKey: 'user_id', as: 'membership' });
    Membership.belongsTo(User, { foreignKey: 'user_id' });

    MembershipPlan.hasMany(Membership, { foreignKey: 'tier', sourceKey: 'id' });
    Membership.belongsTo(MembershipPlan, { foreignKey: 'tier', targetKey: 'id', as: 'membership_plan' });

    User.belongsToMany(Role, { through: UserRole, foreignKey: 'user_id', otherKey: 'role_id', as: 'roles' });
    Role.belongsToMany(User, { through: UserRole, foreignKey: 'role_id', otherKey: 'user_id' });

    User.hasOne(OperatorSetting, { foreignKey: 'user_id', as: 'operator' });
    OperatorSetting.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

    Shop.hasMany(OperatorSetting, { foreignKey: 'shop_id', as: 'operator' });
    OperatorSetting.belongsTo(Shop, { foreignKey: 'shop_id', as: 'shop' });

    User.hasMany(Shop, { foreignKey: 'user_id', as: 'shop' });
    Shop.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

    User.hasOne(MerchantSetting, { foreignKey: 'user_id', as: 'merchant' });
    MerchantSetting.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

    User.hasMany(ResetToken, { foreignKey: 'user_id', as: 'reset_token' });
    ResetToken.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
}