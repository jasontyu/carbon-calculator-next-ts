import 'jest'
import * as EmissionsCalculator from './EmissionsCalculator'

describe('EmissionsCalculator', () => {

  describe('`calculate` calls through to helper and matches snapshot', () => {
    type TestCase = { input: EmissionsCalculator.CalculationInput, helper: keyof typeof EmissionsCalculator }
    const cases: TestCase[] = [
      { input: { ctype: 'food', bread: 100, meat: 200, vegetables: 300 }, helper: 'calculateFood' },
      { input: { ctype: 'transportation', bus: 100, car: 200, plane: 300 }, helper: 'calculateTransportation' },
    ]

    // This is the more intuitive approach, but it doesn't work
    // because the mapping in `EmissionsCalculator.calculate` does not get spied on properly
    // const itShouldCallThroughCorrectly = (testCase: TestCase) => {
    //     const { input, spy } = testCase
    //     it(`for type '${input.ctype}'`, () => {
    //     const { ctype, ...data } = input
    //       const spyInstance = jest.spyOn(EmissionsCalculator, spy)
    //       EmissionsCalculator.calculate(input)
    //       expect(spyInstance).toHaveBeenCalledWith(data)
    //   })
    // }
    // cases.forEach(testCase => itShouldCallThroughCorrectly(testCase))

    // So instead, we use a slightly hackier way to assert that it calls through correctly
    const itShouldCallThroughAndMatchSnapshot = (testCase: TestCase) => {
      const { input, helper } = testCase
      it(`for type '${input.ctype}'`, () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { ctype, ...data } = input
        const result1 = EmissionsCalculator.calculate(input)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result2 = (EmissionsCalculator[helper] as any)(data)
        expect(result1).toStrictEqual(result2)
        expect(result1).toMatchSnapshot()
      })
    }
    cases.forEach(testCase => itShouldCallThroughAndMatchSnapshot(testCase))
  })
})