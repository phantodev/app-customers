import { z } from 'zod'

export const createCustomerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(10, { message: 'Mínimo 10 caracteres' }),
  role: z.string().min(5, { message: 'Mínimo 5 caracteres' }),
  status: z.boolean().optional(),
  // age: z.string().optional(),
  terms: z.boolean(),
})

export type TCustomer = z.infer<typeof createCustomerSchema>
