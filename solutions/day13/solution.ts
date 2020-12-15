import { read } from 'promise-path'
import { arrToNumberArr, reportGenerator, sortNumbers } from '../../util'

const report = reportGenerator(__filename)

export async function run(day: string) {
  const input = (await read(`solutions/${day}/input.txt`, 'utf8')).trim()

  const testInput = '939\n' + '7,13,x,x,59,x,31,19'
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
  console.time('part 1')
  const [start, rawTimeTables] = inputAsArray
  if (debug) {
    console.log({ start, rawTimeTables })
  }
  const timeTables = rawTimeTables
    .split(',')
    .filter(v => v !== 'x')
    .map(v => Number(v))
  if (debug) {
    console.log({ timeTables })
  }

  let closest = start
  let id = -1
  timeTables.forEach(v => {
    let val = 0

    while (val <= start) {
      val += v
    }
    if (Math.abs(val - start) <= closest) {
      closest = Math.abs(val - start)
      id = v
    }
  })

  if (debug) {
    console.log({ closest, id })
  }

  report(
    `Solution 1${test ? ' (for test input)' : ''}:`,
    (closest * id).toString()
  )
  console.timeEnd('part 1')
}

// borrowed from https://www.reddit.com/r/adventofcode/comments/kc4njx/2020_day_13_solutions/gfq2iz0/ because i hit the same issue
function absmod(a, n) {
  while (a < 0) {
    a += n
  }
  return a % n
}

async function solveForSecondStar(
  input: string,
  inputAsArray: Array<any>,
  test: boolean,
  debug: boolean
) {
  console.time('part 2')
  const modAndRemaindersTest = [
    { mod: 5, remainder: 4 },
    { mod: 4, remainder: 3 },
    { mod: 3, remainder: 0 }
  ]
  const modAndRemainders: { mod: number; remainder: number }[] = inputAsArray[1]
    .split(',')
    .map((n, i) => {
      if (n !== 'x') {
        return {
          mod: Number(n),
          remainder: absmod(Number(n) - i, Number(n)) % Number(n)
        }
      }
    })
    .filter(x => x !== undefined)
    .sort((mAndR1, mAndR2) => {
      return mAndR2.remainder - mAndR1.remainder
    })

  if (debug) {
    console.log({ modAndRemainders })
  }

  // Sieving with Chinese Remainder Theorem
  function run(modAndRemainders) {
    let value = modAndRemainders[0].remainder
    let addition = 0
    modAndRemainders.forEach(({ mod, remainder }, i) => {
      if (addition === 0) {
        addition = mod
      }
      if (debug) {
        console.log({ mod, remainder, addition })
      }

      const next = modAndRemainders[i + 1]
      while (next && value % next.mod !== next.remainder) {
        value += addition
        if (debug) {
          console.log({ addition, value })
        }
      }
      if (next) {
        addition = addition * next.mod
      }
      if (debug) {
        console.log({ value })
      }
    })

    return value
  }

  if (debug) {
    console.log(run(modAndRemaindersTest))
  }

  report(
    `Solution 2${test ? ' (for test input)' : ''}:`,
    run(modAndRemainders).toString()
  )
  console.timeEnd('part 2')
}
