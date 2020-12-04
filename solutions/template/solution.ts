import { read } from 'promise-path'
import { reportGenerator } from '../../util'

const report = reportGenerator(__filename)

export async function run(day: string) {
  const input = (
    await read(`solutions/${day}/input.txt`, 'utf8')
  ).trim()

  const testInput = ''
  const testInputAsArray = testInput.split('\n')

  const inputAsArray = input.split('\n')

  await solveForFirstStar(testInput, testInputAsArray, true)
  await solveForFirstStar(input, inputAsArray, false)
  await solveForSecondStar(testInput, testInputAsArray, true)
  await solveForSecondStar(input, inputAsArray, false)
}

async function solveForFirstStar(input: string, inputAsArray: Array<any>, test: boolean) {
  const solution = 'UNSOLVED'
  report(`Solution 1${test ? ' (for test input)' : ''}:`, solution)
}

async function solveForSecondStar(input: string, inputAsArray: Array<any>, test: boolean) {
  const solution = 'UNSOLVED'
  report(`Solution 2${test ? ' (for test input)' : ''}:`, solution)
}
