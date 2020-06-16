import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {useRouter} from 'next/router';
import {Row, Col, Button} from 'antd';
import {useTranslation} from 'react-i18next';
import _ from 'lodash';

// Components
import Login from '../components/Login/Login';
import Register from '../components/Register/Register';
import Layout from '../components/Layout/Layout';

// Icons
import {connect} from 'react-redux';

function login(props) {
    const {t} = useTranslation();
    const router = useRouter();
    const [menuOptions, setMenuOptions] = useState(['Login', 'Register']);
    const [optionSelected, setOptionSelected] = useState('Login');
    const [userRegister, setUserRegister] = useState({});

    useEffect(() => {
        if (!_.isEmpty(props.userLogin)) {
            router.push('/');
        }
    }, [props.userLogin]);

    const onClickOption = (option, index) => {
        setOptionSelected(option);
    };

    const callbackRegister = (newProps) => {
        const {userRegister} = newProps;

        if (userRegister) {
            setOptionSelected('Login');
            setUserRegister(userRegister);
        }
    };

    return (
        <Layout isLoginPage title={t('Đăng ký, Đăng nhập tài khoản Vmotel-Search')}>
            <Row style={{width: '100%'}}>
                <Col xs={{span: 24}} md={{span: 18}}>
                    <div className='background-login'>
                        <div className='d-flex row menu-login'>
                            {menuOptions && menuOptions.map((option, index) => (
                                <div key={option} onClick={() => onClickOption(option, index)} className={optionSelected === option ? 'active' : null}>{t(option)}</div>
                            ))}
                        </div>
                        <div className='content-login'>
                            <div style={{fontWeight: '100', opacity: 0.5, fontSize: 50, color: '#fff'}}>{t('Welcome to')}</div>
                            <h1 style={{fontSize: 50, fontWeight: 500, color: '#fff'}}>{t('Vmotel-Search')}</h1>
                            <p style={{maxWidth: '550px', color: '#fff'}}>{t('Phòng trọ mới xây, muốn được nhiều người biết, chi phí quảng cáo thấp, hiệu quả, không qua trung gian, trực tiếp gặp khách hàng. Hãy đăng ký và trải nghiệm !')}</p>
                            <Button size='large' style={{width: 150, marginTop: '20px'}} shape='round'>
                                <div>{t('Home page')}</div>
                            </Button>
                        </div>
                    </div>
                </Col>
                <Col style={{padding: 20}} xs={{span: 24}} md={{span: 6}}>
                    {optionSelected === 'Login' ? <Login userRegister={userRegister} /> : <Register callback={callbackRegister} />}
                </Col>
            </Row> 
        </Layout>
    );
}

login.propTypes = {

};

const mapStateToProps = (state) => {
    return {
        userLogin: state.layout.userLogin
    };
};

export default connect(mapStateToProps, null)(login);

