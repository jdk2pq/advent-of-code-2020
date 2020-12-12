import { read } from 'promise-path'
import { reportGenerator } from '../../util'

const report = reportGenerator(__filename)

export async function run(day: string) {
  const input = (await read(`solutions/${day}/input.txt`, 'utf8')).trim()

  const testInput =
    'nop +0\n' +
    'acc +1\n' +
    'jmp +4\n' +
    'acc +3\n' +
    'jmp -3\n' +
    'acc -99\n' +
    'acc +1\n' +
    'jmp -4\n' +
    'acc +6'
  const testInputAsArray = testInput.split('\n')

  const inputAsArray = input.split('\n')

  await solveForFirstStar(testInput, testInputAsArray, true, true)
  await solveForFirstStar(input, inputAsArray, false, true)
  await solveForSecondStar(testInput, testInputAsArray, true, true)
  await solveForSecondStar(input, inputAsArray, false, false)
}

function readProgram(
  inputArray: Array<string>,
  debug: boolean
): { acc: number; i: number; loop: boolean } {
  let acc = 0
  const visitedIndicies: number[] = []
  let i
  for (i = 0; i < inputArray.length; ) {
    // Found a loop!
    if (visitedIndicies.includes(i)) {
      if (debug) {
        console.log('Found a loop!', {
          acc,
          i,
          visitedIndicies: visitedIndicies.join(', ')
        })
      }
      return { acc, i, loop: true }
    }
    visitedIndicies.push(i)
    const [command, value] = inputArray[i].split(' ')
    if (command === 'acc') {
      acc += Number(value)
      i++
    } else if (command === 'jmp') {
      i += Number(value)
    } else if (command === 'nop') {
      i++
    }
  }
  return { acc, i, loop: false }
}

async function solveForFirstStar(
  input: string,
  inputAsArray: Array<any>,
  test: boolean,
  debug: boolean
) {
  const solution = readProgram(inputAsArray, debug)
  report(
    `Solution 1${test ? ' (for test input)' : ''}:`,
    solution.acc.toString()
  )
}

async function solveForSecondStar(
  input: string,
  inputAsArray: Array<any>,
  test: boolean,
  debug: boolean
) {
  for (let i = 0; i < inputAsArray.length; i++) {
    const [command, value] = inputAsArray[i].split(' ')
    if (command === 'jmp' || command === 'nop') {
      const newArray = inputAsArray.slice()
      newArray[i] = `${command === 'jmp' ? 'nop' : 'jmp'} ${value}`
      const answer = readProgram(newArray, debug)
      if (!answer.loop) {
        report(
          `Solution 2${test ? ' (for test input)' : ''}:`,
          answer.acc.toString()
        )
      }
    }
  }
}
