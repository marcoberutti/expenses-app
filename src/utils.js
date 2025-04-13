/**
 * formatta numero in euro
 */
export const formatCurrency = (val) => {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(val);
};
/**
 * da euro a stringa
 */
export const parseEuroString = (val) => {
  if (typeof val === "number") return val;

  if (typeof val === "string") {
    const cleaned = val.trim();

    // Cerca pattern numerico tipo "345.000,00" o "1.234" ecc.
    // Rimuove i punti solo se c'è anche una virgola (separa migliaia da decimali)
    const hasComma = cleaned.includes(",");

    let raw = cleaned;
    if (hasComma) {
      raw = cleaned.replace(/\./g, "").replace(",", ".");
    }

    const parsed = parseFloat(raw);
    return isNaN(parsed) ? 0 : parsed;
  }

  return 0;
};