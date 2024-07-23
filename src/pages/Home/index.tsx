import { HandPalm, Play } from '@phosphor-icons/react'

import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'
import { createContext, useState } from 'react'
import NewCycleForm from './components/NewCycleForm'
import CountDown from './components/CountDown'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptDate?: Date;
  finishedDate?: Date;
}

interface CyclesContextType {
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  marckCurrentCycleAsFinished: () => void;
  amountSecondsPassed: number;
  setSecondsPassed: (value: number) => void;
}

export const CyclesContext = createContext({} as CyclesContextType)

export default function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

  const newCycleFormValidationScheme = zod.object({
    task: zod.string().min(1, { message: 'Informe a tarefa' }),
    minutesAmount: zod
      .number()
      .min(1, 'O ciclo precisa ser de no mínimo 5 minutos.')
      .max(60, 'O ciclo precisa ser de no máximo 60 minutos.')
  })
  type NewCycleFormData = zod.infer<typeof newCycleFormValidationScheme>

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationScheme),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    }
  })

  const { handleSubmit, watch, reset } = newCycleForm

  const task = watch('task')
  const isSubmitDisabled = !task

  function marckCurrentCycleAsFinished() {
    setCycles(state =>
      state.map(cycle => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, finishedDate: new Date() }
        } else {
          return cycle
        }
      }))
  }

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function handleCreateNewCycle(data: any) {
    const id = String(new Date().getTime())
    const newCycle: Cycle = {
      id: id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date()
    }

    setCycles(prevState => [...prevState, newCycle])
    setActiveCycleId(id)
    setAmountSecondsPassed(0)

    reset();
  }

  function handleInterruptCycle() {
    setActiveCycleId(null)

    setCycles(state => state.map(cycle => {
      if (cycle.id === activeCycleId) {
        return { ...cycle, interruptDate: new Date() }
      } else {
        return cycle
      }
    }))
  }


  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <CyclesContext.Provider value={{ activeCycle, activeCycleId, amountSecondsPassed, marckCurrentCycleAsFinished, setSecondsPassed }} >
          <FormProvider {...newCycleForm}>
            <NewCycleForm />
          </FormProvider>
          <CountDown />
        </CyclesContext.Provider>

        {activeCycle ? (
          <StopCountdownButton onClick={handleInterruptCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
