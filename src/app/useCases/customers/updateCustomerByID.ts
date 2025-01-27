import { api } from '@/app/config/axios'
import { TCustomer } from '@/app/schemas/schemasZod'

export async function updateCustomerByID(
  id: string,
  customer: TCustomer,
): Promise<TCustomer> {
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, 4000)
  })
  const response = await api.patch(`/customers/${id}`, {
    name: customer.name,
    role: customer.role,
    terms: customer.terms,
  })
  return response.data
}
