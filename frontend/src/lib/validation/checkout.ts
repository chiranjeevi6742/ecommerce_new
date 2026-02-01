import { z } from "zod";

export const checkoutSchema = z.object({
    fullName: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    address: z.string().min(5, "Address is required"),
    city: z.string().min(2, "City is required"),
    zipCode: z.string().min(3, "ZIP Code is required"),
    cardNumber: z.string().min(16, "Invalid Card Number").max(19),
    expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Format MM/YY"),
    cvc: z.string().min(3).max(4),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
