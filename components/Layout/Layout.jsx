import React from 'react'
import Head from 'next/head'
import {Layout as AntdLayout, Menu, Input, Space, Button, Avatar } from 'antd';

const { Header, Content, Sider } = AntdLayout;

// Styles
import styles from './styles.module.scss';

// Icons
import {PlusOutlined, UserOutlined} from '@ant-design/icons';

export default function Layout(props) {
    const defaultTitle = 'Tìm nhà trọ, khu trọ, giá rẻ, đẹp, gần trung tâm'
    const {children = '', title = defaultTitle} = props;

    return (
        <div>
            <Head>
                <title>{title}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <AntdLayout>
                <Header className={`${styles['default-header']} d-flex space-between`}>
                    <div className='d-flex'>
                        <Space>
                            <img src="/images/vmotel-logo.png" alt="tim-nha-tro" width={64}/>
                            <Input.Search className={`${styles['input-search']} input-focus`} placeholder='Nhập để tìm kiếm '/>
                        </Space>
                    </div>
                    <div className='d-flex'>
                        <Space className='d-flex'>
                            <Avatar icon={<UserOutlined />} size={32}/>
                            <Button type='primary' shape='round'>Đăng nhập</Button>
                            <Button type='ghost' shape='round' icon={<PlusOutlined />}>Đăng tin</Button>
                        </Space>
                    </div>
                </Header>
                <Content className={styles['content']}>
                    {children}
                </Content>
            </AntdLayout>
        </div>
    )
}
