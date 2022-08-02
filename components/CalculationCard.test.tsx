import React from 'react'
import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Form, InputNumber } from 'antd'
import { CalculationCard } from './CalculationCard'


describe('CalculationCard', () => {
  let props: React.ComponentProps<typeof CalculationCard>
  let onSubmit: jest.Mock
  beforeEach(() => {
    onSubmit = jest.fn()
    props = {
      name: 'food',
      title: 'Food',
      children: <Form.Item label='bread' name='bread'><InputNumber /></Form.Item>,
      onSubmit
    }
  })

  it('should render title and children correctly', () => {
    render(<CalculationCard {...props}></CalculationCard>)

    expect(screen.getByRole('form', { name: 'Food' })).toBeInTheDocument()
    expect(screen.getByLabelText('bread')).toBeInTheDocument()
  })

  it('on clicking submit, should call onSubmit with form values', async () => {
    render(<CalculationCard {...props}></CalculationCard>)

    await userEvent.type(screen.getByRole('spinbutton'), '42')
    await userEvent.click(screen.getByRole('button', {name: /submit/i }))
    expect(onSubmit).toHaveBeenCalledWith({ bread: 42 })
  })
})
