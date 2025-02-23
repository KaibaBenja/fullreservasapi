export const uuidToBuffer = (uuid: string): Buffer => {
  return Buffer.from(uuid.replace(/-/g, ""), "hex");
};