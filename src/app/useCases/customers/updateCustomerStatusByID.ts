import { api } from '@/app/config/axios'
import { TCustomer } from '@/app/schemas/schemasZod'

export async function updateCustomerStatusByID(
  id: string,
  status: boolean,
): Promise<TCustomer> {
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, 4000)
  })
  const response = await api.patch(`/customers/${id}`, {
    status,
  })
  return response.data
}
