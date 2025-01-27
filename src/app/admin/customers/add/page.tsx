'use client'

import { createUserSchema, TUser } from '@/app/schemas/schemasZod'
import 'react-toastify/dist/ReactToastify.css'
import { FileWithPath, useDropzone } from 'react-dropzone'
import {
  Button,
  cn,
  Input,
  Switch,
  Select,
  SelectItem,
} from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { ToastContainer, toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
// import { DevTool } from '@hookform/devtools'
import {
  getAddressByCEP,
  maskCEP,
  maskDocument,
  maskPhone,
} from '@/app/utils/utils'
import React from 'react'
import { IViaCEP } from '@/interfaces/cep'
import { zodResolver } from '@hookform/resolvers/zod'
import { createUser } from '@/app/useCases/users/createUser'

export default function AddFormCustomers() {
  const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out',
  }

  const focusedStyle = {
    borderColor: '#2196f3',
  }

  const acceptStyle = {
    borderColor: '#00e676',
  }

  const rejectStyle = {
    borderColor: '#ff1744',
  }

  const router = useRouter()
  const [isFetching, setIsFetching] = React.useState<boolean>(false)
  const howMeet = [
    { key: 'Google', label: 'Google' },
    { key: 'Facebook', label: 'Facebook' },
    { key: 'Instagram', label: 'Instagram' },
  ]

  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone()

  const style = React.useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [
      isFocused,
      isDragAccept,
      isDragReject,
      focusedStyle,
      acceptStyle,
      rejectStyle,
      baseStyle,
    ],
  )

  const files = acceptedFiles.map((file: FileWithPath) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
      <img src={file.path} alt="" className="h-20 w-20 object-cover" />
    </li>
  ))

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    // control,
    formState: { errors },
  } = useForm<TUser>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      status: false,
    },
  })

  async function handleGetAddress(cep: string) {
    try {
      const response = await getAddressByCEP(cep)
      if ('error' in response) {
        throw Error('CEP inválido')
      }
      const address = response as IViaCEP
      setValue('street', address?.logradouro)
      setValue('district', address?.bairro)
      setValue('city', address?.localidade)
      setValue('state', address?.uf)
    } catch (error) {
      toast.error('CEP inválido', {
        theme: 'colored',
      })
    }
  }

  async function handleCreateUser(data: TUser) {
    try {
      setIsFetching(true)
      await createUser(data)
      toast.success('Usuário criado', {
        theme: 'colored',
      })
      reset()
    } catch (error) {
      toast.error('Problemas ao salvar', {
        theme: 'colored',
      })
    } finally {
      setIsFetching(false)
    }
  }

  function handleStatus(e: React.ChangeEvent<HTMLInputElement>) {
    setValue('status', e.target.checked)
  }

  React.useEffect(() => {
    console.log(errors)
  }, [errors])

  return (
    <main className="mb-20 flex h-screen flex-col">
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
      <form onSubmit={handleSubmit(handleCreateUser)}>
        <section className="grid grid-cols-3 gap-2 p-6">
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
            isInvalid={!!errors.cep?.message}
            errorMessage={errors.cep?.message}
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
          <Input
            isReadOnly
            type="text"
            label="Rua"
            value={watch('street')}
            placeholder=""
            {...register('street')}
          />
          <Input
            type="text"
            label="Número"
            isInvalid={!!errors.number?.message}
            errorMessage={errors.number?.message}
            placeholder=""
            {...register('number')}
          />
          <Input
            type="text"
            isReadOnly
            value={watch('district')}
            label="Bairro"
            placeholder=""
            {...register('district')}
          />
          <Input
            type="text"
            isReadOnly
            value={watch('city')}
            label="Cidade"
            placeholder=""
            {...register('city')}
          />
          <Input
            type="text"
            isReadOnly
            value={watch('state')}
            label="Estado"
            placeholder=""
            {...register('state')}
          />
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
            maxLength={15}
            placeholder=""
            isInvalid={!!errors.phone?.message}
            errorMessage={errors.phone?.message}
            onInput={(event) => {
              const input = (event?.target as HTMLInputElement)?.value
              const maskedInput = maskPhone(input)
              setValue('phone', maskedInput)
            }}
            {...register('phone')}
          />
          <Switch
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleStatus(e)
            }
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
        </section>
        <section className="container">
          <div {...getRootProps({ style })}>
            <input {...getInputProps()} />
            <p>Drag drop some files here, or click to select files</p>
          </div>
          <aside>
            <h4>Files</h4>
            <ul>{files}</ul>
          </aside>
        </section>
        <section className="flex w-full justify-end p-6">
          <Button
            size="lg"
            isLoading={isFetching}
            type="submit"
            color="primary"
            className="w-60"
          >
            {!isFetching ? 'Cadastrar Cliente' : ''}
          </Button>
        </section>
      </form>
      {/* <DevTool control={control} /> */}
      <ToastContainer />
    </main>
  )
}
