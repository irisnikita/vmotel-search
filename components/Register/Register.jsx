// Libraries
import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {Form, Input, Button, Divider, Row, Col,Select, Radio, notification} from 'antd';
import {useTranslation} from 'react-i18next';
import axios from 'axios';

// Json
import provinces from '../../Docs/json/provincial.json';

// Services
import * as userServices from '../../services/User/register/index';

// Facebook Login
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

// Google Login
import GoogleLogin from 'react-google-login';

// Icons
import {UserOutlined, LockOutlined, FacebookOutlined, GoogleOutlined} from '@ant-design/icons';

// Styles
import styles from './styles.module.scss';

const {Option} = Select;

const config = {
    SUCCESS: 'Bạn đã đăng ký thành công mời bạn đăng nhập để sử dụng ứng dụng',
    UNIQUE: 'Tên đăng nhập đã tồn tại, xin vui lòng thử tên khác hoặc đăng nhập',
    FAILL:  'Bị lỗi khi đăng ký xin vui lòng thử lại'
};

function Login(props) {
    const {t} = useTranslation();
    const [isShowLoading, setIsShowLoading] = useState(false);
    const [provinces, setProvinces] = useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
        getProvinces();
    }, []);

    const getProvinces = async () => {
        const getProvinces = await import('../../Docs/json/provincial.json');

        if (getProvinces) {
            const newProvinces = getProvinces.default.map(item => ({
                name: item.province
            }));

            setProvinces(newProvinces);
        }
    };

    const layout = {
        labelCol: {span: 24},
        wrapperCol: {span: 24}
    };

    const sexs = [
        {id: 'male', label: 'Nam'},
        {id: 'female', label: 'Nữ'}
    ];

    const onFinishForm = async (value) => {
        if (value) {
            setIsShowLoading(true);

            const register = await userServices.create(value);

            if (register) {
                if (register.data && register.data.data) {
                    notification.success({
                        message: t('Register success'),
                        description: t(config.SUCCESS)
                    });

                    if (props.callback) {
                        props.callback({userRegister: value});
                    }
                } else if (register.data.message && register.data.message.code === 'ER_DUP_ENTRY') {
                    notification.error({
                        message: t('Register fail!'),
                        description: t(config.UNIQUE)
                    });
                } else {
                    notification.error({
                        message: t('Register fail!'),
                        description: t(config.FAILL)
                    });
                }
            }

            setIsShowLoading(false);
        }
    };

    const onChangePhoneNumber = (event) => {
        const {value} = event.target;

        const phoneNumber = value.replace(/[^0-9]/g, '');

        form.setFieldsValue({
            phoneNumber: phoneNumber
        });
    };

    return (
        <div className='d-flex row left center' style={{height: '100%'}}>
            <h1 style={{color: '#13c2c2', fontSize: 30}}>{t('Register')}</h1>
            <Form
                {...layout}
                form={form}
                style={{height: '70vh', overflow: 'auto', paddingRight: 5}}
                className='scroll-bar-hide'
                initialValues={{sex: 'male'}}
                onFinish={onFinishForm}
                name='register'
            >
                <Form.Item
                    label={<div style={{fontWeight: 600}}>Họ và tên</div>}
                    name='fullName'
                    rules={[{required: true, message: 'Hãy nhập tên của bạn!'}]}
                >
                    <Input placeholder='Nhập họ và tên' />
                </Form.Item>
                <Form.Item
                    label={<div style={{fontWeight: 600}}>Giới tính</div>}
                    name='sex'
                    rules={[{required: true, message: 'Hãy Chọn giới tính'}]}
                >
                    <Radio.Group >
                        {sexs.map(sex => (
                            <Radio key={sex.id} value={sex.id}>{sex.label}</Radio>
                        ))}
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    label={<div style={{fontWeight: 600}}>Tên đăng nhập</div>}
                    name='userName'
                    rules={[
                        {required: true, message: 'Hãy nhập tên đăng nhập'}
                    ]}
                >
                    <Input placeholder='Nhập tên đăng nhập' />
                </Form.Item>
                <Form.Item
                    label={<div style={{fontWeight: 600}}>Email</div>}
                    name='email'
                    rules={[
                        {
                            type: 'email',
                            message: 'Email không hợp lệ'
                        },
                        {required: true, message: 'Hãy nhập địa chỉ email'}
                    ]}
                >
                    <Input placeholder='Nhập địa chỉ email' />
                </Form.Item>
                <Form.Item
                    label={<div style={{fontWeight: 600}}>{t('Phone number')}</div>}
                    name='phoneNumber'
                    rules={[
                        {required: true, message: t('Please input your phone number!')}
                    ]}
                >
                    <Input placeholder={t('Place your phone number')} onChange={onChangePhoneNumber} />
                </Form.Item>
                <Form.Item
                    label={<div style={{fontWeight: 600}}>Tỉnh</div>}
                    name='province'
                    rules={[{required: true, message: 'Hãy chọn tỉnh thành'}]}
                >
                    <Select
                        showSearch
                        placeholder='Chọn tỉnh thành'
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {
                            provinces.map((province, key) => (
                                <Option key={key} value={province.name}>{province.name}</Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                <Form.Item
                    label={<div style={{fontWeight: 600}}>Địa chỉ</div>}
                    name='address'
                    rules={[{required: true, message: 'Hãy nhập địa chỉ'}]}
                >
                    <Input placeholder='Hãy nhập địa chỉ' />
                </Form.Item>
                <Form.Item
                    name="pass"
                    label="Mật khẩu"
                    rules={[
                        {
                            required: true,
                            message: 'Hãy nhập mật khẩu!'
                        }
                    ]}
                    hasFeedback
                >
                    <Input.Password placeholder='Hãy nhập mật khẩu' />
                </Form.Item>
                <Form.Item
                    name="confirm"
                    label="Xác nhận mật khẩu"
                    dependencies={['pass']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Hãy xác nhận mật khẩu!'
                        },
                        ({getFieldValue}) => ({
                            validator(rule, value) {
                                if (!value || getFieldValue('pass') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject('Mật khẩu không trùng khớp với nhau');
                            }
                        })
                    ]}
                >
                    <Input.Password placeholder='Hãy xác nhận mật khẩu' />
                </Form.Item>
                <Form.Item>
                    <Button style={{width: '100%', background: '#13c2c2', color: '#fff', fontWeight: 500}} shape='round' type="primary" htmlType='submit' block loading={isShowLoading}>
                    Đăng ký
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

Login.propTypes = {

};

export default Login;

