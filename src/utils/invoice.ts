import { format } from "date-fns";

export const formatMoney = (value: number, currency: string): string =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);

export const formatDate = (dateISO: string): string => {
  if (!dateISO) return "";
  try {
    return format(new Date(dateISO), "MMM dd, yyyy");
  } catch {
    return dateISO;
  }
};

export const toDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });
