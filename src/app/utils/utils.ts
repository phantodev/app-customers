import { IViaCEP, IViaCEPError } from '@/interfaces/cep'
// import { api } from '../config/axios'
// import axios from 'axios'
import axios from 'axios'

export function maskDocument(documentType: string, value: string) {
  value = value.replace(/\D/g, '')
  switch (documentType) {
    case 'CPF':
      value = value.replace(/(\d{3})(\d)/, '$1.$2')
      value = value.replace(/(\d{3})(\d)/, '$1.$2')
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      break

    case 'CNPJ':
      value = value.replace(/(\d{2})(\d)/, '$1.$2')
      value = value.replace(/(\d{3})(\d)/, '$1.$2')
      value = value.replace(/(\d{3})(\d)/, '$1/$2')
      value = value.replace(/(\d{4})(\d{1,2})$/, '$1-$2')
      break

    default:
      break
  }
  return value
}

export function maskCEP(cep: string): string {
  const clearCep = cep.replace(/\D/g, '')
  if (clearCep.length > 5) {
    return clearCep.replace(/(\d{5})(\d{1,3})/, '$1-$2')
  }
  return clearCep
}

export async function getAddressByCEP(
  cep: string,
): Promise<IViaCEP | IViaCEPError> {
  const clearCEP = cep.replace(/\D/g, '')
  const response = await axios.get(
    `https://viacep.com.br/ws/${clearCEP}/json/`,
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
  )
  return response.data
}

export function maskPhone(phone: string): string {
  const clearPhone = phone.replace(/\D/g, '').slice(0, 11) // Remove não-números e limita a 11 dígitos

  const parts = []

  if (clearPhone.length > 0) {
    parts.push(`(${clearPhone.substring(0, 2)}`)
  }
  if (clearPhone.length > 2) {
    parts.push(`) ${clearPhone.substring(2, 7)}`)
  }
  if (clearPhone.length > 7) {
    parts.push(`-${clearPhone.substring(7, 11)}`)
  }

  return parts.join('')
}
