import { read } from 'promise-path'
import { reportGenerator } from '../../util'

const report = reportGenerator(__filename)

export async function run(day: string) {
  const input = (await read(`solutions/${day}/input.txt`, 'utf8')).trim()

  const testInput =
    'abc\n' +
    '\n' +
    'a\n' +
    'b\n' +
    'c\n' +
    '\n' +
    'ab\n' +
    'ac\n' +
    '\n' +
    'a\n' +
    'a\n' +
    'a\n' +
    'a\n' +
    '\n' +
    'b'
  const testInputAsArray = testInput.split('\n')

  const inputAsArray = input.split('\n')

  await solveForFirstStar(testInput, testInputAsArray, true, true)
  await solveForFirstStar(input, inputAsArray, false, false)
  await solveForSecondStar(testInput, testInputAsArray, true, true)
  await solveForSecondStar(input, inputAsArray, false, false)
}

async function solveForFirstStar(
  input: string,
  inputAsArray: Array<any>,
  test: boolean,
  debug: boolean
) {
  const solution = input.split('\n\n').reduce((acc, group) => {
    return (
      acc +
      group.split('\n').reduce((groupAcc: string[], person) => {
        person.split('').forEach(q => {
          if (!groupAcc.includes(q)) {
            groupAcc.push(q)
          }
        })
        return groupAcc
      }, []).length
    )
  }, 0)
  report(`Solution 1${test ? ' (for test input)' : ''}:`, solution.toString())
}

async function solveForSecondStar(
  input: string,
  inputAsArray: Array<any>,
  test: boolean,
  debug: boolean
) {
  const solution = input.split('\n\n').reduce((acc, group) => {
    const people = group.split('\n')
    const qCounts = people.reduce(
      (groupAcc: { [key: string]: number }, person) => {
        person.split('').forEach(q => {
          if (!groupAcc[q]) {
            groupAcc[q] = 1
          } else {
            groupAcc[q] = groupAcc[q] + 1
          }
        })
        return groupAcc
      },
      {}
    )
    return (
      acc +
      Object.entries(qCounts).filter(([question, count]) => {
        return count === people.length
      }).length
    )
  }, 0)
  report(`Solution 1${test ? ' (for test input)' : ''}:`, solution.toString())
}
