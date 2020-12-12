import { read } from 'promise-path'
import { reportGenerator } from '../../util'

const report = reportGenerator(__filename)

export async function run(day: string) {
  const input = (await read(`solutions/${day}/input.txt`, 'utf8')).trim()

  const testInput =
    'light red bags contain 1 bright white bag, 2 muted yellow bags.\n' +
    'dark orange bags contain 3 bright white bags, 4 muted yellow bags.\n' +
    'bright white bags contain 1 shiny gold bag.\n' +
    'muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.\n' +
    'shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.\n' +
    'dark olive bags contain 3 faded blue bags, 4 dotted black bags.\n' +
    'vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.\n' +
    'faded blue bags contain no other bags.\n' +
    'dotted black bags contain no other bags.'
  const testInputAsArray = testInput.split('\n')

  const testInput2 =
    'shiny gold bags contain 2 dark red bags.\n' +
    'dark red bags contain 2 dark orange bags.\n' +
    'dark orange bags contain 2 dark yellow bags.\n' +
    'dark yellow bags contain 2 dark green bags.\n' +
    'dark green bags contain 2 dark blue bags.\n' +
    'dark blue bags contain 2 dark violet bags.\n' +
    'dark violet bags contain no other bags.'
  const testInputAsArray2 = testInput2.split('\n')

  const inputAsArray = input.split('\n')

  await solveForFirstStar(testInput, testInputAsArray, true, true)
  await solveForFirstStar(input, inputAsArray, false, false)
  await solveForSecondStar(testInput, testInputAsArray, true, true)
  await solveForSecondStar(testInput2, testInputAsArray2, true, true)
  await solveForSecondStar(input, inputAsArray, false, false)
}

function getBagCombos(
  inputAsArray: Array<any>
): { [key: string]: { [key: string]: number } } {
  return inputAsArray.reduce((acc, line) => {
    let [container, ...contains] = line.split(/ contain |, /)
    container = container.split(' bags')[0].trim()
    const objContains: { [key: string]: number } = contains.reduce((acc, c) => {
      let color = c
        .split(/bag|bags/)[0]
        .split(' ')
        .slice(1)
        .join(' ')
        .trim()
      let amount = isNaN(Number(c.split(' ')[0])) ? 0 : Number(c.split(' ')[0])
      acc[color] = amount
      return acc
    }, {})

    if (!acc[container]) {
      acc[container] = objContains
    } else {
      acc[container] = {
        ...acc[container],
        ...objContains
      }
    }
    return acc
  }, {})
}

async function solveForFirstStar(
  input: string,
  inputAsArray: Array<any>,
  test: boolean,
  debug: boolean
) {
  const search = 'shiny gold'
  const available: string[] = []
  let startingSize = -1
  const bagCombos = getBagCombos(inputAsArray)

  while (startingSize < available.length) {
    startingSize = available.length
    Object.entries(bagCombos).forEach(([key, combo]) => {
      const searches = [...available, search]
      if (debug) {
        console.log({ key, combo, searches })
      }

      searches.forEach(s => {
        if (combo[s] && !available.includes(key)) {
          available.push(key)
        }
      })
    })
  }

  report(
    `Solution 1${test ? ' (for test input)' : ''}:`,
    available.length.toString()
  )
}

async function solveForSecondStar(
  input: string,
  inputAsArray: Array<any>,
  test: boolean,
  debug: boolean
) {
  const search = 'shiny gold'
  let solution = 0
  const bagCombos = getBagCombos(inputAsArray)
  const toCheck: string[] = [search]

  while (toCheck.length > 0) {
    const bag = toCheck.pop()
    if (bag) {
      if (bagCombos[bag] && Object.entries(bagCombos[bag]).length) {
        Object.entries(bagCombos[bag]).forEach(([bag, amount]) => {
          if (debug) {
            console.log(`for a ${bag}, we need ${amount} ${bag} bag(s)`)
          }
          for (let i = 0; i < amount; i++) {
            toCheck.push(bag)
          }
          if (debug) {
            console.log(`adding ${amount} ${bag} bags`)
          }
          solution += amount
        })
      }
    }
  }
  report(`Solution 2${test ? ' (for test input)' : ''}:`, solution.toString())
}
