import { read } from 'promise-path'
import { reportGenerator } from '../../util'

const report = reportGenerator(__filename)

export async function run(day: string) {
  const input = (
    await read(`solutions/${day}/input.txt`, 'utf8')
  ).trim()

  const testInput = 'FBFBBFFRLR'
  const testInput2 = 'BFFFBBFRRR'
  const testInput3 = 'FFFBBBFRRR'
  const testInput4 = 'BBFFBBFRLL'
  const testInputAsArray = testInput.split('\n')

  const inputAsArray = input.split('\n')

  await solveForFirstStar(testInput, testInputAsArray, true, true)
  await solveForFirstStar(testInput2, [testInput2], true, true)
  await solveForFirstStar(testInput3, [testInput3], true, true)
  await solveForFirstStar(testInput4, [testInput4], true, true)
  await solveForFirstStar(input, inputAsArray, false, false)
  // await solveForSecondStar(testInput, testInputAsArray, true, true)
  await solveForSecondStar(input, inputAsArray, false, false)
}

function decodeId(input, debug) {
  if (debug) {
    console.log({ input })
  }
  const firstSeven = input.slice(0, 8)
  const lastThree = input.slice(7)
  let start = 0, end = 127
  const firstSevenSplit = firstSeven.split('')
  const lastThreeSplit = lastThree.split('')
  let row, column
  firstSevenSplit.forEach((frontOrBack, idx) => {
    if (idx === firstSevenSplit.length - 1) {
      if (frontOrBack === 'F') {
        row = start
      } else {
        row = end
      }
    } else if (frontOrBack === 'F') {
      end = end - Math.floor((end - start + 1) / 2)
    } else {
      start = start + Math.floor((end - start + 1) / 2)
    }
  })

  let lastThreeStart = 0, lastThreeEnd = 7

  lastThreeSplit.forEach((rightOrLeft, idx) => {
    if (idx === lastThreeSplit.length - 1) {
      if (rightOrLeft === 'L') {
        column = lastThreeStart
      } else {
        column = lastThreeEnd
      }
    } else if (rightOrLeft === 'L') {
      lastThreeEnd = lastThreeEnd - Math.floor((lastThreeEnd - lastThreeStart + 1) / 2)
    } else {
      lastThreeStart = lastThreeStart + Math.floor((lastThreeEnd - lastThreeStart + 1) / 2)
    }
    if (debug) {
      console.log({ lastThreeStart, lastThreeEnd })
    }
  })
  const seatId = row * 8 + column
  if (debug || isNaN(seatId)) {
    console.log({ row, column, seatId })
  }
  return seatId
}

async function solveForFirstStar(input: string, inputAsArray: Array<any>, test: boolean, debug: boolean) {
  const values = inputAsArray.map((value) => Number(decodeId(value, debug)))
  report(`Solution 1${test ? ' (for test input)' : ''}:`, Math.max(...values).toString())
}

async function solveForSecondStar(input: string, inputAsArray: Array<any>, test: boolean, debug: boolean) {
  const values = inputAsArray.map((value) => Number(decodeId(value, debug)))
  for (let i = 0; i < 128; i++) {
    for (let j = 0; j < 8; j++) {
      const seatId = i * 8 + j
      if (!values.includes(seatId) && values.includes(seatId + 1) && values.includes(seatId - 1)) {
        return report(`Solution 2${test ? ' (for test input)' : ''}:`, seatId.toString())
      }
    }
  }
}
