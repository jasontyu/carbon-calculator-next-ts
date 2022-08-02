import type { NextApiHandler } from 'next'
import { z } from 'zod'

// Middleware to transform ZodErrors (thrown by validation at request time) into 400 response
// implemented as an HOC according to https://github.com/vercel/next.js/discussions/17832#discussioncomment-945043
export const withValidationHandled = (handler: NextApiHandler): NextApiHandler => (req, res) => {
  try {
    // run handler
    return handler(req, res)
  } catch (error) {
    // if validation error, return 400
    if (error instanceof z.ZodError) {

      // Hack: mimic access log
      console.log('400', req.method, req.url, req.body, ' -> ', { reason: error.issues[0] })

      return res.status(400).json({ reason: error.issues[0] })  // for safety, don't reflect all errors, but provide enough info to incrementally fix
    }
    // otherwise, let default error handler handle it
    throw error
  }
}
