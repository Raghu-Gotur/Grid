import React, { useEffect, useState } from 'react';
import Button from './Button';

const Grid = () => {
  const [grid, setGrid] = useState(null);
  const [firstTile, setFirstTile] = useState({
    row: null,
    column: null,
  });
  const [secondTile, setSecondTile] = useState({
    row: null,
    column: null,
  });

  const setInitArray = () => {
    var arr = [];
    for (let i = 0; i < 20; i++) {
      arr[i] = [];
      for (let j = 0; j < 20; j++) {
        arr[i][j] = {
          value: j,
          selected: false,
          visited: false,
        };
      }
    }
    setGrid(arr);
  };

  useEffect(() => {
    setInitArray();
  }, []);

  const highlightTile = (rowindex, colindex) => {
    const updatedGrid = grid?.map((row, rowIndex) =>
      row?.map((column, columnIndex) => {
        if (rowIndex === rowindex && columnIndex === colindex) {
          if (!column.selected) {
            if (firstTile?.row !== null) {
              setSecondTile({ row: rowindex, column: colindex });
            } else {
              setFirstTile({ row: rowindex, column: colindex });
            }
          } else {
            if (firstTile?.row === rowindex) {
              setFirstTile({ row: null, column: null });
            } else {
              setSecondTile({ row: null, column: null });
            }
          }
          return { ...column, selected: !column?.selected };
        }
        return column;
      })
    );
    setGrid(updatedGrid);
  };

  const findPath = (startTile, endTile) => {
    if (!startTile || !endTile) return;

    const queue = [];
    const directions = [
      { row: -1, column: 0 }, // Up
      { row: 1, column: 0 }, // Down
      { row: 0, column: -1 }, // Left
      { row: 0, column: 1 }, // Right
    ];

    const visited = new Set();
    const parents = {};

    queue.push(startTile);
    visited.add(`${startTile.row},${startTile.column}`);

    while (queue.length > 0) {
      const currentTile = queue.shift();

      if (
        currentTile.row === endTile.row &&
        currentTile.column === endTile.column
      ) {
        break;
      }

      for (let direction of directions) {
        const newRow = currentTile.row + direction.row;
        const newColumn = currentTile.column + direction.column;

        if (
          newRow >= 0 &&
          newRow < grid.length &&
          newColumn >= 0 &&
          newColumn < grid[0].length &&
          !visited.has(`${newRow},${newColumn}`)
        ) {
          queue.push({ row: newRow, column: newColumn });
          visited.add(`${newRow},${newColumn}`);
          parents[`${newRow},${newColumn}`] = currentTile;
        }
      }
    }

    // Reconstruct the path from the `parents` object
    let path = [];
    let current = endTile;

    while (current) {
      path.push(current);
      current = parents[`${current.row},${current.column}`];
    }

    path.reverse();

    // Highlight the path on the grid and set visited to true for the shortest path tiles
    setGrid((prevGrid) =>
      prevGrid.map((row, rowIndex) =>
        row.map((column, colIndex) => {
          const isPath = path.some(
            (tile) => tile.row === rowIndex && tile.column === colIndex
          );
          return isPath ? { ...column, visited: true } : column;
        })
      )
    );
  };

  return (
    <div>
      <div className='grid-container'>
        {grid?.map((row, rowIndex) =>
          row?.map((column, colIndex) => (
            <Button
              key={`${rowIndex}-${colIndex}`}
              className='grid-item'
              onClick={() => highlightTile(rowIndex, colIndex)}
              style={{
                backgroundColor: column?.visited
                  ? 'green'
                  : column?.selected
                  ? 'red'
                  : null,
                cursor: 'pointer',
              }}
              disabled={
                !column?.selected &&
                firstTile?.row !== null &&
                secondTile?.row !== null
              }
            >
              {column?.value}
            </Button>
          ))
        )}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          margin: '10px',
        }}
      >
        <Button
          onClick={() => {
            firstTile?.row > secondTile?.row
              ? findPath(secondTile, firstTile)
              : findPath(firstTile, secondTile);
          }}
          style={{
            padding: '5px',
            width: '100px',
          }}
        >
          Find
        </Button>
        <Button
          onClick={() => {
            setFirstTile({ row: null, column: null });
            setSecondTile({ row: null, column: null });
            setInitArray();
          }}
          style={{
            padding: '5px',
            width: '100px',
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default Grid;
