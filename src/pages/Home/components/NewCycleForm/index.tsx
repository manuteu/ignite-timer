import React from 'react'
import { FormContainer, MinutesAmountInput, TaskInput } from './styles'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'


export default function NewCycleForm() {
  type NewCycleFormData = zod.infer<typeof newCycleFormValidationScheme>

  
  const newCycleFormValidationScheme = zod.object({
    task: zod.string().min(1, { message: 'Informe a tarefa' }),
    minutesAmount: zod
      .number()
      .min(1, 'O ciclo precisa ser de no mínimo 5 minutos.')
      .max(60, 'O ciclo precisa ser de no máximo 60 minutos.')
  })

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationScheme),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    }
  })
  return (
    <FormContainer>
      <label htmlFor="task">Vou trabalhar em</label>
      <TaskInput
        id="task"
        type="text"
        placeholder='Dê um nome para o seu projeto'
        list='task-suggestions'
        disabled={!!activeCycle}
        {...register('task')}
      />

      <datalist id='task-suggestions'>
        <option value="Projeto 1" />
        <option value="Projeto 2" />
        <option value="Projeto 3" />
      </datalist>

      <label htmlFor="minutesAmount">durante</label>
      <MinutesAmountInput
        id="minutesAmount"
        type="number"
        placeholder='00'
        step={5}
        min={1}
        max={60}
        disabled={!!activeCycle}
        {...register('minutesAmount', { valueAsNumber: true })}
      />

      <span>minutos.</span>
    </FormContainer>
  )
}
