import React from 'react'
import { Space, Card, Button, Divider, Layout, Typography } from 'antd'
import { CalculateApi, allCalculationTypes } from '../pages/api/calculate'
const { Title, Text } = Typography
const { Sider } = Layout

export const SIDEBAR_WIDTH = 300

type ComponentProps = {
  calculations: CalculateApi.ResponseBody['calculation']
  resetCalculations: () => void
}
export const Sidebar: React.FC<ComponentProps> = ({ calculations, resetCalculations }) => {
  const totalEmissions = (Object.keys(calculations) as (keyof typeof calculations)[])
    .map((ctype)=> calculations[ctype]?.emissions || 0)
    .reduce((prev, next) => prev+next, 0)

  const renderEmissions = (emissions: number | undefined, decimalPlaces=2) => (
    emissions !== undefined
      ? emissions.toFixed(decimalPlaces)
      : 'Not yet calculated'
  )

  return <Sider
    width={SIDEBAR_WIDTH}
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
    <div style={{ padding: 0, marginTop: '64px'}} />

    <Space direction='vertical' size='middle' style={{ margin: '0 12px', width: '276px' }}>
      <Card title='Emissions' size='default' extra={
        <Button onClick={ resetCalculations } type='ghost'>Reset</Button>
      }>
        <Title level={2}>Total: { renderEmissions(totalEmissions) }</Title>
        { allCalculationTypes.map(ctype => (
          <li key={ctype}>
            <Text strong>{ctype}: </Text>
            <Text>{ renderEmissions(calculations[ctype]?.emissions) }</Text>
          </li>
        ))}
        <Divider />
        <Text type='secondary'>kg CO2eq / day</Text>
      </Card>
    </Space>
  </Sider>
}