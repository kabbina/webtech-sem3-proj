import React from "react";
import fetchWinner from "../Utils/winner";
import "../App.css";
import { Button, Flex } from "@chakra-ui/core";
import { useHistory } from "react-router-dom";
function Board({ squares, onClick }) {
  const renderSquare = (i) => (
    <Button className="square" size="lg" onClick={() => onClick(i)}>
      {squares[i]}
    </Button>
  );

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
  );
}

function historyReducer(state, action) {
  const { hist, entryNumber } = state;
  switch (action.type) {
    case "ADD_ENTRY": {
      const newHistory = hist.slice(0, entryNumber + 1);
      newHistory[newHistory.length] = action.newEntry;
      return {
        hist: newHistory,
        entryNumber: newHistory.length - 1,
      };
    }
    case "GO_TO_ENTRY": {
      return {
        ...state,
        entryNumber: action.entryNumber,
      };
    }
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

function useHist(initialHistory = [], initialEntryNumber = 0) {
  const [state, dispatch] = React.useReducer(historyReducer, {
    hist: initialHistory,
    entryNumber: initialEntryNumber,
  });
  const { hist, entryNumber } = state;
  const current = hist[entryNumber];
  const goToEntry = (newEntryNumber) =>
    dispatch({ type: "GO_TO_ENTRY", entryNumber: newEntryNumber });
  const addEntry = (newEntry) => dispatch({ type: "ADD_ENTRY", newEntry });
  return { hist, entryNumber, current, goToEntry, addEntry };
}

function useGame() {
  const { hist, entryNumber, current, goToEntry, addEntry } = useHist([
    { squares: Array(9).fill(null) },
  ]);
  const xIsNext = entryNumber % 2 === 0;
  const { squares } = current;

  function selectSquare(square) {
    if (fetchWinner(squares) || squares[square]) {
      return;
    }
    const newSquares = [...squares];
    newSquares[square] = xIsNext ? "X" : "O";

    addEntry({ squares: newSquares });
  }

  const winner = fetchWinner(squares);
  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (squares.every(Boolean)) {
    status = `It's a tie`;
  } else {
    status = `Next player: ${xIsNext ? "X" : "O"}`;
  }

  return { hist, squares, selectSquare, goToStep: goToEntry, status };
}
function Game() {
  const { squares, selectSquare, goToStep, status } = useGame();
  // const moves = hist.map((step, stepNumber) => {
  //   const desc = stepNumber ? `Go to move #${stepNumber}` : "Go to game start";
  //   return (
  //     <li key={stepNumber}>
  //       <Button size="sm" onClick={() => goToStep(stepNumber)}>
  //         {desc}
  //       </Button>
  //     </li>
  //   );
  // });
  const history = useHistory();
  const handelquit = () => {
    history.goBack();
  };

  return (
    <Flex
      align="center"
      justify="center"
      height="100vh"
      direction="column"
      paddingBottom="10px"
    >
      <div className="game">
        <div className="game-board">
          <Board onClick={selectSquare} squares={squares} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <br />
          <Button onClick={() => goToStep(0)}>Reset</Button>
          <br />
          <br />
          <Button _hover={{ bg: `red.500` }} onClick={() => handelquit()}>exit</Button>
          {/*<p>{moves}</p>*/}
        </div>
      </div>
    </Flex>
  );
}

function GameFunc() {
  return <Game />;
}

export default GameFunc;
