import type { NextPage } from 'next'
import { Button, Card, Space } from 'antd'

const antd: NextPage = () => {
	return (
		<div>
			<Space direction='vertical'>
				Space
				<Card title='Card' size='small'>
					<Space> Space
						<Button>Button</Button>
					</Space>
				</Card>
			</Space>
		</div>
	)
}

export default antd
