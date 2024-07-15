import { api } from '@/app/config/axios'
import { TUser } from '@/app/schemas/schemasZod'

export async function createUser(user: TUser): Promise<TUser> {
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, 4000)
  })
  const response = await api.post(`/user/`, user)
  return response.data
}
