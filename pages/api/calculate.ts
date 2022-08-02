import type { NextApiHandler } from 'next'
import { z } from 'zod'
import { calculate, CalculationInput, CalculationResult, prettifyResult } from '../../lib/services/EmissionsCalculator'
import { withValidationHandled } from '../../lib/middlewares'

export namespace CalculateApi {
  export type RequestBody = z.infer<typeof CalculateRequestBodySchema> // Zod TS magic
  export type ResponseBody = { calculation: Partial<Record<CalculationType, CalculationResult>> }
}
export type CalculationType = keyof CalculateApi.RequestBody['calculations']
export const allCalculationTypes: CalculationType[] = [
  'food',
  'transportation'
]

// Zod enables validation and internal types to use same source of truth
const CalculateRequestBodySchema = z
  .object({
    calculations: z.object({
      transportation: z.object({
        bus: z.number(),
        car: z.number(),
        plane: z.number()
      }),
      food: z.object({
        bread: z.number(),
        meat: z.number(),
        vegetables: z.number()
      })
    }).partial() // all calculation types are optional
  })
  .refine( // but must contain at least one
    ({ calculations: c }) => c.transportation || c.food,
    'Must contain at least one calculationType'
  )

const handler: NextApiHandler<CalculateApi.ResponseBody> = (req, res) => {
  // switch-case on HTTP verb is the recommended way to structure RESTful API handles in NextJs
  // alternatively, we could simplify the indentation with an early return:
  //   if (req.method !== 'POST') {
  //     ...unhappy path
  //   }
  //   ...happy path
  switch (req.method) {
    case 'POST': {
      const { calculations } = CalculateRequestBodySchema.parse(req.body) // throws ZodError, which is caught by withValidationHandled

      const results = Object.entries(calculations)
        // transform to list of differentiated type
        .map(([ctype, data]) => ({ ctype, ...data }) as CalculationInput) // TS loses type safety when iterating objects, so we need to recast
        // calculate results using type-safe generic calculate function
        .map((calculationInput) => ({ ctype: calculationInput.ctype, result: calculate(calculationInput) }))
        // transform back to key-value form for output
        .reduce((acc, { ctype, result }) => {
          acc[ctype] = prettifyResult(result)
          return acc
        }, {} as Partial<Record<CalculationType, CalculationResult>>)


      const responseBody = { calculation: results }

      // Hack: mimic access log
      console.log('200 POST /api/calculate', calculations, ' -> ', responseBody)

      return res.status(200).json(responseBody)
    }
    default:
      res.setHeader('Allow', ['POST'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default withValidationHandled(handler)
