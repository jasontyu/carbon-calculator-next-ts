import type { NextApiHandler } from 'next'
import { z } from 'zod'
import { calculate, CalculationResult } from '../../services/EmissionsCalculator'
import { withValidationHandled } from '../../utils/middlewares'

// TODO: setup jest with node environment to run server tests with scope
// OR setup e2e tests with cypress or playwright

export namespace Calculate {
  export type RequestBody = z.infer<typeof CalculateRequestBodySchema> // Zod TS magic
  export type ResponseBody = { calculation: Partial<Record<CalculationType, CalculationResult>> }
}
export type CalculationType = keyof Calculate.RequestBody['calculations']

// Zod enables validation and internal types to use same source of truth
const CalculateRequestBodySchema = z
  .object({ 
    calculations: z.object({ 
      transportation: z.object({
        miles: z.number()
      }),
      food: z.object({
        calories: z.number()
      })
    }).partial() // all calculation types are optional
  })
  .refine( // but must contain at least one
    ({ calculations: c }) => c.transportation || c.food,
    'Must contain at least one calculationType'
  )

const handler: NextApiHandler<Calculate.ResponseBody> = (req, res) => {
  // switch-case on HTTP verb is the recommended way to structure RESTful API handles in NextJs
  // alternatively, we could simplify the indentation with an early return:
  //   if (req.method !== 'POST') {
  //     ...unhappy path
  //   }
  //   ...happy path
  switch (req.method) {
    case 'POST':
      const { calculations } = CalculateRequestBodySchema.parse(req.body) // throws ZodError, which is caught by withValidationHandler 

      const calculationTypes = Object.keys(calculations) as CalculationType[]
      const results = calculationTypes
        .map((ctype) => ( { ctype, result: calculate(ctype, calculations[ctype]) } ))
        .reduce((acc, { ctype, result }) => {
          acc[ctype] = result
          return acc
        }, {} as Partial<Record<CalculationType, CalculationResult>>)

      return res.status(200).json({ calculation: results })
    default:
      res.setHeader('Allow', ['POST'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default withValidationHandled(handler)
