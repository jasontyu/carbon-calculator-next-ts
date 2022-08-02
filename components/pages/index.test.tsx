import { screen, render, within, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import nock from 'nock'

import HomePage from '../../pages/index'
import { allCalculationTypes, CalculationType } from '../../pages/api/calculate'

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
  // To gain even more confidence, consider moving this suite to an E2E test framework like Cypress to avoid API mocking
  describe('integration tests', () => {

    let scope: nock.Scope
    beforeEach(() => {
      scope = nock('http://localhost')
    })
    afterEach(() => {
      nock.cleanAll()
    })

    it('should submit calculations, update emissions sidebar, and reset', async () => {
      render(<HomePage />)

      scope
        .post('/api/calculate', { calculations: { food: { meat: 4200, vegetables: 0, bread: 0 } } })
        .reply(200, {
          calculation: {
            food: { emissions: 100 }
          }
        })
        .post('/api/calculate', { calculations: { transportation: { bus: 1, car: 2, plane: 3 } } })
        .reply(200, {
          calculation: {
            transportation: { emissions: 200 }
          }
        })

      await userEvent.type(screen.getByRole('spinbutton', { name: /meat/i }), '4200')
      await userEvent.click(
        within(screen.getByRole('form', { name: /food/i }))
          .getByRole('button', { name: /submit/i })
      )
      await waitFor(() => expect(screen.getByRole('heading', { name: /total/i })).toHaveTextContent('Total: 100'))

      await userEvent.type(screen.getByRole('spinbutton', { name: /bus/i }), '1')
      await userEvent.type(screen.getByRole('spinbutton', { name: /car/i }), '2')
      await userEvent.type(screen.getByRole('spinbutton', { name: /plane/i }), '3')
      await userEvent.click(
        within(screen.getByRole('form', { name: /transportation/i }))
          .getByRole('button', { name: /submit/i })
      )
      await waitFor(() => expect(screen.getByRole('heading', { name: /total/i })).toHaveTextContent('Total: 300'))

      await userEvent.click(screen.getByRole('button', { name: /reset/i }))
      await waitFor(() => expect(screen.getByRole('heading', { name: /total/i })).toHaveTextContent('Total: 0'))
    })
  })
})
