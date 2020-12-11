import { read } from 'promise-path'
import { arrToNumberArr, reportGenerator, sortNumbers } from '../../util'

const report = reportGenerator(__filename)

export async function run(day: string) {
  const input = (
    await read(`solutions/${day}/input.txt`, 'utf8')
  ).trim()

  const testInput = '16\n' +
    '10\n' +
    '15\n' +
    '5\n' +
    '1\n' +
    '11\n' +
    '7\n' +
    '19\n' +
    '6\n' +
    '12\n' +
    '4'
  const testInputAsArray = testInput.split('\n')

  const testInput2 = '28\n' +
    '33\n' +
    '18\n' +
    '42\n' +
    '31\n' +
    '14\n' +
    '46\n' +
    '20\n' +
    '48\n' +
    '47\n' +
    '24\n' +
    '23\n' +
    '49\n' +
    '45\n' +
    '19\n' +
    '38\n' +
    '39\n' +
    '11\n' +
    '1\n' +
    '32\n' +
    '25\n' +
    '35\n' +
    '8\n' +
    '17\n' +
    '7\n' +
    '9\n' +
    '4\n' +
    '2\n' +
    '34\n' +
    '10\n' +
    '3'
  const testInputAsArray2 = testInput2.split('\n')

  const inputAsArray = input.split('\n')

  await solveForFirstStar(testInput, testInputAsArray, true, true)
  await solveForFirstStar(testInput2, testInputAsArray2, true, true)

  await solveForFirstStar(input, inputAsArray, false, false)
  await solveForSecondStar(testInput, testInputAsArray, true, true)
  await solveForSecondStar(testInput2, testInputAsArray2, true, true)
  await solveForSecondStar(input, inputAsArray, false, false)
}

async function solveForFirstStar(input: string, inputAsArray: Array<any>, test: boolean, debug: boolean) {
  let oneJoltDiff = 0
  let threeJoltDiff = 1 // because device is always +3 jolts higher
  let startingJoltage = 0
  const sorted = sortNumbers(arrToNumberArr(inputAsArray))
  if (debug) {
    console.log(sorted)
  }
  for (let i = 0; i < sorted.length; i++) {
    const diff = Math.abs(sorted[i] - startingJoltage)
    if (diff <= 3) {
      startingJoltage = sorted[i]
      if (diff === 1) {
        oneJoltDiff++
      } else if (diff === 3) {
        threeJoltDiff++
      }
    }
  }
  report(`Solution 1${test ? ' (for test input)' : ''}:`, (oneJoltDiff * threeJoltDiff).toString())
}

async function solveForSecondStar(input: string, inputAsArray: Array<any>, test: boolean, debug: boolean) {
  console.time('part 2')
  const sort = sortNumbers(arrToNumberArr(inputAsArray))
  const sorted = [0, ...sort, sort[sort.length - 1] + 3]
  if (debug) {
    console.log(sorted)
  }
  // From another solution found on reddit
  //
  // let combinations = sort.reduce((acc, num) => {
  //   acc[num] = (acc[num - 3] || 0) + (acc[num - 2] || 0) + (acc[num - 1] || 0)
  //   return acc
  // }, [1])

  const storage: number[] = []
  function run(i: number) {
    let arrangements = 0

    if (i === sorted.length - 1) {
      return 1
    } else if (storage[i]) {
      return storage[i]
    } else {
      for (let j = i + 1; j < i + 4; j++) {
        if (sorted[j] - sorted[i] <= 3) {
          arrangements += run(j)
        }
      }
      storage[i] = arrangements
      return arrangements
    }
  }

  if (debug) {
    console.log({ storage })
  }

  report(`Solution 2${test ? ' (for test input)' : ''}:`, (run(0)).toString())
  console.timeEnd('part 2')
}
