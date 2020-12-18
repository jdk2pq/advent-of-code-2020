import { read } from 'promise-path'
import { arrToNumberArr, reportGenerator, sortNumbers } from '../../util'

const report = reportGenerator(__filename)

export async function run(day: string) {
  const input = (await read(`solutions/${day}/input.txt`, 'utf8')).trim()

  const testInput = '.#.\n' + '..#\n' + '###'
  const testInputAsArray = testInput.split('\n')

  const inputAsArray = input.split('\n')

  // Debug info off for this because it makes it take forever...took lots of debugging
  await solveForFirstStar(testInput, testInputAsArray, true, false)
  await solveForFirstStar(input, inputAsArray, false, false)
  await solveForSecondStar(testInput, testInputAsArray, true, false)
  await solveForSecondStar(input, inputAsArray, false, false)
}

function solve(input: string[], debug: boolean, cycles: number) {
  let gridMap = new Map<string, string>()
  input.forEach((line, y) => {
    line.split('').forEach((char, x) => {
      gridMap.set(`${x},${y},0`, char)
    })
  })

  // I thought it would be faster to just enumerate these explicitly than write a
  // recursive to figure it out...only to then realize I really only needed a
  // nested for loop and this was stupid
  function getNeighbors(
    x: number,
    y: number,
    z: number
  ): [number, number, number][] {
    return [
      [x - 1, y, z],
      [x - 1, y - 1, z],
      [x - 1, y + 1, z],

      [x + 1, y, z],
      [x + 1, y - 1, z],
      [x + 1, y + 1, z],

      [x, y - 1, z],
      [x, y + 1, z],

      [x - 1, y, z - 1],
      [x, y, z - 1],
      [x + 1, y, z - 1],
      [x - 1, y, z + 1],
      [x, y, z + 1],
      [x + 1, y, z + 1],

      [x, y - 1, z + 1],
      [x, y + 1, z + 1],
      [x, y - 1, z - 1],
      [x, y + 1, z - 1],

      [x - 1, y - 1, z + 1],
      [x - 1, y + 1, z + 1],
      [x - 1, y - 1, z - 1],
      [x - 1, y + 1, z - 1],

      [x + 1, y - 1, z + 1],
      [x + 1, y + 1, z + 1],
      [x + 1, y - 1, z - 1],
      [x + 1, y + 1, z - 1]
    ]
  }

  function checkNeighbors(x: number, y: number, z: number) {
    return getNeighbors(x, y, z).map((neighbor: [number, number, number]) =>
      gridMap.get(neighbor.join(','))
    )
  }

  for (let i = 0; i < cycles; i++) {
    const newMap = new Map(gridMap)
    Array.from(gridMap.entries()).forEach(([xyz, _]) => {
      const [x, y, z] = xyz.split(',').map(Number)
      function flipstate(checkX: number, checkY: number, checkZ: number) {
        const char = gridMap.get(`${checkX},${checkY},${checkZ}`)
        if (debug) {
          console.log({ checkX, checkY, checkZ, char })
        }
        const neighbors = checkNeighbors(checkX, checkY, checkZ)
        if (char === '#') {
          if (debug) {
            console.log({ neighbors })
          }
          const activeNeighbors = neighbors.filter(x => x === '#').length
          if (debug) {
            console.log({ activeNeighbors })
          }
          if (activeNeighbors < 2 || activeNeighbors > 3) {
            newMap.set(`${checkX},${checkY},${checkZ}`, '.')
            if (debug) {
              console.log({ i, checkX, checkY, checkZ, newValue: '.' })
            }
          }
        } else {
          const activeNeighbors = neighbors.filter(x => x === '#').length
          if (debug) {
            console.log({ activeNeighbors, dot: true })
          }
          if (activeNeighbors === 3) {
            newMap.set(`${checkX},${checkY},${checkZ}`, '#')
            if (debug) {
              console.log({ i, checkX, checkY, checkZ, newValue: '#' })
            }
          }
        }
      }

      flipstate(x, y, z)

      getNeighbors(x, y, z).map(([neighborX, neighborY, neighborZ]) => {
        flipstate(neighborX, neighborY, neighborZ)
      })
    })
    gridMap = newMap
    if (debug) {
      console.log({
        active: Array.from(gridMap.values()).filter(char => char === '#').length
      })
    }
  }

  return Array.from(gridMap.values()).filter(char => char === '#').length
}

// In retrospec, I should've just condensed this down into a single function for both problems
function solve2(input: string[], debug: boolean, cycles: number) {
  let gridMap = new Map<string, string>()
  input.forEach((line, y) => {
    line.split('').forEach((char, x) => {
      gridMap.set(`${x},${y},0,0`, char)
    })
  })

  function getNeighbors(
    x: number,
    y: number,
    z: number,
    w: number
  ): [number, number, number, number][] {
    let ret: [number, number, number, number][] = []
    for (let i = x - 1; i < x + 2; i++) {
      for (let j = y - 1; j < y + 2; j++) {
        for (let k = z - 1; k < z + 2; k++) {
          for (let l = w - 1; l < w + 2; l++) {
            if (!(x === i && y === j && z === k && w === l)) {
              ret.push([i, j, k, l])
            }
          }
        }
      }
    }
    return ret
  }

  function checkNeighbors(x: number, y: number, z: number, w: number) {
    return getNeighbors(x, y, z, w).map(
      neighbor => gridMap.get(neighbor.join(',')) as string
    )
  }

  for (let i = 0; i < cycles; i++) {
    const newMap = new Map(gridMap)
    Array.from(gridMap.entries()).forEach(([xyzw, _]) => {
      const [x, y, z, w] = xyzw.split(',').map(Number)
      function flipstate(
        checkX: number,
        checkY: number,
        checkZ: number,
        checkW: number
      ) {
        const char = gridMap.get(`${checkX},${checkY},${checkZ},${checkW}`)
        if (debug) {
          console.log({ checkX, checkY, checkZ, checkW, char })
        }
        const neighbors = checkNeighbors(checkX, checkY, checkZ, checkW)
        if (char === '#') {
          if (debug) {
            console.log({ neighbors })
          }
          const activeNeighbors = neighbors.filter(x => x === '#').length
          if (debug) {
            console.log({ activeNeighbors })
          }
          if (activeNeighbors < 2 || activeNeighbors > 3) {
            newMap.set(`${checkX},${checkY},${checkZ},${checkW}`, '.')
            if (debug) {
              console.log({ i, checkX, checkY, checkZ, checkW, newValue: '.' })
            }
          }
        } else {
          const activeNeighbors = neighbors.filter(x => x === '#').length
          if (debug) {
            console.log({ activeNeighbors, dot: true })
          }
          if (activeNeighbors === 3) {
            newMap.set(`${checkX},${checkY},${checkZ},${checkW}`, '#')
            if (debug) {
              console.log({ i, checkX, checkY, checkZ, checkW, newValue: '#' })
            }
          }
        }
      }

      flipstate(x, y, z, w)

      getNeighbors(x, y, z, w).map(
        ([neighborX, neighborY, neighborZ, neighborW]) => {
          flipstate(neighborX, neighborY, neighborZ, neighborW)
        }
      )
    })
    gridMap = newMap
    if (debug) {
      console.log({
        active: Array.from(gridMap.values()).filter(char => char === '#').length
      })
    }
  }

  return Array.from(gridMap.values()).filter(char => char === '#').length
}

async function solveForFirstStar(
  input: string,
  inputAsArray: Array<any>,
  test: boolean,
  debug: boolean
) {
  console.time('part 1')
  report(
    `Solution 1${test ? ' (for test input)' : ''}:`,
    solve(inputAsArray, debug, 6).toString()
  )
  console.timeEnd('part 1')
}

async function solveForSecondStar(
  input: string,
  inputAsArray: Array<any>,
  test: boolean,
  debug: boolean
) {
  console.time('part 2')
  report(
    `Solution 2${test ? ' (for test input)' : ''}:`,
    solve2(inputAsArray, debug, 6).toString()
  )
  console.timeEnd('part 2')
}
