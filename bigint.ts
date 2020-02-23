
export type RoundMethod =
  | 'plus'
  | 'minus'
  | 'halfPlus'
  | 'halfMinus'
  | 'toZero'
  | 'fromZero'
  | 'halfToZero'
  | 'halfFromZero'

const roundings: {
  [key in RoundMethod]: (
    digit: number,
    half: boolean,
    negative: boolean
  ) => -1 | 0 | 1
} = {
  plus: (digit, half, negative) => (!negative ? 1 : 0),
  minus: (digit, half, negative) => (negative ? -1 : 0),
  halfPlus: (digit, half, negative) =>
    negative ? (digit >= 5 && !half ? -1 : 0) : digit >= 5 ? 1 : 0,
  halfMinus: (digit, half, negative) =>
    negative ? (digit >= 5 ? -1 : 0) : digit >= 5 && !half ? 1 : 0,
  toZero: (digit, half, negative) => 0,
  fromZero: (digit, half, negative) => (negative ? -1 : 1),
  halfToZero: (digit, half, negative) =>
    negative ? (digit >= 5 && !half ? -1 : 0) : digit >= 5 && !half ? 1 : 0,
  halfFromZero: (digit, half, negative) =>
    negative ? (digit >= 5 || half ? -1 : 0) : digit >= 5 || half ? 1 : 0
}

export const abs = (x: bigint): bigint => (x < 0 ? -x : x)

export const mod = (x: bigint, y: bigint): bigint => x % y

export const divide = (
  a: bigint,
  divider: bigint,
  method: RoundMethod = 'toZero'
): bigint => {
  let division: bigint = a / divider
  const remainder = abs(mod(a, divider))
  if (remainder) {
    const doubleRemainder = BigInt(2) * remainder
    const firstHalf = doubleRemainder < abs(divider)
    const secondHalf = doubleRemainder > abs(divider)
    const roundAddition = roundings[method](
      firstHalf ? 3 : secondHalf ? 7 : 5,
      doubleRemainder === abs(divider),
      division < 0
    )
    division = division + BigInt(roundAddition)
  }
  return division
}

export const e = (
  n: bigint,
  exponent: number,
  method: RoundMethod = 'toZero'
): bigint =>
  exponent < 0
    ? divide(n, BigInt(10) ** BigInt(-exponent), method)
    : n * BigInt(10) ** BigInt(exponent)

export const gcd = (a: bigint, b: bigint): bigint =>
  b ? gcd(b, mod(a, b)) : a < 0 ? -a : a
