import './App.css'
import Die from './components/Die'
import React from "react"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"

function App() {
  const [diceValues, setDiceValues] = React.useState(allNewDice())

  const [tenzies, setTenziez] = React.useState(false)

  const [rollCount, setRollCount] = React.useState(0)

  const [seconds, setSeconds] = React.useState(0)
  const [minutes, setMinutes] = React.useState(0)

  const [gameStarted, setGameStarted] = React.useState(false)

  const [gamesWon, setGamesWon] = React.useState(0)

  const [bestTime, setBestTime] = React.useState(localStorage.getItem("seconds") || 0)

  React.useEffect(() => {
    if (tenzies && seconds < bestTime) {
      localStorage.setItem("seconds", JSON.stringify(seconds))
    }
  }, [tenzies, bestTime, seconds])

  React.useEffect(() => {
    let interval = null
    if (gameStarted && !tenzies) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1)
  
        if (seconds === 59) {
          setSeconds(0)
          setMinutes(prevMinutes => prevMinutes + 1)
        }
      }, 1000)
  
      return () => clearInterval(interval)
    }

  }, [tenzies, gameStarted, seconds])

 

  React.useEffect(() => {
    const allHeld = diceValues.every(dice => dice.isHeld)
    const firstValue = diceValues[0].value
    const allSameValue = diceValues.every(dice => dice.value === firstValue)

    if (allHeld && allSameValue) {
      setTenziez(true)
    }    
  }, [diceValues])


  function generateNewDice() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid()
    }
  }
  
  function allNewDice() {
    const values = []
    for (let i = 0; i < 10; i++) {
        values.push(generateNewDice())
    }
    return values;
  }

  
  function rollDice() {
    if (!tenzies) {
      setDiceValues(prevDiceValues => 
        prevDiceValues.map((diceValue) => {
          return diceValue.isHeld ? diceValue : generateNewDice()
          
          }))
    } else {
        setTenziez(false)
        setDiceValues(allNewDice()) 
      }
    
      setRollCount(rollCount + 1)

      if (tenzies) {
        setGamesWon(gamesWon + 1)
        setRollCount(0)
        setGameStarted(false)
        setSeconds(0)
        setMinutes(0)
        if (gamesWon === 1) {
          setBestTime(seconds)
        }

        else {
          if (seconds < bestTime) {
            setBestTime(seconds)
          }
        }
      }
    }

  function holdDice(id) {
    setDiceValues(prevDiceValues =>
      prevDiceValues.map((diceValue => 
        diceValue.id === id ? {...diceValue, isHeld: !diceValue.isHeld} : diceValue
      ))
    )
  }

  function gameState() {
    let state = ""
    if (!gameStarted && !tenzies) {
      state = "Start Game"
    } else if (gameStarted && !tenzies) {
      state = "Roll"
    } else if(gameStarted && tenzies) {
      state= "New Game"
    }
    return state
  }

  function startGame() {
    setGameStarted(true)
  }

  const diceElements = diceValues.map(die => 
  <Die 
  key={die.id} 
  value={die.value} 
  isHeld={die.isHeld} 
  holdDice={() => holdDice(die.id)}
  gameStarted={gameStarted}
  />)

  return (
    <main className="main">
        {tenzies && <Confetti/>}
        <div className="header--container">
          <h1>Tenzies</h1>
          <p>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
        </div>     
        <div className="dice--container">
          {diceElements}
        </div>
        <div className='rolls--container'>
          <button onClick={gameStarted ? rollDice : startGame} className="rolldice">{gameState()}</button>
          <div className='scores'>
            <p>Rolls: <span className='rolls'>{rollCount}</span></p>
            <p>Time: <span className='time'>{minutes < 10 ? "0" + minutes : minutes}:{seconds < 10 ? "0" + seconds : seconds}</span></p>
            <p>Best Time: <span className='time'>00:{bestTime < 10 ? "0" + bestTime : bestTime}</span></p>
          </div>
        </div>
    </main>
  )
}

export default App
