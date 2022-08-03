import { createMocks } from 'node-mocks-http'

import handler from '../../../pages/api/calculate'
import * as EmissionsCalculator from '../../../lib/services/EmissionsCalculator'

describe('calculate API', () => {
  let calculateSpy: jest.SpyInstance
  beforeEach(() => {
    calculateSpy = jest.spyOn(EmissionsCalculator, 'calculate')
      .mockImplementation(() => ({ emissions: 42 }))
  })
  afterEach(() => {
    jest.restoreAllMocks()
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getDataFromResponse = (res: any) => JSON.parse(res._getData()) // https://seanconnolly.dev/unit-testing-nextjs-api-routes

  describe('validation', () => {
    const zodCases = [
      { title: 'POST with no body', body: undefined },
      { title: 'POST with empty body', body: {} },
      { title: 'unrecognized calculationType', body: { calculations: { beverage: { water: 400 } } } },
      { title: 'recognized calculationType but missing required param', body: { calculations: { food: { bread: 400 } } } },
      { title: 'recognized calculationType but not wrapped in calculations', body: { food: { bread: 400, meat: 400, vegetables: 400 } } },
    ]
    zodCases.forEach(({ title, body }) => it(`400 when ${title}`, async () => {
      const { req, res } = createMocks({ method: 'POST', body })
      await handler(req, res)

      expect(res.statusCode).toBe(400)
    }))

    it('405 when method !== POST', async () => {
      const { req, res } = createMocks({ method: 'GET' })
      await handler(req, res)

      expect(res.statusCode).toBe(405)
    })
  })

  it('200 for single calculation type', async () => {
    const body = {
      calculations: {
        food: { bread: 0, meat: 0, vegetables: 0 }
      }
    }
    const { req, res } = createMocks({ method: 'POST', body })
    await handler(req, res)

    expect(res.statusCode).toBe(200)
    expect(calculateSpy).toHaveBeenCalledTimes(1)
    expect(calculateSpy).toHaveBeenCalledWith({ ctype: 'food', ...body.calculations.food })
    expect(getDataFromResponse(res)).toStrictEqual({ calculation: {
      food: { emissions: 42 }
    } })
  })

  it('200 for batched calculation types', async () => {
    const body = {
      calculations: {
        food: { bread: 0, meat: 0, vegetables: 0 },
        transportation: { bus: 0, car: 0, plane: 0 }
      }
    }
    const { req, res } = createMocks({ method: 'POST', body })
    await handler(req, res)

    expect(res.statusCode).toBe(200)
    expect(calculateSpy).toHaveBeenCalledTimes(2)
    expect(calculateSpy).toHaveBeenCalledWith({ ctype: 'food', ...body.calculations.food })
    expect(calculateSpy).toHaveBeenCalledWith({ ctype: 'transportation', ...body.calculations.transportation })
    expect(getDataFromResponse(res)).toStrictEqual({ calculation: {
      food: { emissions: 42 },
      transportation: { emissions: 42 }
    } })
  })
})