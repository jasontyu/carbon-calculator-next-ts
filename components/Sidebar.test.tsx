import { screen, render, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Sidebar } from './Sidebar'


describe('Sidebar', () => {
  let props: React.ComponentProps<typeof Sidebar>
  let resetCalculations: jest.Mock
  beforeEach(() => {
    resetCalculations = jest.fn()
    props = {
      totalEmissions: 300,
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

  const orderedKeys = [ 'food', 'transportation' ] as (keyof typeof props.calculations)[]

  it('renders static elements', () => {
    render(<Sidebar {...props} />)

    expect(screen.getByText('Emissions')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByText('kg CO2eq / day')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reset/i }))
  })

  it('renders nonzero emissions correctly', () => {
    render(<Sidebar {...props} />)

    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(orderedKeys.length)
    items.forEach((item, index) => {
      const { getByText } = within(item)
      const calculationType = orderedKeys[index]
      const expectedValue = props.calculations[calculationType]?.emissions.toString()
      expect(expectedValue).not.toBeUndefined()
      expect(getByText(calculationType + ':')).toBeInTheDocument()
      expect(getByText(expectedValue as string)).toBeInTheDocument()
    })
  })

  it('renders `Not yet calculated` if calculation is 0', () => {
    props.totalEmissions = 0
    props.calculations = {
      food: { emissions: 0 },
      transportation: { emissions: 0 }
    }

    render(<Sidebar {...props} />)

    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(orderedKeys.length)
    items.forEach((item, index) => {
      const { getByText } = within(item)
      const calculationType = orderedKeys[index]
      const expectedValue = props.calculations[calculationType]?.emissions.toString()
      expect(expectedValue).not.toBeUndefined()
      expect(getByText(calculationType + ':')).toBeInTheDocument()
      expect(getByText('Not yet calculated')).toBeInTheDocument()
    })
  })

  it('Reset button calls resetCalculation on click', async () => {
    render(<Sidebar {...props} />)

    await userEvent.click(screen.getByRole('button', { name: /reset/i }))
    expect(resetCalculations).toHaveBeenCalled()
  })
})