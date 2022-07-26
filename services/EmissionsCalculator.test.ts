import 'jest'
import { CalculationType } from '../pages/api/calculate'

import * as EmissionsCalculator from './EmissionsCalculator'

describe('EmissionsCalculator', () => {
  let calculateFood: jest.SpyInstance
  let calculateTransportation: jest.SpyInstance
  beforeEach(() => {
    calculateFood = jest.spyOn(EmissionsCalculator, 'calculateFood')
    calculateTransportation = jest.spyOn(EmissionsCalculator, 'calculateTransportation')
  })
  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('calculate calls through to helper correctly', () => {
    type TestCase = { type: CalculationType, input: any, spy: keyof typeof EmissionsCalculator }
    const cases: TestCase[] = [
      { type: 'food', input: 42, spy: 'calculateFood' },
      { type: 'transportation', input: 42, spy: 'calculateTransportation' },
    ]

    // This is the more intuitive approach, but it doesn't work
    // because the mapping in `EmissionsCalculator.calculate` does not get spied on properly
    // Note that these tests are skipped to avoid failing
    const itShouldCallThroughCorrectly = (testCase: TestCase) => {
        const { type, input, spy } = testCase
        it.skip(`for type '${type}'`, () => {
          const spyInstance = jest.spyOn(EmissionsCalculator, spy)
          EmissionsCalculator.calculate(type, input)
          expect(spyInstance).toHaveBeenCalledWith(input)
      })
    }
    cases.forEach(testCase => itShouldCallThroughCorrectly(testCase))

    // So instead, we use a slightly hackier way to assert that it calls through correctly
    const itShouldReturnSameValue = (testCase: TestCase) => {
      const { type, input, spy } = testCase
        it(`for type '${type}'`, () => {
          const result1 = EmissionsCalculator.calculate(type, input)
          const result2 = (EmissionsCalculator[spy] as any).apply(input)
          expect(result1).toStrictEqual(result2)
      })
    }
    cases.forEach(testCase => itShouldReturnSameValue(testCase))
  })

  describe('calculateFood', () => {
    it('should return 9999', () => {
      const result = EmissionsCalculator.calculateFood(0)
      expect(result).toStrictEqual({ emissions: 9999 })
      expect(calculateFood).toHaveBeenCalled()
    })

  })

  describe('calculateTransportation', () => {
    it('should return 42', () => {
      const result = EmissionsCalculator.calculateTransportation(0)
      expect(result).toStrictEqual({ emissions: 42 })
      expect(calculateTransportation).toHaveBeenCalled()

    })
  })
})