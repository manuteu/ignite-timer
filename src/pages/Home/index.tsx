import { HandPalm, Play } from '@phosphor-icons/react'

import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'
import { useEffect, useState } from 'react'
import NewCycleForm from './components/NewCycleForm'
import CountDown from './components/CountDown'

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptDate?: Date;
  finishedDate?: Date;
}

export default function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)

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

  const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;

  const minutesAmount = Math.floor(currentSeconds / 60);
  const secondsAmount = currentSeconds % 60;

  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')


  const task = watch('task')
  const isSubmitDisabled = !task

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes} : ${seconds}`
    }

  }, [minutes, seconds])

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <NewCycleForm />
        <CountDown activeCycle={activeCycle} setCycles={setCycles} activeCycleId={activeCycleId}/>

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
