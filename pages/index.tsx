import type { NextPage } from 'next'
import React, { useState } from 'react'

import { Typography, Layout, Space, Card, BackTop, InputNumber, Form, Button, Divider } from 'antd'
import { CalculateApi, CalculationType } from './api/calculate'

const { Title, Text, Link } = Typography
const { Header, Content, Footer, Sider } = Layout

type Calculations = CalculateApi.ResponseBody['calculation']

const allCalculationTypes: CalculationType[]  = [
  'food',
  'transportation'
]

const sideBarWidth = 300

// TODO: move to separate file and unit tests
// nice-to-have: consider extracting higher-order-function  createFetch<RequestBody, ResponseBody> (route: string): async (requestBody: RequestBody) => ResponseBody
const fetchCalculation = async (requestBody: CalculateApi.RequestBody) => {
  const response = await fetch('/api/calculate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    console.error(response)
    throw new Error(`Received unexpected ${response.status}`)
  }

  const result: CalculateApi.ResponseBody = await response.json()
  console.log('RECEIVED /api/calculate', result)
  return result
}

// TODO: make sidebar responsive for mobile
const Home: NextPage = () => {
  const [calculations, setCalculations] = useState<Calculations>({})
  const totalEmissions = (Object.keys(calculations) as CalculationType[])
    .map((ctype)=> calculations[ctype]?.emissions || 0)
    .reduce((prev, next) => prev+next, 0)

  const updateCalculations = async (data: CalculateApi.RequestBody['calculations']) => {
    console.log('SENDING updateCalculations', data)
    try {
      const { calculation: newCalculations } = await fetchCalculation({
        calculations: data
      })
      setCalculations({
        ...calculations,
        ...newCalculations
      })
    } catch (error) {
      // form input was invalid
    }

  }

  return (
    <Layout hasSider>
      <BackTop />
      <Layout className="site-layout" style={{ marginRight: sideBarWidth }}>
      <Header className="site-layout-background" style={{ padding: 24, height: 84, backgroundColor: 'lightgreen'}}>
        <Title>Personal Carbon Footprint Calculator</Title>
      </Header>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <Space direction='vertical' style={{ padding: 24, textAlign: 'left' }}>
            <Card title='Food' style={{ width: '100%' }}>
              <Form
                name='food'
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                onFinish={ (values) => updateCalculations({ food: values }) }
                onFinishFailed={ (errorInfo) => console.error(errorInfo) }
              >
                { [
                  { label: 'Meat', name: 'meat' },
                  { label: 'Vegetables', name: 'vegetables' },
                  { label: 'Bread', name: 'bread' },
                ].map(({ label, name }) => (
                  <Form.Item
                    key={ name }
                    label={ label }
                    name={ name }
                    rules={[{ required: true }]}
                    initialValue={ 0 }
                  >
                    <InputNumber min={0} addonAfter={ 'calories/day' }/>
                    {/* Nice to have: render % to help fiddle with numbers */}
                  </Form.Item>
                )) }

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </Card>

            <Card title='Transportation'>
              <Form
                name='transportation'
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                onFinish={ (values) => updateCalculations({ transportation: values }) }
                onFinishFailed={ (errorInfo) => console.error(errorInfo) }
              >
                { [
                  { label: 'Plane', name: 'plane' },
                  { label: 'Car', name: 'car' },
                  { label: 'Bus', name: 'bus' },
                ].map(({ label, name }) => (
                  <Form.Item
                    key={ name }
                    label={ label }
                    name={ name }
                    rules={[{ required: true }]}
                    initialValue={ 0 }
                  >
                    <InputNumber min={0} addonAfter={ 'miles/day' }/>
                    {/* Nice to have: add a switcher for miles/kg, provide context, and pass through to api as optional arg */}
                  </Form.Item>
                )) }

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </Card>

            {/* <Card title='extras' size='default'>
              <Button onClick={ () => updateCalculations({ food: { wrongKey: 5 } } as any) } type='ghost'>bad API call</Button>
            </Card> */}

          </Space>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          <Space direction='vertical'>

            <Text>Source code on <Link href='https://github.com/jasontyu/carbon-calculator-next-ts'>GitHub</Link></Text>
            <Text>Component library by <Link href='https://ant.design/'>AntDesign</Link></Text>
          </Space>
        </Footer>
      </Layout>
      <Sider
        width={sideBarWidth}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          backgroundColor: 'lightgray'
        }}
      >
        <div style={{ padding: 0, marginTop: '64px', backgroundColor: 'lightgreen'}} />

        <Space direction='vertical' size='middle' style={{ margin: '0 12px', width: '276px' }}>
          <Card title='Emissions' size='default' extra={
            <Button onClick={ () => setCalculations({}) } type='ghost' >Reset</Button>
          }>
            <Title level={2}>Total: { totalEmissions }</Title>

              { allCalculationTypes.map(ctype => (
                <li key={ctype}>
                  <Text strong>{ctype}: </Text>
                  <Text>{calculations[ctype]?.emissions || 'Not yet calculated' }</Text>
                </li>
              ))}
            <Divider />
            <Text type='secondary'>kg CO2eq / day</Text>
          </Card>
        </Space>
      </Sider>
    </Layout>
  )
}

export default Home
