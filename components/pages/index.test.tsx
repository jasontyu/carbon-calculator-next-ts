import { screen, render, within } from '@testing-library/react'

import userEvent from '@testing-library/user-event'
import { allCalculationTypes, CalculationType } from '../../pages/api/calculate'
import HomePage from '../../pages/index'


describe('HomePage', () => {
  // Consider extracting header and footer into components
  // They're pretty simple, so maybe not worth the overhead at the moment
  it('should render header and footer', () => {
    render(<HomePage />)

    expect(screen.getByRole('heading', { name: 'Personal Carbon Footprint Calculator' })).toBeInTheDocument()

    const footer = screen.getByRole('contentinfo')
    const links = ['GitHub', 'AntDesign', 'Vercel']
    links.forEach((link) => {
      expect(within(footer).getByRole('link', { name: link })).toBeInTheDocument()
    })
  })

  it('should render all expected forms', () => {
    render(<HomePage />)

    const formLabels: Record<CalculationType, string> = {
      food: 'Food',
      transportation: 'Transportation'
    }

    const mainContent = screen.getByRole('main')
    Object.values(formLabels).forEach(label => {
      expect(within(mainContent).getByRole('form', { name: label })).toBeInTheDocument()
    })

    // additional assertions to ensure this test is updated when allCalculationTypes is updated
    expect(Object.values(formLabels)).toHaveLength(allCalculationTypes.length)
    Object.keys(formLabels).forEach(ctype => expect(allCalculationTypes.includes(ctype as CalculationType)))
  })

  it('should render emissions sidebar', () => {
    render(<HomePage />)
    expect(screen.getByRole('heading', { name: /total/i })).toBeInTheDocument()
  })

  // Since we're testing at the page-level,
  // we also get to do integration-level tests (across components)
  describe.skip('integration tests', () => {

    // TODO: mock API call

    it.skip('when submitting a calculation, should update emissions sidebar', async () => {
      render(<HomePage />)

      await userEvent.type(screen.getByRole('spinbutton', { name: /meat/i }), '4200')
      await userEvent.click(
        within(screen.getByRole('form', { name: /food/i }))
          .getByRole('button', { name: /submit/i })
      )

      expect(screen.getByRole('heading', { name: /total/i })).toHaveTextContent('Total: 42')

    })
    it.todo('when clicking reset, should reset emissions sidebar')
  })
})
