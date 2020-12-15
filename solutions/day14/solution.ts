import { read } from 'promise-path'
import { reportGenerator } from '../../util'

const report = reportGenerator(__filename)

export async function run(day: string) {
  const input = (await read(`solutions/${day}/input.txt`, 'utf8')).trim()

  const testInput = 'mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X\n' +
    'mem[8] = 11\n' +
    'mem[7] = 101\n' +
    'mem[8] = 0'
  const testInputAsArray = testInput.split('\n')

  const testInput2 = 'mask = 000000000000000000000000000000X1001X\n' +
    'mem[42] = 100\n' +
    'mask = 00000000000000000000000000000000X0XX\n' +
    'mem[26] = 1'
  const testInput2AsArray = testInput2.split('\n')

  const inputAsArray = input.split('\n')

  await solveForFirstStar(testInput, testInputAsArray, true, true)
  await solveForFirstStar(input, inputAsArray, false, false)
  await solveForSecondStar(testInput2, testInput2AsArray, true, true)
  await solveForSecondStar(input, inputAsArray, false, false)
}

function solve(input: string[], debug) {
  const memory: number[] = []
  let mask
  input.forEach(line => {
    if (line.startsWith('mask = ')) {
      mask = line.split('mask = ')[1]
      if (debug) {
        console.log(`mask is now ${mask}`)
      }
    } else {
      const [mem, strValue] = line.split(' = ')
      const memLocation = Number(mem.split('[')[1].split(']')[0])
      const value = Number(strValue)
      let valueAsBinary = (value >>> 0).toString(2)
      if (valueAsBinary.length < 36) {
        valueAsBinary = `${[...new Array(36 - valueAsBinary.length)].map(() => '0').join('')}${valueAsBinary}`
      }
      if (debug) {
        console.log({ valueAsBinary })
      }
      let afterMask = ''
      for (let i = 0; i < valueAsBinary.length; i++) {
        if (mask[i] !== 'X') {
          afterMask = `${afterMask}${Number(mask[i])}`
        } else {
          afterMask = `${afterMask}${valueAsBinary.charAt(i)}`
        }
      }
      if (debug) {
        console.log({ afterMask })
        console.log(`writing ${parseInt(afterMask, 2)} to memory location ${memLocation}`)
      }
      memory[memLocation] = parseInt(afterMask, 2)
    }
  })

  if (debug) {
    console.log(memory)
  }

  return memory.reduce((acc, v) => acc + v, 0)
}

/**
 * This isn't the fastest implementation (completes in about 8 seconds with the
 * given input.txt), but it works!
 *
 * Had to make a change where instead of reducing the array at the end, like in
 * the above, I added as I found the different combinations of memory locations
 * because otherwise, it was a GIANT array to reduce with something like 44
 * billion indices.
 * @param input
 * @param debug
 */
function solve2(input: string[], debug) {
  const memory: number[] = []
  let mask

  function getAllCombinations(str): Array<string> {
    const fn = function(active, rest, a: Set<string>): Array<string> {
      if (!active && !rest) {
        return [];
      }
      if (!rest) {
        a.add(active)
      } else {
        if (rest[0] === 'X') {
          fn(active + '1', rest.slice(1), a);
          fn(active + '0', rest.slice(1), a);
        } else {
          fn(active + rest[0], rest.slice(1), a);
        }
      }
      return Array.from(a);
    }
    return fn('', str, new Set());
  }

  let solution = 0

  input.forEach(line => {
    if (line.startsWith('mask = ')) {
      mask = line.split('mask = ')[1]
      if (debug) {
        console.log(`mask is now ${mask}`)
      }
    } else {
      const [mem, strValue] = line.split(' = ')
      const memLocation = Number(mem.split('[')[1].split(']')[0])
      const value = Number(strValue)
      let memLocationAsBinary = (memLocation >>> 0).toString(2)
      if (memLocationAsBinary.length < 36) {
        memLocationAsBinary = `${[...new Array(36 - memLocationAsBinary.length)].map(() => '0').join('')}${memLocationAsBinary}`
      }
      if (debug) {
        console.log({ memLocationAsBinary })
      }
      let afterMask = ''
      for (let i = 0; i < memLocationAsBinary.length; i++) {
        if (mask[i] === 'X' || mask[i] === '1') {
          afterMask = `${afterMask}${mask[i]}`
        } else {
          afterMask = `${afterMask}${memLocationAsBinary.charAt(i)}`
        }
      }
      if (debug) {
        console.log({ afterMask })
      }

      const [beginning, ...changeablePortionArr] = afterMask.split('X')
      const changeablePortionStr = `X${changeablePortionArr.join('X')}`

      const combinations = getAllCombinations(changeablePortionStr).map((v) => `${beginning}${v}`)
      if (debug) {
        console.log({ length: combinations.length })
      }

      combinations.forEach((binaryMemLocation) => {
        const decMemLocation = parseInt(binaryMemLocation, 2)
        if (debug) {
          console.log(`writing ${value} to memory location ${decMemLocation}`)
        }
        if (memory[decMemLocation]) {
          solution -= memory[decMemLocation]
        }
        solution += value
        memory[decMemLocation] = value
      })
    }
  })

  return solution
}

async function solveForFirstStar(
  input: string,
  inputAsArray: Array<any>,
  test: boolean,
  debug: boolean
) {
  console.time('part 1')
  report(`Solution 1${test ? ' (for test input)' : ''}:`, solve(inputAsArray as string[], debug).toString())
  console.timeEnd('part 1')
}

async function solveForSecondStar(
  input: string,
  inputAsArray: Array<any>,
  test: boolean,
  debug: boolean
) {
  console.time('part 2')
  report(`Solution 2${test ? ' (for test input)' : ''}:`, solve2(inputAsArray as string[], debug).toString())
  console.timeEnd('part 2')
}
