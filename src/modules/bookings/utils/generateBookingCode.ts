import { v4 as uuidv4 } from "uuid";


export const generateBookingCode = (): string => {
  return uuidv4().slice(0, 4).toUpperCase(); // Ejemplo: "A1B2"
};

// const getUniqueBookingCode = async (): Promise<string> => {
//   let code;
//   let exists = true;

//   while (exists) {
//     code = generateBookingCode();
//     const existingBooking = await BookingModel.findOne({ booking_code: code, status: "pending" });
//     exists = !!existingBooking; // Si existe, vuelve a generar el código
//   }

//   return code;
// };