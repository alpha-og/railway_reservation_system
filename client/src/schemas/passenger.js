import { z } from 'zod';

export const passengerSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
    .transform(val => val.trim()),
  
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .transform(val => val.trim()),
  
  age: z
    .union([
      z.string().min(1, 'Age is required'),
      z.number()
    ])
    .transform(val => {
      const num = typeof val === 'string' ? parseInt(val) : val;
      if (isNaN(num)) throw new Error('Age must be a valid number');
      return num;
    })
    .refine(age => age >= 1 && age <= 120, 'Age must be between 1 and 120'),
  
  gender: z
    .string()
    .min(1, 'Gender is required')
    .refine(
      gender => ['Male', 'Female', 'Other'].includes(gender),
      'Please select a valid gender'
    ),
  
  coachType: z
    .string()
    .min(1, 'Coach type is required')
});

export const passengerListSchema = z.object({
  passengers: z
    .array(passengerSchema)
    .min(1, 'At least one passenger is required')
});

export const paymentSchema = z.object({
  method: z
    .string()
    .min(1, 'Please select a payment method'),
  
  cardNumber: z
    .string()
    .optional()
    .refine((val, ctx) => {
      if (ctx.parent.method === 'card') {
        if (!val?.replace(/\s/g, '')) {
          return false;
        }
        return /^\d{16}$/.test(val.replace(/\s/g, ''));
      }
      return true;
    }, 'Card number must be 16 digits'),
  
  expiryDate: z
    .string()
    .optional()
    .refine((val, ctx) => {
      if (ctx.parent.method === 'card') {
        if (!val) return false;
        return /^(0[1-9]|1[0-2])\/\d{2}$/.test(val);
      }
      return true;
    }, 'Expiry date must be in MM/YY format'),
  
  cvv: z
    .string()
    .optional()
    .refine((val, ctx) => {
      if (ctx.parent.method === 'card') {
        if (!val) return false;
        return /^\d{3,4}$/.test(val);
      }
      return true;
    }, 'CVV must be 3 or 4 digits'),
  
  cardholderName: z
    .string()
    .optional()
    .refine((val, ctx) => {
      if (ctx.parent.method === 'card') {
        return val?.trim().length > 0;
      }
      return true;
    }, 'Cardholder name is required')
    .transform(val => val?.trim())
});