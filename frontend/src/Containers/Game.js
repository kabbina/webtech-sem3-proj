import React, { useEffect, useState } from 'react'
import fetchWinner from '../Utils/winner';
import '../App.css'
import {
  Button,
  Flex
} from "@chakra-ui/core";
import { useDispatch, useSelector } from 'react-redux';
import { storeTicToeWinner } from '../actions/winnerActions';
import "../Containers/Gamestyle.css";

function Board({squares, onClick}) {
  const renderSquare = i => (
    <button className="square" onClick={() => onClick(i)}>
      {squares[i]}
    </button>
  )

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function historyReducer(state, action) {
  const {history, entryNumber} = state
  switch (action.type) {
    case 'ADD_ENTRY': {
      const newHistory = history.slice(0, entryNumber + 1)
      newHistory[newHistory.length] = action.newEntry
      return {
        history: newHistory,
        entryNumber: newHistory.length - 1,
      }
    }
    case 'GO_TO_ENTRY': {
      return {
        ...state,
        entryNumber: action.entryNumber,
      }
    }
    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}

function useHistory(initialHistory = [], initialEntryNumber = 0) {
  const [state, dispatch] = React.useReducer(historyReducer, {
    history: initialHistory,
    entryNumber: initialEntryNumber,
  })
  const {history, entryNumber} = state
  const current = history[entryNumber]
  const goToEntry = newEntryNumber =>
    dispatch({type: 'GO_TO_ENTRY', entryNumber: newEntryNumber})
  const addEntry = newEntry => dispatch({type: 'ADD_ENTRY', newEntry})
  return {history, entryNumber, current, goToEntry, addEntry}
}

function useGame() {
  const {history, entryNumber, current, goToEntry, addEntry} = useHistory([
    {squares: Array(9).fill(null)},
  ])
  const xIsNext = entryNumber % 2 === 0
  const {squares} = current

  function selectSquare(square) {
    if (fetchWinner(squares) || squares[square]) {
      return
    }
    const newSquares = [...squares]
    newSquares[square] = xIsNext ? 'X' : 'O'

    addEntry({squares: newSquares})
  }

  const winner = fetchWinner(squares)
  let status
  if (winner) {
    status = `Winner: ${winner}`
  } else if (squares.every(Boolean)) {
    status = `It's a tie`
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`
  }

  return {history, squares, selectSquare, goToStep: goToEntry, status}
}
function Game({ userName, getWinner }) {
  const {history, squares, selectSquare, goToStep, status} = useGame()
  const moves = history.map((step, stepNumber) => {
    const desc = stepNumber ? `Go to move #${stepNumber}` : 'Go to game start'
    return (
      <li key={stepNumber}>
        <button clasName = 'buttonttt' onClick={() => goToStep(0)}>{desc}</button>
      </li>
    )
  });
  useEffect(() => {
    if (status.includes('Winner')) {
      if(status === 'Winner: X') {
      getWinner(userName);
    } else {
      getWinner('Challenger');
    }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])
  return (
    <Flex className = 'gamepage' align="center" justify="center" height="100vh" direction="column" paddingBottom="5px">
      <h1 className = 'greet1'>Welcome {userName} !</h1>
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={squares} />
      </div>
      <div className="game-info">
        <h1 className = 'result'>{status}</h1>
        <br />
        <Button onClick={() => goToStep(0)}>Reset</Button>
      </div>
    </div>
    </Flex>
  )
}

function GameFunc(props) {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin;
  const [userName, setUserName] = useState('');
  useEffect(() => {
    setUserName(userInfo.name);
  }, [userInfo]);
  const winnerCallBack = (data) => {
    dispatch(storeTicToeWinner(data, 'Tictactoe', '1'));
  }
  return <Game userName={userName} getWinner={winnerCallBack}/>
}

export default GameFunc

