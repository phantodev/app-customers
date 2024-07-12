'use client'

import { TUser } from '@/app/schemas/schemasZod'
import {
  Button,
  cn,
  Input,
  Switch,
  Select,
  SelectItem,
} from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'
import { getAddressByCEP, maskCEP, maskDocument } from '@/app/utils/utils'

export default function AddFormCustomers() {
  const router = useRouter()
  const howMeet = [
    { key: 'Google', label: 'Google' },
    { key: 'Facebook', label: 'Facebook' },
    { key: 'Instagram', label: 'Instagram' },
  ]

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<TUser>()

  async function handleGetAddress(cep: string) {
    try {
      const response = await getAddressByCEP(cep)
      console.log(response)
    } catch (error) {}
  }

  return (
    <main className="flex h-screen flex-col">
      <section id="HEADER" className="flex justify-between p-6">
        <section className="text-2xl font-semibold">Adicionar cliente</section>
        <section>
          <Button
            color="primary"
            onClick={() => router.push('/admin/customers/')}
          >
            Lista de Clientes
          </Button>
        </section>
      </section>
      <form
        onSubmit={handleSubmit(() => console.log('ENVIOU FORM'))}
        className="grid grid-cols-3 gap-2 p-6"
      >
        <Input
          type="text"
          label="Nome"
          placeholder=""
          isInvalid={!!errors.name?.message}
          errorMessage={errors.name?.message}
          description="Nome com mínimo 10 caracteres"
          {...register('name')}
        />
        <Input
          type="text"
          label="CEP"
          maxLength={9}
          placeholder=""
          onInput={(event) => {
            const input = (event?.target as HTMLInputElement)?.value
            const maskedInput = maskCEP(input)
            setValue('cep', maskedInput)
            if (maskedInput.length === 9) {
              handleGetAddress(maskedInput)
            }
          }}
          {...register('cep')}
        />
        <Input type="text" label="Rua" placeholder="" />
        <Input type="text" label="Número" placeholder="" />
        <Input type="text" label="Bairro" placeholder="" />
        <Input type="text" label="Cidade" placeholder="" />
        <Input type="text" label="Estado" placeholder="" />
        <Input
          type="text"
          label="CPF"
          placeholder=""
          onInput={(event) => {
            const input = (event?.target as HTMLInputElement)?.value
            const maskedInput = maskDocument('CPF', input)
            setValue('cpf', maskedInput)
          }}
          {...register('cpf')}
          maxLength={14}
        />
        <Input
          type="text"
          label="Telefone"
          placeholder=""
          {...register('phone')}
        />
        <Switch
          classNames={{
            base: cn(
              'inline-flex flex-row-reverse w-full max-w-md bg-content1 hover:bg-content2 items-center',
              'justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent',
              'data-[selected=true]:border-primary',
            ),
            wrapper: 'p-0 h-4 overflow-visible',
            thumb: cn(
              'w-6 h-6 border-2 shadow-lg',
              'group-data-[hover=true]:border-primary',
              // selected
              'group-data-[selected=true]:ml-6 !bg-lime-500',
              'group-data-[selected=false]:ml-6 !bg-red-500',
              // pressed
              'group-data-[pressed=true]:w-7',
              'group-data-[selected]:group-data-[pressed]:ml-4',
            ),
          }}
        >
          <div className="flex flex-col gap-1">
            <p className="text-medium">Status</p>
            <p className="text-tiny text-default-400">
              Ative ou desative o usuário para usar o aplicativo
            </p>
          </div>
        </Switch>
        <Select
          label="Como você nos conheceu?"
          className="w-full"
          {...register('howMeet')}
        >
          {howMeet.map((item) => (
            <SelectItem key={item.key}>{item.label}</SelectItem>
          ))}
        </Select>
      </form>
      <DevTool control={control} />
    </main>
  )
}
