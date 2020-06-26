import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {useRouter} from 'next/router';
import _ from 'lodash';
import {useTranslation} from 'react-i18next';
import {Layout, Menu, Breadcrumb, Slider, Avatar, Row, Col, Button} from 'antd';

import {ImportOutlined, PlusOutlined} from '@ant-design/icons';
import {connect} from 'react-redux';

import {userLogin} from '../../Redux/actions/layout';

const {SubMenu} = Menu;

const {Header, Content, Sider} = Layout;

function DashBoard(props) {
    const {user = {}} = props;
    const router = useRouter();
    const {t} = useTranslation();
    const [path, setPath] = useState('/');

    const userMenus = [
        {id: 'quan-ly-tin', value: 'Manage posts', icon: 'icon-library_books'},
        {id: 'thong-tin-ca-nhan', value: 'User information', icon: 'icon-person'}
    ];

    useEffect(() => {
        const newPath = router.pathname.replace(/\/quan-ly\//g, '');

        setPath(newPath);

    }, [router.pathname]);

    const onClickAdd = () => {
        router.push('/quan-ly/tao-tin');
    };

    const onClickLogout = () => {
        router.push('/');

        localStorage.removeItem('userInfo');

        props.userLogin({
            userLogin: {}
        });
    };

    return (
        <Layout style={{maxHeight: '90vh', overflow: 'hidden'}}>
            <Sider width={250} style={{height: '90vh', overflow: 'hidden', backgroundColor: '#fff'}}>
                <div style={{padding: '10px'}}>
                    <div className='d-flex center'>
                        <Avatar src={user.avatar} size={64} />
                    </div>
                    <div className='d-flex row'>
                        <div style={{color: '#08979c', fontWeight: 500, fontSize: 17}}>{user.fullName}</div>
                        <div><strong>{t('Email')}:</strong> {user.email}</div>
                        <div><strong>{t('Phone')}:</strong> {user.phoneNumber}</div>
                        <Row className='d-flex space-between' gutter={[0, 10]} style={{width: '100%', marginTop: 20}}>
                            <Col span={24}>
                                <Button onClick={onClickAdd} icon={<PlusOutlined />} style={{width: '100%'}} type='primary'shape='round'>{t('Add post')}</Button>
                            </Col>
                            <Col span={24}>
                                <Button onClick={onClickLogout} icon={<ImportOutlined />} shape='round' style={{width: '100%'}} danger>{t('Log out')}</Button>
                            </Col>
                        </Row>
                    </div>
                </div>
                <Menu
                    mode="inline"
                    selectedKeys={path}
                    style={{height: '100%', borderRight: 0}}
                >
                    {userMenus.map(menu => {
                        return (
                            <Menu.Item key={menu.id} onClick={() => {router.push(`/quan-ly/${menu.id}`)}}>
                                <div className='d-flex' style={{fontWeight: 500}}>
                                    <i className={menu.icon} /> &nbsp;
                                    <div>{t(menu.value)}</div>
                                </div>
                            </Menu.Item>
                        );
                    })}
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

const mapDispatchToProps =  {
    userLogin
};

export default connect(null, mapDispatchToProps)(DashBoard);

