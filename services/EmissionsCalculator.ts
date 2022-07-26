import { CalculationType } from "../pages/api/calculate"

export type CalculationResult = {
  emissions: number
}

// TODO: Pass through calculation (with type safety if possible)
// TODO: Write unit tests for Calculator functions
export const calculate = (type: CalculationType, inputs: unknown): CalculationResult=> {
  const mapping: Record<CalculationType, (data: unknown) => CalculationResult> = {
    transportation: calculateTransportation,
    food: calculateFood
  }
  return mapping[type](inputs)
}

const calculateTransportation = (inputs: unknown) => ({ emissions: 42 })
const calculateFood = (inputs: unknown) => ({ emissions: 9999 })