import 'react'
import { Space, Card, Button, Divider, Layout, Typography } from 'antd'
import { CalculateApi, allCalculationTypes } from '../pages/api/calculate'
import { HEADER_HEIGHT } from '../pages/index'
const { Title, Text } = Typography
const { Sider } = Layout

export const SIDEBAR_WIDTH = 300

type ComponentProps = {
  totalEmissions: number
  calculations: CalculateApi.ResponseBody['calculation']
  resetCalculations: () => void
}
export const Sidebar: React.FC<ComponentProps> = ({ totalEmissions, calculations, resetCalculations }) => {
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
    <div style={{ padding: 0, marginTop: `${HEADER_HEIGHT}px`}} />

    <Space direction='vertical' size='middle' style={{ margin: '0 12px', width: '276px' }}>
      <Card title='Emissions' size='default' extra={
        <Button onClick={ resetCalculations } type='ghost' >Reset</Button>
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
}