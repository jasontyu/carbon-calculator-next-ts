import 'react'
import { Card, Button, Form } from 'antd'

type ComponentProps = {
  name: string
  title: React.ReactNode
  children: React.ReactNode
  onSubmit: (values: unknown) => void
}

// TODO: write unit tests
export const CalculationCard: React.FC<ComponentProps> = ({ name, title, children, onSubmit }) => {
  const labelId = `CalculationCard-label-${name}`
  return (
    <Card title={ <label id={labelId}>{title}</label> } style={{ width: '100%' }}>
      <Form
        aria-labelledby={labelId}
        name={name}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={ onSubmit }
        onFinishFailed={ (errorInfo) => console.error(errorInfo) }
      >
        <fieldset>
          { children }
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </fieldset>
      </Form>
    </Card>
  )
}
