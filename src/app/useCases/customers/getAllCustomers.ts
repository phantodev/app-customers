import { api } from '@/app/config/axios'
import { TCustomer } from '@/app/schemas/schemasZod'

export async function getAllCustomers(page: number): Promise<TCustomer[]> {
  // await new Promise<void>((resolve) => {
  //   setTimeout(() => {
  //     resolve()
  //   }, 4000)
  // })
  const response = await api.get(`/customers?_page=${page}&_limit=6`)
  return response.data
}
