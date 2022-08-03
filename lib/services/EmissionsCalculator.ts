// to unwrap ctype from input without using them
/* eslint-disable @typescript-eslint/no-unused-vars */

import { CalculateApi } from "../../pages/api/calculate"

export type CalculationResult = {
  emissions: number
}

// Intermediary type with type discrimination allows mapping of generic calculate to strongly typed helpers
export type CalculationInput = { ctype: 'food' } & CalculateApi.RequestBody['calculations']['food']
  | { ctype: 'transportation' } & CalculateApi.RequestBody['calculations']['transportation']

export const calculate = (input: CalculationInput): CalculationResult => {
  switch (input.ctype) {
    case 'food': {
      const { ctype, ...data } = input
      return calculateFood(data)
    }
    case 'transportation': {
      const { ctype, ...data } = input
      return calculateTransportation(data)
    }
  }
}

// TODO: extract request body schema so we can separate the .partial() which is contaminating internal types
// That way, we won't have to manually wrap types in Required<..>
export const calculateFood = (data: Required<CalculateApi.RequestBody['calculations']>['food']) => {
  // Median GHG emissions (kg CO2eq / NU)
  // from aaq0216_datas2 (https://www.science.org/doi/10.1126/science.aaq0216)
  const factors: Record<keyof typeof data, number> = {
    bread: 0.5 / 1000,
    meat: 30 / 1000,
    vegetables: 0.4 / 1000
  }
  const emissions = (Object.keys(data) as (keyof typeof data)[]) // TS loses type safety when iterating objects so we need to do this redundant looking cast
    .map(key => factors[key] * data[key])
    .reduce((sum, next) => sum + next, 0)

  return { emissions }
}

export const calculateTransportation = (data: Required<CalculateApi.RequestBody['calculations']>['transportation']) => {
  // CO2 Factor (kg CO2 / vehicle-mile)
  // from Emission Factors for Greenhouse Gas Inventories
  // Table 10: Scope 3 Category 6: Business Travel and Category 7: Employee Commuting
  const factors: Record<keyof typeof data, number> = {
    plane: 0.133, // Air Travel, medium-haul (passenger-mile)
    car: 0.335, // Passenger Car
    bus: 0.053 // Bus
  }
  const emissions = (Object.keys(data) as (keyof typeof data)[]) // TS loses type safety when iterating objects so we need to do this redundant looking cast
    .map(key => factors[key] * data[key])
    .reduce((sum, next) => sum + next, 0)

  return { emissions }
}
