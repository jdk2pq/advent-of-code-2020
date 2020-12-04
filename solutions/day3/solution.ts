import { read } from 'promise-path'
import { reportGenerator } from '../../util'

const report = reportGenerator(__filename)

export async function run(day: string) {
  const input = (
    await read(`solutions/${day}/input.txt`, 'utf8')
  ).trim()

  const testInput = '..##.......\n' +
    '#...#...#..\n' +
    '.#....#..#.\n' +
    '..#.#...#.#\n' +
    '.#...##..#.\n' +
    '..#.##.....\n' +
    '.#.#.#....#\n' +
    '.#........#\n' +
    '#.##...#...\n' +
    '#...##....#\n' +
    '.#..#...#.#'
  
  const inputAsArray = input.split('\n')
  const testInputAsArray = testInput.split('\n')

  await solveForFirstStar(testInput, testInputAsArray, true)
  await solveForFirstStar(input, inputAsArray, false)
  await solveForSecondStar(testInput, testInputAsArray, true)
  await solveForSecondStar(input, inputAsArray, false)
}

function figureOutTreesFromSlope(right: number, down: number, input: Array<string>): number {
  let count = 0
  let i = 0, j = 0
  while (i < input.length) {
    if (input[i % input.length].charAt(j % input[0].length) === '#') {
      // console.log({ i, j })
      count++
    }
    i += down
    j += right
  }
  return count
}

async function solveForFirstStar(input: string, inputAsArray: Array<any>, test: boolean) {
  report(`Solution ${test ? 'for test input' : '1'}:`, figureOutTreesFromSlope(3, 1, inputAsArray).toString())
}

async function solveForSecondStar(input: string, inputAsArray: Array<any>, test: boolean) {
  const one = figureOutTreesFromSlope(1, 1, inputAsArray)
  const two = figureOutTreesFromSlope(3, 1, inputAsArray)
  const three = figureOutTreesFromSlope(5, 1, inputAsArray)
  const four = figureOutTreesFromSlope(7, 1, inputAsArray)
  const five = figureOutTreesFromSlope(1, 2, inputAsArray)
  report(`Solution ${test ? 'for test input' : '2'}:`, (one * two * three * four * five).toString())
}
