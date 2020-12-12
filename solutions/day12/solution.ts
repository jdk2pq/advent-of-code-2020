import { read } from 'promise-path'
import { arrToNumberArr, reportGenerator, sortNumbers } from '../../util'

const report = reportGenerator(__filename)

export async function run(day: string) {
  const input = (await read(`solutions/${day}/input.txt`, 'utf8')).trim()

  const testInput = 'F10\n' + 'N3\n' + 'F7\n' + 'R90\n' + 'F11'
  const testInputAsArray = testInput.split('\n')
  const testInput2 =
    'S1\n' +
    'R270\n' +
    'S5\n' +
    'W2\n' +
    'F63\n' +
    'S3\n' +
    'L90\n' +
    'W4\n' +
    'F59\n' +
    'S1'
  const testInputAsArray2 = testInput2.split('\n')

  const inputAsArray = input.split('\n')

  await solveForFirstStar(testInput, testInputAsArray, true, true)
  await solveForFirstStar(testInput2, testInputAsArray2, true, true)
  await solveForFirstStar(input, inputAsArray, false, false)
  await solveForSecondStar(testInput, testInputAsArray, true, true)
  await solveForSecondStar(input, inputAsArray, false, false)
}

function navigateShip(input: string[], debug: boolean): number {
  let degrees = 90
  let dir = [0, 0]
  input.forEach(move => {
    const action = move.charAt(0)
    const value = Number(move.slice(1))

    if (action === 'N') {
      dir[0] += value
    } else if (action === 'S') {
      dir[0] -= value
    } else if (action === 'E') {
      dir[1] += value
    } else if (action === 'W') {
      dir[1] -= value
    } else if (action === 'L') {
      degrees = degrees - value
      if (degrees < 0) {
        degrees += 360
      }
    } else if (action === 'R') {
      degrees += value
      if (degrees > 360) {
        degrees += 360
      }
    } else if (action === 'F') {
      const mod = Math.abs(degrees) % 360
      if (debug) {
        console.log({ mod })
      }
      if (mod === 90) {
        dir[1] += value
      } else if (mod === 180) {
        dir[0] -= value
      } else if (mod === 270) {
        dir[1] -= value
      } else if (mod === 0) {
        dir[0] += value
      }
    }
    if (debug) {
      console.log({ action, value, degrees, dir })
    }
  })
  return Math.abs(dir[0]) + Math.abs(dir[1])
}

function navigateWaypoint(input: string[], debug: boolean): number {
  let dir = [0, 0]
  let waypointDir = [1, 10]
  input.forEach(move => {
    const action = move.charAt(0)
    const value = Number(move.slice(1))

    if (action === 'N') {
      waypointDir[0] += value
    } else if (action === 'S') {
      waypointDir[0] -= value
    } else if (action === 'E') {
      waypointDir[1] += value
    } else if (action === 'W') {
      waypointDir[1] -= value
    } else if (action === 'L') {
      let rotations = value / 90
      for (let i = 0; i < rotations; i++) {
        const newWaypointDir: number[] = []
        if (waypointDir[0] >= 0) {
          newWaypointDir[1] = -waypointDir[0]
        } else {
          newWaypointDir[1] = Math.abs(waypointDir[0])
        }
        newWaypointDir[0] = waypointDir[1]
        waypointDir = newWaypointDir
      }
    } else if (action === 'R') {
      let rotations = value / 90
      for (let i = 0; i < rotations; i++) {
        const newWaypointDir: number[] = []

        if (waypointDir[1] >= 0) {
          newWaypointDir[0] = -waypointDir[1]
        } else {
          newWaypointDir[0] = Math.abs(waypointDir[1])
        }
        newWaypointDir[1] = waypointDir[0]
        waypointDir = newWaypointDir
      }
    } else if (action === 'F') {
      dir[0] += waypointDir[0] * value
      dir[1] += waypointDir[1] * value
    }
    if (debug) {
      console.log({ action, value, dir, waypointDir })
    }
  })
  return Math.abs(dir[0]) + Math.abs(dir[1])
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
    navigateShip(inputAsArray as string[], debug).toString()
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
    navigateWaypoint(inputAsArray as string[], debug).toString()
  )
  console.timeEnd('part 2')
}
