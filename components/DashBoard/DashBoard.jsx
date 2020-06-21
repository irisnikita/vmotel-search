import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {useTranslation} from 'react-i18next';
import {Layout, Menu, Breadcrumb, Slider, Avatar, Row, Col, Button} from 'antd';

import {UserOutlined, LaptopOutlined, NotificationOutlined, ImportOutlined, PlusOutlined} from '@ant-design/icons';

const {SubMenu} = Menu;

const {Header, Content, Sider} = Layout;

function DashBoard(props) {
    const {userLogin = {}} = props;
    const {t} = useTranslation();

    return (
        <Layout style={{maxHeight: '90vh', overflow: 'hidden'}}>
            <Sider width={250} style={{height: '90vh', overflow: 'hidden', backgroundColor: '#fff'}}>
                <div style={{padding: '10px'}}>
                    <div className='d-flex center'>
                        <Avatar src={userLogin.avatar} size={64} />
                    </div>
                    <div className='d-flex row'>
                        <div style={{color: '#08979c', fontWeight: 500, fontSize: 17}}>{userLogin.fullName}</div>
                        <div><strong>{t('Email')}:</strong> {userLogin.email}</div>
                        <div><strong>{t('Phone')}:</strong> {userLogin.phoneNumber}</div>
                        <div className='d-flex space-between' style={{width: '100%'}}>
                            <Button icon={<ImportOutlined />} style={{width: '100px'}} shape='round' danger>{t('Log out')}</Button>
                            <Button icon={<PlusOutlined />} type='primary' style={{width: '100px'}} shape='round'>{t('Post')}</Button>
                        </div>
                    </div>
                </div>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    style={{height: '100%', borderRight: 0}}
                >
                    <SubMenu key="sub1" icon={<UserOutlined />} title="subnav 1">
                        <Menu.Item key="1">option1</Menu.Item>
                        <Menu.Item key="2">option2</Menu.Item>
                        <Menu.Item key="3">option3</Menu.Item>
                        <Menu.Item key="4">option4</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub2" icon={<LaptopOutlined />} title="subnav 2">
                        <Menu.Item key="5">option5</Menu.Item>
                        <Menu.Item key="6">option6</Menu.Item>
                        <Menu.Item key="7">option7</Menu.Item>
                        <Menu.Item key="8">option8</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub3" icon={<NotificationOutlined />} title="subnav 3">
                        <Menu.Item key="9">option9</Menu.Item>
                        <Menu.Item key="10">option10</Menu.Item>
                        <Menu.Item key="11">option11</Menu.Item>
                        <Menu.Item key="12">option12</Menu.Item>
                    </SubMenu>
                </Menu>
            </Sider>
            <Layout style={{padding: 10}}>
                <Content
                    className="site-layout-background"
                    style={{
                        padding: 24,
                        margin: 0,
                        backgroundColor: '#fff',
                        minHeight: 280,
                        maxHeight: '100%',
                        overflow: 'auto'
                    }}
                >
                    {props.children}
                </Content>
            </Layout>
        </Layout>
    );
}

DashBoard.propTypes = {

};

export default DashBoard;

