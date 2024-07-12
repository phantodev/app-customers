import { api } from '@/app/config/axios'
import { TCustomer } from '@/app/schemas/schemasZod'

export async function getAllCustomers(): Promise<TCustomer[]> {
  // await new Promise<void>((resolve) => {
  //   setTimeout(() => {
  //     resolve()
  //   }, 4000)
  // })
  const response = await api.get('/customers')
  return response.data
}
