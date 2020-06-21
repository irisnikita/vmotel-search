// Libraries
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Form, Input, Button, Divider, Row, Col} from 'antd';
import {withRouter} from 'next/router';
import {useTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import _ from 'lodash';

// Actions
import {userLogin} from '../../Redux/actions/layout';

// Services
import * as userServices from '../../services/User/index';

// Facebook Login
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

// Google Login
import GoogleLogin from 'react-google-login';

// Icons
import {UserOutlined, LockOutlined, FacebookOutlined, GoogleOutlined} from '@ant-design/icons';

// Styles
import styles from './styles.module.scss';

function Login(props) {
    const {t} = useTranslation();
    const [form] = Form.useForm();
    const [isShowLoading, setIsShowLoading] = useState(false);

    useEffect(() => {
        if (!_.isEmpty(props.userRegister)) {
            form.setFieldsValue({
                userName: props.userRegister.userName,
                pass: props.userRegister.pass
            });
        }
    }, [props.userRegister]);

    const layout = {
        wrapperCol: {span: 24}
    };

    const responseFacebook = (value) => {
        console.log(value);
    };

    const responseGoogle = (value) => {
        console.log(value);
    };

    const onFinishForm = async (value) => {
        if (value) {
            setIsShowLoading(true);

            const login = await userServices.create({
                userName: value.userName,
                pass: value.pass
            });

            if (login) {
                if (login.data && login.data.data) {
                    const {token = '', user = {}} = login.data.data;

                    localStorage.setItem('userInfo', JSON.stringify({token}));

                    props.userLogin({
                        userLogin: user
                    });

                    props.router.push('/');
                }
            }

            setIsShowLoading(false);
        }
    };

    return (
        <div className='d-flex row left center' style={{height: '100%'}}>
            <h1 style={{color: '#13c2c2', fontSize: 30}}>{t('Login')}</h1>
            <Form {...layout} form={form} name='login' style={{width: '100%'}} onFinish={onFinishForm}>
                <Form.Item
                    name='userName'
                    rules={[{required: true, message: t('Please input your name!')}]}
                >
                    <Input className={styles['input-login']} prefix={<UserOutlined />} placeholder={t('Place your user name')} />
                </Form.Item>
                <Form.Item
                    name='pass'
                    rules={[{required: true, message: t('Please input your name!')}]}
                >
                    <Input.Password className={styles['input-login']} prefix={<LockOutlined />} placeholder={t('Place your password')} />
                </Form.Item>
                <Form.Item>
                    <Button htmlType='submit' size='large' loading={isShowLoading} style={{width: '100%', background: '#13c2c2', color: '#fff', fontWeight: 500}} shape='round'>{t('Login')}</Button>
                </Form.Item>
                <Divider>{t('Other')}</Divider>
            </Form>
            <Row style={{width: '100%'}} gutter={[5, 5]}>
                <Col xs={{span: 24}} md={{span: 12}}>
                    <FacebookLogin
                        appId="1088597931155576"
                        callback={responseFacebook}
                        render={renderProps => (
                            <div onClick={renderProps.onClick} className={styles['btn-login-other']}>
                                <FacebookOutlined /> &nbsp;
                                <div>Facebook</div>
                            </div>
                        )}
                    />
                </Col>
                <Col xs={{span: 24}} md={{span: 12}}>
                    <GoogleLogin
                        clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
                        buttonText="Login"
                        render={renderProps => (
                            <div onClick={renderProps.onClick} style={{backgroundColor: '#f5222d'}} className={styles['btn-login-other']}>
                                <GoogleOutlined /> &nbsp;
                                <div>Google</div>
                            </div>
                        )}
                        onSuccess={responseGoogle}
                        onFailure={responseGoogle}
                        cookiePolicy={'single_host_origin'}
                    />
                </Col>
            </Row>
        </div>
    );
}

Login.propTypes = {

};

const mapDispatchToProps = {
    userLogin
};

export default withRouter(connect(null, mapDispatchToProps)(Login));

