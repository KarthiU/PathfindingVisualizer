import React, {Component, UseState} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../Algorithms/dijkstra';
import styled, { withTheme } from 'styled-components';
import './PathfindingVisualizer.css';
import { FaArrowsAlt } from 'react-icons/fa';
import  './Components/Navbar.css';

const Button = styled.button`

  background-color: #2c8ec7; 
  color: white; 
  padding: 10px 15px; 
  margin: 10px; 
  border: none; 
  outline: none;
  border-radius: 5px; 
  

  transition: ease background-color 250ms; 
  &:hover {

    background-color: #115177; 
  }
`


const START_NODE_ROW = 10;
const START_NODE_COL = 10;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 40;


export default class PathfindingVisualizer extends Component {
  constructor() {
    super();

    
    this.state = {
      grid: [],
      mouseIsPressed: false,
    };
  }
  

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({grid});
  } 

  resetWalls(){
    const grid = getInitialGrid();
    this.setState({grid});
    }


  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid, mouseIsPressed: true});
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid});
  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false});
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  }

  visualizeDijkstra() {
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
   
  }

  randomWalls() 
  { 
    for(let i = 0; i < 250; i++)
    { 
      var col = Math.ceil(Math.random() * 48)
      var row = Math.ceil(Math.random() * 18)
      const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({grid: newGrid});
    } 
       
  } 


  

  render() {
    const {grid, mouseIsPressed} = this.state;
    
    

    return (
      <>
        <header>
          <h3><FaArrowsAlt/> Pathfinding Visualizer</h3>
            <a>
             <Button onClick={() => this.resetWalls()}>
                Remove Walls
              </Button>
            </a> 
            <a> 
              <Button onClick={() => this.visualizeDijkstra()}>
                Visualize Dijkstra's Algorithm
              </Button>
           </a> 
           <a>
           <Button onClick={() => this.randomWalls()}>
                Make Random Walls
              </Button>
           </a>
         </header> 
         <h2> 
          Click and drag anywhere to create walls! (make sure a path from start to end exists)
        </h2> 
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall} = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
        currentRow.push(createNode(col, row))
        document.getElementById(`node-${col}-${row}`)
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

