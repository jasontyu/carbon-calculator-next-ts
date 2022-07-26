import type { NextPage } from 'next'
import { Button, Card, Space } from 'antd'
import { CalculateApi } from './api/calculate'
import { useState } from 'react'

const CalculatePage: NextPage = () => {

  const [emissions, setEmissions] = useState<number | null>(null)

  const handleCalculate = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault() // Stop the form from submitting and refreshing the page.

    const data: CalculateApi.RequestBody = {
      calculations: {
        food: {
          calories: 1000
        },
        transportation: {
          miles: 500
        }
      }
    }

    const response = await fetch('/api/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const result: CalculateApi.ResponseBody = await response.json()
    console.log(result)

    // TODO: Consider moving totalEmissions calculation into backend
    const totalEmissions = (result.calculation?.food?.emissions || 0) + ( result.calculation?.transportation?.emissions || 0)
    setEmissions(totalEmissions)
  }

	return (
		<div>
			<Space direction='vertical'>
				<Card title='Card' size='small'>
					<span>Emissions: </span>{ emissions || 'TBD' }
				</Card>
        <Button onClick={ handleCalculate }>Calculate!</Button>
			</Space>
		</div>
	)
}

export default CalculatePage
