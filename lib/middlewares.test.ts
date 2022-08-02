import { createMocks } from 'node-mocks-http'
import { z } from 'zod'
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { withValidationHandled } from './middlewares'

describe('middlewares', () => {
  describe('withValidationHandled', () => {
    const zodHandler: NextApiHandler = (req, res) => {
      const schema = z.object({ throwError: z.boolean() })
      const parsed = schema.parse(req.body)

      if (parsed.throwError) {
        throw 'generic error'
      }

      return res.status(200)
    }
    const handler = withValidationHandled(zodHandler)
    const mockRequestResponse = (body: Record<string, unknown>): { req: NextApiRequest, res: NextApiResponse } => createMocks({ body })

    it('should 400 on ZodError', async () => {
      const { req, res } = mockRequestResponse({ invalidParam: true })
      await handler(req, res)

      expect(res.statusCode).toBe(400)
    })

    it('should re-throw other errors', async () => {
      const { req, res } = mockRequestResponse({ throwError: true })
      expect.assertions(1) // fail if no assertion
      try {
        await handler(req, res)
      } catch (e) {
        expect(e).toEqual('generic error')
      }
    })

    it('should pass if no error', async () => {
      const { req, res } = mockRequestResponse({ throwError: false })
      await handler(req, res)

      expect(res.statusCode).toBe(200)
    })
  })
})