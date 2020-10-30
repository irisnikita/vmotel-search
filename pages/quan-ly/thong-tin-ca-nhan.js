// Libraries
import React, { useEffect, useState } from 'react';
import { Divider, Row, Col, Avatar, Badge, Typography, Form, Input, Button, Modal } from 'antd';
import { connect } from 'react-redux';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

// Services
import * as userServices from '../../services/User/index';

// Icons
import { UserOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

// Actions
import { userLogin } from '../../Redux/actions/layout';

// Components
import Layout from '../../components/Layout/Layout';

// Styles
import styles from './styles.module.scss';

function UserInfo(props) {
    const { t } = useTranslation();
    // State
    const [form] = Form.useForm();
    const [userInfo, setUserInfo] = useState([
        { key: 'id', label: 'Id', value: '', placeholder: 'Input your id', disabled: true, required: false },
        { key: 'phoneNumber', label: 'Phone Number', value: '', placeholder: 'Input your phone number', disabled: true, required: false },
        { key: 'userName', label: 'User Name', value: '', placeholder: 'Input your user name', disabled: true, required: false },
        { key: 'fullName', label: 'Name', value: '', placeholder: 'Input your name', disabled: false, required: true },
        { key: 'email', label: 'Email', value: '', placeholder: 'Input your email', disabled: false, required: true }
    ]);

    // Props
    const { user } = props;

    useEffect(() => {
        form.setFieldsValue({
            email: user.email,
            id: user.id,
            fullName: user.fullName,
            phoneNumber: user.phoneNumber,
            userName: user.userName
        });
    }, [user]);

    const showRenderField = () => {
        return userInfo.map(info => {
            return <Col key={info.key} xs={{ span: 24 }} md={{ span: 12 }}>
                <Form.Item
                    name={info.key}
                    label={<strong>{t(info.label)}</strong>}
                    rules={[
                        { required: info.required, message: t(`${info.label} is required`) }
                    ]}
                >
                    <Input placeholder={info.placeholder} disabled={info.disabled} />
                </Form.Item>
            </Col>;
        });
    };

    const updateUser = async (user) => {
        const newUser = await userServices.update(user);

    };

    const onFinishForm = (value) => {
        Modal.confirm({
            title: t('Do you want to update your information'),
            icon: <ExclamationCircleOutlined />,
            content: t('When you click Yes, your information will change'),
            onOk() {

                updateUser(value);
            },
            onCancel() {

            }
        });
    };

    return (
        <Layout dashBoard>
            <h1 style={{ fontSize: 30 }}>{t('User information')}</h1>
            <Divider />
            <Row>
                <Col xs={{ span: 24 }} md={{ span: 6 }}>
                    <div className='d-flex column center'>
                        <Badge offset={[-10, 110]} count={<div className={styles['btn-edit']}><EditOutlined /></div>}>
                            <Avatar className={styles['avatar-user']} src={user.avatar} size={150} icon={<UserOutlined />} />
                        </Badge>
                        <Typography.Title level={4}>{t('User Avatar')}</Typography.Title>
                    </div>
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 18 }}>
                    <Form
                        form={form}
                        name="user-form"
                        onFinish={onFinishForm}
                        labelCol={{ span: 24 }}
                    >
                        <Row gutter={24}>
                            {showRenderField()}
                        </Row>
                        <Form.Item labelCol={{ span: 0 }}>
                            <Button icon={<EditOutlined />} type='primary' htmlType='submit'>{t('Edit')}</Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </Layout>
    );
}

const mapStateToProps = (state) => {
    return {
        user: state.layout.userLogin
    };
};

const mapDispatchToProps = {
    userLogin
};

UserInfo.propTypes = {

};

export default connect(mapStateToProps, mapDispatchToProps)(UserInfo);

