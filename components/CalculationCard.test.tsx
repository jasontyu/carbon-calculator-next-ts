import React from 'react'
import { screen, render, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CalculationCard } from './CalculationCard'
import { Form, InputNumber } from 'antd'

// https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

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

    expect(screen.getByText('Food')).toHaveClass('ant-card-head-title')
    expect(screen.getByLabelText('bread')).toBeInTheDocument()
  })

  it('on clicking submit, should call onSubmit with form values', async () => {
    render(<CalculationCard {...props}></CalculationCard>)

    await userEvent.type(screen.getByRole('spinbutton'), '42')
    await userEvent.click(screen.getByRole('button', {name: /submit/i }))
    expect(onSubmit).toHaveBeenCalledWith({ bread: 42 })
  })
})
