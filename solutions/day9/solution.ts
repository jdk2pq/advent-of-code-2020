import { read } from 'promise-path'
import { reportGenerator } from '../../util'

const report = reportGenerator(__filename)

export async function run(day: string) {
  const input = (await read(`solutions/${day}/input.txt`, 'utf8')).trim()

  const testInput =
    '35\n' +
    '20\n' +
    '15\n' +
    '25\n' +
    '47\n' +
    '40\n' +
    '62\n' +
    '55\n' +
    '65\n' +
    '95\n' +
    '102\n' +
    '117\n' +
    '150\n' +
    '182\n' +
    '127\n' +
    '219\n' +
    '299\n' +
    '277\n' +
    '309\n' +
    '576'
  const testInputAsArray = testInput.split('\n')

  const inputAsArray = input.split('\n')

  await solveForFirstStar(testInput, testInputAsArray, true, true, 5)
  await solveForFirstStar(input, inputAsArray, false, false, 25)
  await solveForSecondStar(testInput, testInputAsArray, true, true, 5)
  await solveForSecondStar(input, inputAsArray, false, false, 25)
}

function findWrongNumber(preamble: number, input: number[]): number {
  const afterPreamble = input.slice(preamble)

  for (let i = 0; i < afterPreamble.length; i++) {
    const availableNumbers = input.slice(i, preamble + i)
    const number = input[preamble + i]

    const filtered = availableNumbers.filter(v => v < number)
    let f, s
    f = filtered.find(first => {
      s = filtered.find(second => first + second === number)
      if (s) {
        return first
      }
    })
    if (!f && !s) {
      return number
    }
  }
  return -1
}

async function solveForFirstStar(
  input: string,
  inputAsArray: Array<any>,
  test: boolean,
  debug: boolean,
  preamble: number
) {
  report(
    `Solution 1${test ? ' (for test input)' : ''}:`,
    findWrongNumber(
      preamble,
      inputAsArray.map(n => Number(n))
    ).toString()
  )
}

async function solveForSecondStar(
  input: string,
  inputAsArray: Array<any>,
  test: boolean,
  debug: boolean,
  preamble: number
) {
  const inputAsNumberArray = inputAsArray.map(n => Number(n))
  const wrongNumber = findWrongNumber(preamble, inputAsNumberArray)
  const inputAsNumberArrayWithHoles = inputAsNumberArray.map(n => {
    if (n > wrongNumber) {
      return null
    } else {
      return n
    }
  })

  for (let i = 0; i < inputAsNumberArrayWithHoles.length; i++) {
    if (inputAsNumberArrayWithHoles[i] !== null) {
      for (let j = i + 2; j < inputAsNumberArrayWithHoles.length; j++) {
        if (inputAsNumberArrayWithHoles[j] === null) {
          break
        }
        const values = inputAsNumberArrayWithHoles.slice(i, j)
        if (debug) {
          console.log(values)
        }
        const sum = (values as number[]).reduce((acc: number, v) => acc + v, 0)
        if (sum === wrongNumber) {
          if (debug) {
            console.log(values)
          }
          return report(
            `Solution 2${test ? ' (for test input)' : ''}:`,
            `${
              Math.min(...(values as number[])) +
              Math.max(...(values as number[]))
            }`
          )
        } else if (sum > wrongNumber) {
          break
        }
      }
    }
  }
}
