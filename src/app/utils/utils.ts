import { IViaCEP, IViaCEPError } from '@/interfaces/cep'
import { api } from '../config/axios'

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
  const response = await api.get(`https://viacep.com.br/ws/${clearCEP}/json/`)
  return response.data
}
