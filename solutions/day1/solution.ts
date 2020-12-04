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

async function solveForFirstStar(input: string, inputAsArray: Array<any>) {
  let i: number, j: number
  for (i = 0; i < inputAsArray.length; i++) {
    for (j = 0; j < inputAsArray.length; j++) {
      if (Number(inputAsArray[i]) + Number(inputAsArray[j]) === 2020) {
        console.log(`Found: ${inputAsArray[i]} and ${inputAsArray[j]}`)
        return report('Solution 1:', (+inputAsArray[i] * +inputAsArray[j]).toString())
      }
    }
  }
}

async function solveForSecondStar(input: string, inputAsArray: Array<any>) {
  let i: number, j: number, k: number
  for (i = 0; i < inputAsArray.length; i++) {
    for (j = 0; j < inputAsArray.length; j++) {
      for (k = 0; k < inputAsArray.length; k++) {
        if (Number(inputAsArray[i]) + Number(inputAsArray[j]) + Number(inputAsArray[k]) === 2020) {
          console.log(`Found: ${inputAsArray[i]}, ${inputAsArray[j]}, and ${inputAsArray[k]}`)
          return report('Solution 1:', (+inputAsArray[i] * +inputAsArray[j] * +inputAsArray[k]).toString())
        }
      }
    }
  }
}
