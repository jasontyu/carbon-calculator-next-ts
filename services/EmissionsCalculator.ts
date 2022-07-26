import { CalculationType } from "../pages/api/calculate"

export type CalculationResult = {
  emissions: number
}

// TODO: Pass through calculation (with type safety if possible)
// TODO: Write unit tests for Calculator functions
export const calculate = (type: CalculationType, inputs: unknown): CalculationResult => {
  const mapping: Record<CalculationType, (data: unknown) => CalculationResult> = {
    food: calculateFood,
    transportation: calculateTransportation
  }
  return mapping[type](inputs)
}

export const calculateFood = (inputs: unknown) => ({ emissions: 9999 })
export const calculateTransportation = (inputs: unknown) => ({ emissions: 42 })
