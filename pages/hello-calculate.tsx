import type { NextPage } from 'next'
import { Button, Card, Form, Space } from 'antd'
import { Calculate } from './api/calculate'
import { useState } from 'react'

const CalculatePage: NextPage = () => {

  const [emissions, setEmissions] = useState<number | null>(null)

  const handleCalculate = async (event: React.MouseEvent<HTMLButtonElement>) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault()

    const data: Calculate.RequestBody = {
      calculations: {
        food: {
          calories: 1000
        },
        transportation: {
          miles: 500
        }
      }
    }

    // Send the form data to our forms API on Vercel and get a response.
    const response = await fetch('/api/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    // Get the response data from server as JSON.
    // If server returns the name submitted, that means the form works.
    const result: Calculate.ResponseBody = await response.json()
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
