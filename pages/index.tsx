import type { NextPage } from 'next'
import React, { useState } from 'react'

import { Typography, Layout, Space, BackTop, InputNumber, Form } from 'antd'
import { CalculateApi, CalculationType } from './api/calculate'
import { Sidebar, SIDEBAR_WIDTH } from '../components/Sidebar'
import { CalculationCard } from '../components/CalculationCard'
import * as api from '../lib/apiClient'

const { Title, Text, Link } = Typography
const { Header, Content, Footer } = Layout

type Calculations = CalculateApi.ResponseBody['calculation']

// TODO: make sidebar responsive for mobile
const Home: NextPage = () => {
  const [calculations, setCalculations] = useState<Calculations>({})
  const updateCalculations = async (data: CalculateApi.RequestBody['calculations']) => {
    console.log('SENDING updateCalculations', data)
    try {
      const { calculation: newCalculations } = await api.fetchCalculation({
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

  const foodFields = [
    { label: 'Meat', name: 'meat' },
    { label: 'Vegetables', name: 'vegetables' },
    { label: 'Bread', name: 'bread' },
  ] as const

  const transportationFields = [
    { label: 'Plane', name: 'plane' },
    { label: 'Car', name: 'car' },
    { label: 'Bus', name: 'bus' },
  ] as const

  return (
    <Layout hasSider>
      <BackTop />
      <Layout className="site-layout" style={{ marginRight: SIDEBAR_WIDTH }}>
        <Header className="site-layout-background" style={{ padding: 24, height: 84, backgroundColor: 'lightgreen'}}>
          <Title>Personal Carbon Footprint Calculator</Title>
        </Header>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <Space direction='vertical' style={{ padding: 24, textAlign: 'left' }}>
            <CalculationCard
              name='food'
              title='Food'
              onSubmit={ (values) => updateCalculations({ food: values as Record<typeof foodFields[number]['name'], number> })}
            >
              { foodFields.map(({ label, name }) => (
                <Form.Item
                  key={ name }
                  label={ label }
                  name={ name }
                  rules={[{ required: true }]}
                  initialValue={ 0 }
                >
                  <InputNumber min={0} addonAfter={ 'calories/day' }/>
                </Form.Item>
              )) }
            </CalculationCard>

            <CalculationCard
              name='transportation'
              title='Transportation'
              onSubmit={ (values) => updateCalculations({ transportation: values as Record<typeof transportationFields[number]['name'], number> })}
            >
              { transportationFields.map(({ label, name }) => (
                <Form.Item
                  key={ name }
                  label={ label }
                  name={ name }
                  rules={[{ required: true }]}
                  initialValue={ 0 }
                >
                  <InputNumber min={0} addonAfter={ 'miles/day' }/>
                </Form.Item>
              )) }
            </CalculationCard>
          </Space>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          <Space direction='vertical'>
            <Text>Source code on <Link href='https://github.com/jasontyu/carbon-calculator-next-ts' target='_blank'>GitHub</Link></Text>
            <Text>Component library by <Link href='https://ant.design/' target='_blank'>AntDesign</Link></Text>
            <Text>Powered by <Link href='https://vercel.com/' target='_blank'>Vercel</Link></Text>
          </Space>
        </Footer>
      </Layout>
      <Sidebar calculations={calculations} resetCalculations={ () => setCalculations({}) }/>
    </Layout>
  )
}

export default Home
