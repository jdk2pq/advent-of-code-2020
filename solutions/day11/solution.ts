import { read } from 'promise-path'
import { arrToNumberArr, reportGenerator, sortNumbers } from '../../util'

const report = reportGenerator(__filename)

export async function run(day: string) {
  const input = (await read(`solutions/${day}/input.txt`, 'utf8')).trim()

  const testInput =
    'L.LL.LL.LL\n' +
    'LLLLLLL.LL\n' +
    'L.L.L..L..\n' +
    'LLLL.LL.LL\n' +
    'L.LL.LL.LL\n' +
    'L.LLLLL.LL\n' +
    '..L.L.....\n' +
    'LLLLLLLLLL\n' +
    'L.LLLLLL.L\n' +
    'L.LLLLL.LL'
  const testInputAsArray = testInput.split('\n')

  const inputAsArray = input.split('\n')

  await solveForFirstStar(testInput, testInputAsArray, true, true)
  await solveForFirstStar(input, inputAsArray, false, false)
  await solveForSecondStar(testInput, testInputAsArray, true, true)
  await solveForSecondStar(input, inputAsArray, false, false)
}

const adjacency = (
  input: string[][],
  char: string,
  i: number,
  j: number,
  allowFloor: boolean
) => {
  const topLeft =
    input[i - 1] && input[i - 1][j - 1]
      ? input[i - 1][j - 1] === char ||
        (allowFloor && input[i - 1][j - 1] === '.')
      : null
  const top =
    input[i - 1] && input[i - 1][j]
      ? input[i - 1][j] === char || (allowFloor && input[i - 1][j] === '.')
      : null
  const topRight =
    input[i - 1] && input[i - 1][j + 1]
      ? input[i - 1][j + 1] === char ||
        (allowFloor && input[i - 1][j + 1] === '.')
      : null
  const middleLeft = input[i][j - 1]
    ? input[i][j - 1] === char || (allowFloor && input[i][j - 1] === '.')
    : null
  const middleRight = input[i][j + 1]
    ? input[i][j + 1] === char || (allowFloor && input[i][j + 1] === '.')
    : null
  const bottomLeft =
    input[i + 1] && input[i + 1][j - 1]
      ? input[i + 1][j - 1] === char ||
        (allowFloor && input[i + 1][j - 1] === '.')
      : null
  const bottom =
    input[i + 1] && input[i + 1][j]
      ? input[i + 1][j] === char || (allowFloor && input[i + 1][j] === '.')
      : null
  const bottomRight =
    input[i + 1] && input[i + 1][j + 1]
      ? input[i + 1][j + 1] === char ||
        (allowFloor && input[i + 1][j + 1] === '.')
      : null

  return [
    topLeft,
    top,
    topRight,
    middleLeft,
    middleRight,
    bottomLeft,
    bottom,
    bottomRight
  ]
}

const adjacency2 = (
  input: string[][],
  i: number,
  j: number,
  values: string[]
) => {
  let northWest,
    northDir,
    northEast,
    westDir,
    eastDir,
    southWest,
    southDir,
    southEast
  let north, south, east, west
  let check = values.slice()
  while (!check.every(val => !!val)) {
    north = north !== undefined ? north - 1 : i - 1
    south = south !== undefined ? south + 1 : i + 1
    east = east !== undefined ? east + 1 : j + 1
    west = west !== undefined ? west - 1 : j - 1

    northWest =
      check[0] ||
      (input[north] && input[north][west]
        ? input[north][west] !== '.'
          ? input[north][west]
          : ''
        : 'end')
    northDir =
      check[1] ||
      (input[north] && input[north][j]
        ? input[north][j] !== '.'
          ? input[north][j]
          : ''
        : 'end')
    northEast =
      check[2] ||
      (input[north] && input[north][east]
        ? input[north][east] !== '.'
          ? input[north][east]
          : ''
        : 'end')

    westDir =
      check[3] ||
      (input[i][west] ? (input[i][west] !== '.' ? input[i][west] : '') : 'end')
    eastDir =
      check[4] ||
      (input[i][east] ? (input[i][east] !== '.' ? input[i][east] : '') : 'end')

    southWest =
      check[5] ||
      (input[south] && input[south][west]
        ? input[south][west] !== '.'
          ? input[south][west]
          : ''
        : 'end')
    southDir =
      check[6] ||
      (input[south] && input[south][j]
        ? input[south][j] !== '.'
          ? input[south][j]
          : ''
        : 'end')
    southEast =
      check[7] ||
      (input[south] && input[south][east]
        ? input[south][east] !== '.'
          ? input[south][east]
          : ''
        : 'end')
    check = [
      northWest,
      northDir,
      northEast,
      westDir,
      eastDir,
      southWest,
      southDir,
      southEast
    ]
  }

  return check
}

function seat(inArr: string[], debug: boolean): number {
  let value = 0
  let newValue = -1
  let input: string[][] = inArr.map(line => line.split(''))
  let newInput: string[][] = input.map(line => line.slice()).slice()
  if (debug) {
    newInput.forEach(line => {
      console.log(line.join(''))
    })
    console.log({ value })
    console.log('')
  }

  while (value !== newValue) {
    input.forEach((line, i) => {
      line.forEach((char, j) => {
        if (char === 'L') {
          const adjacency = adjacency(input, 'L', i, j, true)
          if (adjacency.every(val => val || val === null)) {
            newInput[i][j] = '#'
            value++
          } else {
            newInput[i][j] = input[i][j]
          }
        } else if (char === '#') {
          const adjacency = adjacency(input, '#', i, j, false)
          if (adjacency.filter(val => !!val).length >= 4) {
            newInput[i][j] = 'L'
          } else {
            newInput[i][j] = input[i][j]
            value++
          }
        } else {
          newInput[i][j] = input[i][j]
        }
      })
    })
    if (newValue !== value) {
      if (debug) {
        newInput.forEach(line => {
          console.log(line.join(''))
        })
        console.log({ value })
        console.log('')
      }
      newValue = value
      value = 0
      input = newInput.slice().map(line => line.slice())
    } else {
      return value
    }
  }
  return value
}

function seat2(inArr: string[], debug: boolean): number {
  let value = 0
  let newValue = -1
  let input: string[][] = inArr.map(line => line.split(''))
  let newInput: string[][] = input.map(line => line.slice()).slice()
  if (debug) {
    newInput.forEach(line => {
      console.log(line.join(''))
    })
    console.log({ value })
    console.log('')
  }

  while (value !== newValue) {
    input.forEach((line, i) => {
      line.forEach((char, j) => {
        if (char === 'L') {
          const adjacency = adjacency2(input, i, j, [
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            ''
          ])
          if (adjacency.every(val => val !== '#')) {
            newInput[i][j] = '#'
            value++
          } else {
            newInput[i][j] = input[i][j]
          }
        } else if (char === '#') {
          const adjacency = adjacency2(input, i, j, [
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            ''
          ])
          if (adjacency.filter(val => val === '#').length >= 5) {
            newInput[i][j] = 'L'
          } else {
            newInput[i][j] = input[i][j]
            value++
          }
        } else {
          newInput[i][j] = input[i][j]
        }
      })
    })
    if (newValue !== value) {
      if (debug) {
        newInput.forEach(line => {
          console.log(line.join(''))
        })
        console.log({ value })
        console.log('')
      }
      newValue = value
      value = 0
      input = newInput.slice().map(line => line.slice())
    } else {
      return value
    }
  }
  return value
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
    seat(inputAsArray as string[], debug).toString()
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
    seat2(inputAsArray as string[], debug).toString()
  )
  console.timeEnd('part 2')
}
