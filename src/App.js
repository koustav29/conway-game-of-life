
import logo from './logo.svg';
import './App.css';
import { useCallback, useRef, useState } from 'react';
import { produce } from 'immer';

const numRows = 50;
const numCols = 50;

const generateNewGrid = () => {
  const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }
  return rows;
};
function App() {
  const operations = [
    [0,1],
    [0,-1],
    [1,-1],
    [-1,1],
    [1,1],
    [-1,-1],
    [1,0],
    [-1,0]
  ];
  //initializing grid
  const [grid, setGrid] = useState(() => {
    return generateNewGrid();
  });
  console.log(grid);

  //runnging state check
  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;

  //using callback function for generating the function only once but the state of the grid will change and as will change the grid accordingly
  const runSimulation = useCallback(()=>{
    if(!runningRef.current) return;
    //simulate 
    setGrid(g=>{
      return produce(g,gridCopy => {
        for(let i=0;i<numRows;i++){
          for(let j=0;j<numCols;j++){
            let neighbours = 0;
            operations.forEach(([x,y])=>{
              const newI = i+x;
              const newJ = j+y;
              if(newI>=0 && newI<numRows && newJ>=0 && newJ<numCols) neighbours += g[newI][newJ];
            })
            if(neighbours< 2 ||neighbours>3) gridCopy[i][j]=0;
            else if(g[i][j]===0 && neighbours===3) gridCopy[i][j]=1;
          }
        }
      })
    });
    setTimeout(runSimulation,1000);
  },[]);
  return (
    <>
      <button onClick={()=>{
        setRunning(!running);
        if(!running){
          runningRef.current=true;
          runSimulation();
        }
      }}>
        {running ? "Stop" : "Start"}
      </button>

      {/* clear matrix */}
      <button onClick={()=>{
        setGrid(generateNewGrid());
      }}>clear</button>
      <button onClick={()=>{
        const rows = [];
        for (let i = 0; i < numRows; i++) {
          rows.push(Array.from(Array(numCols), () => Math.random()>0.5?1:0));
        }
        setGrid(rows);
      }}>random</button>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${numCols},20px)`
      }}>
        {grid.map((rows, i) =>
          rows.map((cols, j) => (
            <div
              onClick={() => {
                const newGrid = produce(grid, gridCopy => {
                  gridCopy[i][j] = grid[i][j] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              key={`${i}-${j}`}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][j] ? "#5EFF00" : undefined,
                border: "solid 1px black",
                borderRadius: '2px'
              }}
            />
          ))
        )}
      </div>
    </>
  );
}

export default App;
