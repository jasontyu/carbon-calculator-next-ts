import { CalculateApi } from "../pages/api/calculate"
import axios from 'axios'

export const fetchCalculation = async (requestBody: CalculateApi.RequestBody) => {
  const response = await axios.post('/api/calculate', requestBody)

  const result: CalculateApi.ResponseBody = response.data
  console.log('RECEIVED /api/calculate', result)
  return result
}

// If making more of these, consider extracting higher-order-function
// createFetch<RequestBody, ResponseBody> (route: string): async (requestBody: RequestBody) => ResponseBody
