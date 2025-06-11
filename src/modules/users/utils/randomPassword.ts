const words = [
  "chamigo",
  "carpincho",
  "ibera",
  "yerra",
  "camalote",
  "pindureta",
  "bailanta",
  "paye",
  "curuzu",
  "gaucho",
  "pindo",
  "chipa",
  "laguna",
  "sapukai",
  "carau",
  "nandubay",
  "cotorra",
  "chamame",
  "yacare"
];


export function generatePassword(): string {
  const index = Math.floor(Math.random() * words.length);
  const word = words[index];

  const wordUpper = word.charAt(0).toUpperCase() +
    word.slice(1).toLowerCase();

  const numbers = Array.from({ length: 3 }, () =>
    Math.floor(Math.random() * 10)
  ).join('');

  return `${wordUpper}#${numbers}`;
}