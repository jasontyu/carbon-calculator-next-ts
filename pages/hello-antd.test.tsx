import 'jest'
import { render, screen } from '@testing-library/react'
import AntdPage from './hello-antd'

describe('antd', () => {
  it('should contain button', () => {
    render(<AntdPage/>)
    expect(screen.getByRole('button', { name: 'Button' })).toBeInTheDocument()
  })
})