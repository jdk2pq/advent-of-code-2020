import { read } from 'promise-path'
import { arrToNumberArr, reportGenerator } from '../../util'

const report = reportGenerator(__filename)

export async function run(day: string) {
  const input = (await read(`solutions/${day}/input.txt`, 'utf8')).trim()

  const testInput =
    'class: 1-3 or 5-7\n' +
    'row: 6-11 or 33-44\n' +
    'seat: 13-40 or 45-50\n' +
    '\n' +
    'your ticket:\n' +
    '7,1,14\n' +
    '\n' +
    'nearby tickets:\n' +
    '7,3,47\n' +
    '40,4,50\n' +
    '55,2,20\n' +
    '38,6,12'
  const testInputAsArray = testInput.split('\n')

  const testInput2 =
    'class: 0-1 or 4-19\n' +
    'row: 0-5 or 8-19\n' +
    'seat: 0-13 or 16-19\n' +
    '\n' +
    'your ticket:\n' +
    '11,12,13\n' +
    '\n' +
    'nearby tickets:\n' +
    '3,9,18\n' +
    '15,1,5\n' +
    '5,14,9'
  const testInputAsArray2 = testInput2.split('\n')

  const inputAsArray = input.split('\n')

  await solveForFirstStar(testInput, testInputAsArray, true, true)
  await solveForFirstStar(input, inputAsArray, false, false)
  await solveForSecondStar(testInput2, testInputAsArray2, true, true)
  await solveForSecondStar(input, inputAsArray, false, false)
}

function findInvalidTickets(input: string, debug: boolean, part) {
  const [rulesStr, myTicketStr, nearbyTicketsStr] = input.split('\n\n')
  const fieldAndRules = rulesStr.split('\n').map(line => line.split(': '))
  const nearbyTickets = nearbyTicketsStr
    .split('\n')
    .slice(1)
    .map(line => line.split(',').map(Number))
  const nearbyTicketsFlattened = nearbyTicketsStr
    .split('\n')
    .slice(1)
    .flatMap(line => line.split(',').map(Number))
  const enumeratedNumbers: number[] = fieldAndRules
    .flatMap(([field, rules]) => rules.split(' or '))
    .flatMap(range => {
      const [min, max] = range.split('-').map(Number)
      const ret: number[] = []
      for (let i = min; i <= max; i++) {
        ret.push(i)
      }
      return ret
    })

  const invalidTickets = nearbyTicketsFlattened
    .filter(num => !enumeratedNumbers.includes(num))
    .reduce((acc, v) => acc + v, 0)
  if (part === 1) {
    return invalidTickets
  } else {
    const validTickets = nearbyTickets.filter(num =>
      num.every(n => enumeratedNumbers.includes(n))
    )
    const fieldToEnumeratedPossibleNumbers = fieldAndRules.map(
      ([field, rules]) => {
        const enumeratedNumbers = rules.split(' or ').flatMap(range => {
          const [min, max] = range.split('-').map(Number)
          const ret: number[] = []
          for (let i = min; i <= max; i++) {
            ret.push(i)
          }
          return ret
        })
        return [field, enumeratedNumbers]
      }
    ) as [string, number[]][]

    const usedIndices: number[] = []
    const fieldColumnIndexToNumbers: number[][] = []
    if (debug) {
      console.log({ validTickets })
    }
    for (let i = 0; i < validTickets[0].length; i++) {
      fieldColumnIndexToNumbers[i] = validTickets.map(ticket => {
        return ticket[i]
      })
    }
    if (debug) {
      console.log({ fieldColumnIndexToNumbers })
    }
    const myTicket = arrToNumberArr(myTicketStr.split('\n')[1].split(','))

    // Probably don't need both of these, in hindsight after solving the problem,
    // but it was a quick way for me to look up which fields had already been figured out
    let indexToField: [number, string][] = []
    const fieldToIndexObj = {}

    while (usedIndices.length !== myTicket.length) {
      indexToField = fieldToEnumeratedPossibleNumbers.map(
        ([field, enumeratedNumbers]) => {
          // If we haven't figured out where that field is, try to figure it out.
          // Else, just return what we've already figured out
          if (fieldToIndexObj[field] === undefined) {
            if (debug) {
              console.log({ fieldColumnIndexToNumbers, enumeratedNumbers })
            }
            // Figure out which columns of numbers on the ticket are potentially valid
            const potentiallyValid = (fieldColumnIndexToNumbers.map(
              (numbers, idx) => {
                if (debug) {
                  console.log({ enumeratedNumbers, numbers })
                }

                if (
                  numbers.every(n => enumeratedNumbers.includes(n)) &&
                  !usedIndices.includes(idx)
                ) {
                  return idx
                }
              }
            ) as number[]).filter(n => n !== undefined)
            if (debug) {
              console.log({ potentiallyValid, usedIndices })
            }

            // If there's only one possibility, set it and move on to the next field
            if (potentiallyValid.length === 1) {
              // Make sure we don't try to reuse that index
              usedIndices.push(potentiallyValid[0])
              fieldToIndexObj[field] = potentiallyValid[0]
              return [potentiallyValid[0], field]
            }
          } else {
            return [fieldToIndexObj[field], field]
          }
        }
      ) as [number, string][]
    }

    if (debug) {
      console.log({
        indexToField,
        usedIndices,
        fieldToEnumeratedNumbers: fieldToEnumeratedPossibleNumbers
      })
    }

    const departureFields: [
      number,
      string
    ][] = indexToField.filter(([idx, field]) => field.includes('departure'))
    if (debug) {
      console.log({ departureFields })
    }

    let ret = 1
    for (let i = 0; i < departureFields.length; i++) {
      ret *= myTicket[departureFields[i][0]]
    }

    return ret
  }
}

async function solveForFirstStar(
  input: string,
  inputAsArray: Array<any>,
  test: boolean,
  debug: boolean
) {
  console.time('part 1')
  report(
    `Solution 1${test ? ' (for test input)' : ''}:`,
    findInvalidTickets(input, debug, 1).toString()
  )
  console.timeEnd('part 1')
}

async function solveForSecondStar(
  input: string,
  inputAsArray: Array<any>,
  test: boolean,
  debug: boolean
) {
  console.time('part 2')
  report(
    `Solution 2${test ? ' (for test input)' : ''}:`,
    findInvalidTickets(input, debug, 2).toString()
  )
  console.timeEnd('part 2')
}
