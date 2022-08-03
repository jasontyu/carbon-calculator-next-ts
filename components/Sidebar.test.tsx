import { screen, render, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Sidebar } from './Sidebar'
import { allCalculationTypes } from '../pages/api/calculate'

describe('Sidebar', () => {
  let props: React.ComponentProps<typeof Sidebar>
  let resetCalculations: jest.Mock
  beforeEach(() => {
    resetCalculations = jest.fn()
    props = {
      calculations: {
        food: { emissions: 100 },
        transportation: { emissions: 200 }
      },
      resetCalculations
    }
  })
  afterEach(() => {
    jest.resetAllMocks()
  })


  it('renders expected static text', () => {
    render(<Sidebar {...props} />)

    expect(screen.getByText('Emissions')).toBeInTheDocument()
    expect(screen.getByText('kg CO2eq / day')).toBeInTheDocument()
  })

  it('renders undefined emissions as `Not yet calculated`', () => {
    props.calculations = {
      food: undefined,
      transportation: undefined
    }

    render(<Sidebar {...props} />)

    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(allCalculationTypes.length)
    items.forEach((item, index) => {
      const { getByText } = within(item)
      const calculationType = allCalculationTypes[index]
      expect(getByText(calculationType + ':')).toBeInTheDocument()
      expect(getByText('Not yet calculated')).toBeInTheDocument()
    })
  })

  it('renders zero emissions as zeros with 2 decimal places', () => {
    props.calculations = {
      food: { emissions: 0 },
      transportation: { emissions: 0 }
    }

    render(<Sidebar {...props} />)

    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(allCalculationTypes.length)
    items.forEach((item, index) => {
      const { getByText } = within(item)
      const calculationType = allCalculationTypes[index]
      expect(getByText(calculationType + ':')).toBeInTheDocument()
      const zero = 0
      expect(getByText(zero.toFixed(2))).toBeInTheDocument()
    })
  })

  it('renders nonzero emissions with 2 decimal places', () => {
    render(<Sidebar {...props} />)

    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(allCalculationTypes.length)
    items.forEach((item, index) => {
      const { getByText } = within(item)
      const calculationType = allCalculationTypes[index]
      const expectedValue = props.calculations[calculationType]?.emissions
      expect(expectedValue).not.toBeUndefined()
      expect(getByText(calculationType + ':')).toBeInTheDocument()
      expect(getByText((expectedValue as number).toFixed(2))).toBeInTheDocument()
    })
  })

  it('renders total emissions correctly', () => {
    render(<Sidebar {...props} />)

    expect(screen.getByRole('heading')).toHaveTextContent('Total: 300.00')
  })

  it('renders partial data correctly', () => {
    props.calculations = {
      food: { emissions: 100 },
      transportation: undefined
    }

    render(<Sidebar {...props} />)

    expect(screen.getByRole('heading')).toHaveTextContent('Total: 100.00')

    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(allCalculationTypes.length)
    items.forEach((item, index) => {
      const { getByText } = within(item)
      const calculationType = allCalculationTypes[index]
      const expectedValue = props.calculations[calculationType]?.emissions
      if (!expectedValue) {
        expect(getByText('Not yet calculated')).toBeInTheDocument()
      } else {
        expect(getByText(expectedValue.toFixed(2))).toBeInTheDocument()
      }
    })
  })

  it('Reset button calls resetCalculation on click', async () => {
    render(<Sidebar {...props} />)

    await userEvent.click(screen.getByRole('button', { name: /reset/i }))
    expect(resetCalculations).toHaveBeenCalled()
  })
})
