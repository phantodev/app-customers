'use client'
import 'react-toastify/dist/ReactToastify.css'
import { Button, Card, CardBody, Switch, Input } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { getCustomerByID } from '@/app/useCases/customers/getCustomerByID'
import { updateCustomerByID } from '@/app/useCases/customers/updateCustomerByID'
import { useForm } from 'react-hook-form'
import { createCustomerSchema, TCustomer } from '@/app/schemas/schemasZod'
import dynamic from 'next/dynamic'
import { zodResolver } from '@hookform/resolvers/zod'
// import { DevTool } from '@hookform/devtools'

// Isso só deve ser usado no modo Desenvolvedor
// Comentar quando for para produção
const DevTool = dynamic(
  () => import('@hookform/devtools').then((mod) => mod.DevTool),
  {
    ssr: false,
  },
)

type TCustomersDetailsPageProps = {
  id: string
}

export default function CustomersDetailsPage({
  params,
}: {
  params: TCustomersDetailsPageProps
}) {
  const [customer, setCustomer] = React.useState<TCustomer | null>(null)
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [isFetching, setIsFetching] = React.useState<boolean>(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<TCustomer>({
    mode: 'onChange',
    resolver: zodResolver(createCustomerSchema),
    defaultValues: {
      terms: false,
    },
  })

  const handleGetCustomerByID = React.useCallback(async () => {
    try {
      const response: TCustomer = await getCustomerByID(params.id)
      setCustomer(response)
      setValue('name', response.name)
      setValue('role', response.role)
      setValue('terms', response.terms)
      setIsLoading(false)
    } catch (error) {
      toast.error('Problemas com API!', {
        theme: 'colored',
      })
    }
  }, [params.id, setValue])

  React.useEffect(() => {
    console.log(errors)
  }, [errors])

  async function handleUpdateStatus(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      await updateCustomerByID(params.id, e.target.checked)
      toast.success('Status atualizado', {
        theme: 'colored',
      })
    } catch (error) {
      toast.error('Problemas com API!', {
        theme: 'colored',
      })
    }
  }

  async function handleUpdateCustomer(data: TCustomer) {
    console.log(data)
  }

  React.useEffect(() => {
    handleGetCustomerByID()
  }, [handleGetCustomerByID])

  return (
    <main className="flex h-screen flex-col">
      <section id="HEADER" className="flex justify-between p-6">
        <section className="text-2xl font-semibold">
          #{params.id} - Cliente
        </section>
        <section>
          <Button
            color="primary"
            onClick={() => router.push('/admin/customers/')}
          >
            Lista de Clientes
          </Button>
        </section>
      </section>
      <section className="flex flex-1 px-6">
        <Card className="flex-1">
          {!isLoading ? (
            <CardBody>
              <form
                onSubmit={handleSubmit(handleUpdateCustomer)}
                className="flex flex-col gap-3 p-6"
              >
                <section className="text-xl">
                  <Input
                    type="text"
                    autoComplete="off"
                    label="Nome"
                    isInvalid={!!errors.name?.message}
                    errorMessage={errors.name?.message}
                    variant="bordered"
                    defaultValue={customer?.name}
                    placeholder="Digite seu nome do cliente"
                    {...register('name')}
                  />
                </section>
                <section className="text-xl">
                  <Input
                    type="text"
                    label="Função"
                    variant="bordered"
                    isInvalid={!!errors.role?.message}
                    errorMessage={errors.role?.message}
                    defaultValue={customer?.role}
                    placeholder="Digite a função do cliente"
                    {...register('role')}
                  />
                </section>
                <section className="text-xl">
                  <strong>Status: </strong>
                  <Switch
                    defaultSelected={customer?.status}
                    aria-label="Status do cliente"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleUpdateStatus(e)
                    }
                  />
                </section>
                <section className="text-xl">
                  <strong>Aceito termo: </strong>
                  <Switch aria-label="Aceitou o termo" {...register('terms')} />
                </section>
                <Button
                  size="lg"
                  isLoading={isFetching}
                  type="submit"
                  color="primary"
                  fullWidth
                >
                  {!isFetching ? 'Atualizar' : ''}
                </Button>
              </form>
            </CardBody>
          ) : (
            <CardBody className="flex gap-3 p-6">
              <section>Carregando dados do cliente...</section>
            </CardBody>
          )}
        </Card>
      </section>
      <DevTool control={control} />
      <ToastContainer />
    </main>
  )
}
