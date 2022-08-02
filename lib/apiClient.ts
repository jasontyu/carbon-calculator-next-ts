import { CalculateApi } from "../pages/api/calculate"

export const fetchCalculation = async (requestBody: CalculateApi.RequestBody) => {
  const response = await fetch('/api/calculate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    console.error(response)
    throw new Error(`Received unexpected ${response.status}`)
  }

  const result: CalculateApi.ResponseBody = await response.json()
  console.log('RECEIVED /api/calculate', result)
  return result
}


// If making more of these, consider extracting higher-order-function
// createFetch<RequestBody, ResponseBody> (route: string): async (requestBody: RequestBody) => ResponseBody
