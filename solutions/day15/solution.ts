import { read } from 'promise-path'
import { arrToNumberArr, reportGenerator, sortNumbers } from '../../util'

const report = reportGenerator(__filename)

export async function run(day: string) {
  const input = (await read(`solutions/${day}/input.txt`, 'utf8')).trim()

  const testInput = '0,3,6'
  const testInput2 = '1,3,2'
  const testInput3 = '2,1,3'
  const testInput4 = '1,2,3'
  const testInput5 = '2,3,1'
  const testInput6 = '3,2,1'
  const testInput7 = '3,1,2'

  await solveForFirstStar(testInput, true, true)
  await solveForFirstStar(testInput2, true, true)
  await solveForFirstStar(testInput3, true, true)
  await solveForFirstStar(testInput4, true, true)
  await solveForFirstStar(testInput5, true, true)
  await solveForFirstStar(testInput6, true, true)
  await solveForFirstStar(testInput7, true, true)
  await solveForFirstStar(input, false, false)

  // await solveForSecondStar(testInput, true, true)
  // await solveForSecondStar(testInput2, true, true)
  // await solveForSecondStar(testInput3, true, true)
  // await solveForSecondStar(testInput4, true, true)
  // await solveForSecondStar(testInput5, true, true)
  // await solveForSecondStar(testInput6, true, true)
  // await solveForSecondStar(testInput7, true, true)
  // await solveForSecondStar(testInput, true, true)
  await solveForSecondStar(input, false, false)
}

// My first implementation used arrays and objects and finished, but it took about 6 minutes to
// run part 2. Still got the right answer though!

// My second implementation is here and is _after_ I looked at the reddit threads for how to
// run things more efficiently. I figured using objects would be as efficient as a Map, but it
// turns out that's not the case. This finishes in about 10 seconds...
function playGame(input: number[], debug: boolean, max: number) {
  let lastNumberSpoken = -1
  const timesSpoken: Map<number, { last: number, beforeLast: number, times: number }> = new Map()
  for (let i = 0; i < max; i++) {
    const turn = i + 1
    let number
    if (i < input.length) {
      number = input[i]
    } else {
      const value = timesSpoken.get(lastNumberSpoken) as { last: number, beforeLast: number, times: number }

      if (value.times === 1) {
        number = 0
      } else {
        number = value.last - value.beforeLast
      }
    }
    if (!timesSpoken.has(number)) {
      timesSpoken.set(number, {
        last: turn,
        beforeLast: 0,
        times: 1
      })
    } else {
      const value= timesSpoken.get(number) as { last: number, beforeLast: number, times: number }

      timesSpoken.set(number, {
        beforeLast: value.last,
        last: turn,
        times: value.times + 1
      })
    }
    lastNumberSpoken = number
  }

  if (debug) {
    // console.log({ turns: turns.join(', ') })
    // console.log({ timesSpoken })
  }

  return lastNumberSpoken
}

// Third implementation that's even simpler and finishes in about half the time
// (5s) for party 2 and cuts out unnecessary data.
function playGameSimpler(input: number[], debug: boolean, max: number) {
  const spokenWhen: Map<number, number> = new Map()
  let lastNumberSpoken = 0
  for (let i = 0; i < max; i++) {
    const turn = i + 1
    if (i < input.length) {
      lastNumberSpoken = input[i]
      spokenWhen.set(lastNumberSpoken, turn)
    } else if (!spokenWhen.has(lastNumberSpoken)) {
      spokenWhen.set(lastNumberSpoken, i)
      lastNumberSpoken = 0
    } else {
      const value = spokenWhen.get(lastNumberSpoken) as number
      spokenWhen.set(lastNumberSpoken, i)
      lastNumberSpoken = i - value
    }
  }

  return lastNumberSpoken
}

function solve(input, limit) {
  let indexes: Map<number, number> = new Map(input.map((value, index) => [value, index + 1]));
  let bucket = NaN;
  let target = input[input.length - 1];
  for (let index = input.length; index < limit; index++) {
    target = (indexes.has(target) ? index - (indexes.get(target) as number) : 0);
    indexes.set(bucket, index);
    bucket = target;
  }
  return target;
}

async function solveForFirstStar(
  input: string,
  test: boolean,
  debug: boolean
) {
  console.time('part 1')
  const solution = 'UNSOLVED'
  report(`Solution 1${test ? ' (for test input)' : ''}:`, playGame(input.split(',').map(Number), debug, 2020).toString())
  console.timeEnd('part 1')
}

async function solveForSecondStar(
  input: string,
  test: boolean,
  debug: boolean
) {
  console.time('part 2')
  const solution = 'UNSOLVED'
  report(`Solution 2${test ? ' (for test input)' : ''}:`, playGameSimpler(input.split(',').map(Number), false, 30000000).toString())
  console.timeEnd('part 2')
}
