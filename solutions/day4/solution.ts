import { read } from 'promise-path'
import { reportGenerator } from '../../util'

const report = reportGenerator(__filename)

export async function run(day: string) {
  const input = (
    await read(`solutions/${day}/input.txt`, 'utf8')
  ).trim()

  const testInput = 'ecl:gry pid:860033327 eyr:2020 hcl:#fffffd\n' +
    'byr:1937 iyr:2017 cid:147 hgt:183cm\n' +
    '\n' +
    'iyr:2013 ecl:amb cid:350 eyr:2023 pid:028048884\n' +
    'hcl:#cfa07d byr:1929\n' +
    '\n' +
    'hcl:#ae17e1 iyr:2013\n' +
    'eyr:2024\n' +
    'ecl:brn pid:760753108 byr:1931\n' +
    'hgt:179cm\n' +
    '\n' +
    'hcl:#cfa07d eyr:2025 pid:166559648\n' +
    'iyr:2011 ecl:brn hgt:59in'
  const testInputAsArray = testInput.split('\n')

  const inputAsArray = input.split('\n')

  const invalidPassports = 'eyr:1972 cid:100\n' +
    'hcl:#18171d ecl:amb hgt:170 pid:186cm iyr:2018 byr:1926\n' +
    '\n' +
    'iyr:2019\n' +
    'hcl:#602927 eyr:1967 hgt:170cm\n' +
    'ecl:grn pid:012533040 byr:1946\n' +
    '\n' +
    'hcl:dab227 iyr:2012\n' +
    'ecl:brn hgt:182cm pid:021572410 eyr:2020 byr:1992 cid:277\n' +
    '\n' +
    'hgt:59cm ecl:zzz\n' +
    'eyr:2038 hcl:74454a iyr:2023\n' +
    'pid:3556412378 byr:2007'

  const validPassports = 'pid:087499704 hgt:74in ecl:grn iyr:2012 eyr:2030 byr:1980\n' +
    'hcl:#623a2f\n' +
    '\n' +
    'eyr:2029 ecl:blu cid:129 byr:1989\n' +
    'iyr:2014 pid:896056539 hcl:#a97842 hgt:165cm\n' +
    '\n' +
    'hcl:#888785\n' +
    'hgt:164cm byr:2001 iyr:2015 cid:88\n' +
    'pid:545766238 ecl:hzl\n' +
    'eyr:2022\n' +
    '\n' +
    'iyr:2010 hgt:158cm hcl:#b6652a ecl:blu byr:1944 eyr:2021 pid:093154719'

  await solveForFirstStar(testInput, testInputAsArray, true)
  await solveForFirstStar(input, inputAsArray, false)
  await solveForSecondStar(validPassports, [], true, true)
  await solveForSecondStar(invalidPassports, [], true, true)
  await solveForSecondStar(input, inputAsArray, false, false)
}

function ensureValidKeys(input) {
  const requiredData = [
    'byr',
    'iyr',
    'eyr',
    'hgt',
    'hcl',
    'ecl',
    'pid'
  ]
  const passports = input.split('\n\n')
  // console.log({ passports: passports.length })
  return passports.filter(passport => {
    const passportData = passport.split(/[ \n]/).map(data => data.split(':')[0].trim())
    // console.log({ passportData })
    return requiredData.every(requirement => passportData.includes(requirement))
  }).length
}

async function solveForFirstStar(input: string, inputAsArray: Array<any>, test: boolean) {
  const solution = ensureValidKeys(input)
  report(`Solution 1${test ? ' (for test input)' : ''}:`, solution.toString())
}

async function solveForSecondStar(input: string, inputAsArray: Array<any>, test: boolean, debug: boolean) {
  const passports = input.split('\n\n')
  if (debug) {
    console.log({ passports: passports.length })
  }
  const solution = passports.filter(passport => {
    const passportData = passport.split(/[ \n]/)
    if (debug) {
      console.log({ passportData })
    }
    const includesEveryKey = ensureValidKeys(passport)
    const validData = passportData.every((passportKeyAndData, idx) => {
      const [passportKey, data] = passportKeyAndData.split(':')
      if (passportKey === 'byr') {
        const check = data.length === 4 && !isNaN(Number(data)) && Number(data) >= 1920 && Number(data) <= 2002
        if (!check && debug) {
          console.log(`invalid because of ${passportKey}:${data}`)
        }
        return check
      } else if (passportKey === 'iyr') {
        const check = data.length === 4 && !isNaN(Number(data)) && Number(data) >= 2010 && Number(data) <= 2020
        if (!check && debug) {
          console.log(`invalid because of ${passportKey}:${data}`)
        }
        return check
      } else if (passportKey === 'eyr') {
        const check = data.length === 4 && !isNaN(Number(data)) && Number(data) >= 2020 && Number(data) <= 2030
        if (!check && debug) {
          console.log(`invalid because of ${passportKey}:${data}`)
        }
        return check
      } else if (passportKey === 'hgt') {
        const check = (data.endsWith('cm') && Number(data.slice(0, 3)) >= 150 && Number(data.slice(0, 3)) <= 193) || (data.endsWith('in') && Number(data.slice(0, 2)) >= 59 && Number(data.slice(0, 2)) <= 76)
        if (!check && debug) {
          console.log(`invalid because of ${passportKey}:${data}`)
        }
        return check
      } else if (passportKey === 'hcl') {
        const matchingCharacters = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'a', 'b', 'c', 'd', 'e', 'f']
        const check = data.startsWith('#') && data.length === 7 && data.slice(1).split('').every(char => matchingCharacters.includes(char))
        if (!check && debug) {
          console.log(`invalid because of ${passportKey}:${data}`)
        }
        return check
      } else if (passportKey === 'ecl') {
        const eyeColors = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth']
        const check = eyeColors.includes(data)
        if (!check && debug) {
          console.log(`invalid because of ${passportKey}:${data}`)
        }
        return check
      } else if (passportKey === 'pid') {
        const check = data.length === 9 && !isNaN(Number(data))
        if (!check && debug) {
          console.log(`invalid because of ${passportKey}:${data}`)
        }
        return check
      } else if (passportKey === 'cid') {
        return true
      }
    })
    if (!includesEveryKey && debug) {
      console.log('does not include every key')
    }
    if (!validData && debug) {
      console.log('does not include valid data')
    }
    return includesEveryKey && validData
  }).length
  report(`Solution 2${test ? ' (for test input)' : ''}:`, solution.toString())
}
