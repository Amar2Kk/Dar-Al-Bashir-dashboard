import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
<<<<<<< HEAD
=======

export const formatter = new Intl.NumberFormat("en-EG",{
  style: 'currency',
  currency: 'EGP',
  currencyDisplay: "code"
});
>>>>>>> 0b36837 (Products Entity (Admin))
