import { read } from 'promise-path'
import { reportGenerator } from '../../util'

const report = reportGenerator(__filename)

export async function run(day: string) {
  const input = (
    await read(`solutions/${day}/input.txt`, 'utf8')
  ).trim()

  const inputAsArray = input.split('\n')

  await solveForFirstStar(input, inputAsArray)
  await solveForSecondStar(input, inputAsArray)
}

async function solveForFirstStar(input: string, inputAsArray: Array<string>) {
  const filtered = inputAsArray.filter(policy => {
    const [range, letterWithColon, password] = policy.split(' ')
    const [lower, upper] = range.split('-').map(v => Number(v))
    const letter = letterWithColon[0]
    const letterCount = password.split('').reduce((acc: {[key: string]: number}, character) => {
      if (!acc[character]) {
        acc[character] = 1
      } else {
        acc[character] = acc[character] + 1
      }
      return acc
    }, {})
    return letterCount[letter] && letterCount[letter] >= lower && letterCount[letter] <= upper
  })
  report('Solution 1:', filtered.length.toString())
}

async function solveForSecondStar(input: string, inputAsArray: Array<string>) {
  const filtered = inputAsArray.filter(policy => {
    const [range, letterWithColon, password] = policy.split(' ')
    const [lower, upper] = range.split('-').map(v => Number(v))
    const letter = letterWithColon[0]
    const split = password.split('')
    return (split[lower - 1] === letter && split[upper - 1] !== letter) || (split[lower - 1] !== letter && split[upper - 1] === letter)
  })
  report('Solution 2:', filtered.length.toString())
}
