import React , {useEffect, useState} from 'react';
import {Divider, Drawer, Radio, InputNumber, Row, Col, Avatar, Badge, Typography, Form, Input, Button, Modal} from 'antd';
import {useTranslation} from 'react-i18next';
import axios from 'axios';
import numeral from 'numeral';
import CryptoJs from 'crypto-js'

// Styles
import styles from './styles.module.scss';

// Components
import Layout from '../../components/Layout/Layout';

// Actions
import {userLogin} from '../../Redux/actions/layout';

// Services
import * as userServices from '../../services/User/index';

// Constant
import {appConfig} from '../../constant';

import {connect} from 'react-redux';

const payments = [
    {key: 'momo', label: 'Momo', logo: '/images/logo-payment/momo.png'}
];

const fees = [
    {key: '50000', value: 50000},
    {key: '100000', value: 100000},
    {key: '200000', value: 200000},
    {key: '500000', value: 500000},
    {key: '1000000', value: 1000000},
    {key: '2000000', value: 2000000}
];

function PayIn(props) {
    // State
    const [paymentSelected, setPaymentSelected] = useState(payments[0]);
    const [isOpenDrawer, setOpenDrawer] = useState(false);
    const [infoPayment, setInfoPayment] = useState({
        feeSelected: 50000,
        orderId: '#1',
        orderInfo: ''
    });

    useEffect(() => {
        setInfoPayment({
            ...infoPayment,
            orderId: `#${props.user.transactions + 1}`,
            orderInfo: `Nạp tài khoản momo ${numeral(infoPayment.feeSelected).format('0,0.0')} đ cho tài khoản ${props.user.userName}`
        })

    }, [props.user]);

    useEffect(() => {
        setInfoPayment({
            ...infoPayment,
            orderInfo: `Nạp tài khoản momo ${numeral(infoPayment.feeSelected).format('0,0.0')} đ cho tài khoản ${props.user.userName}`
        })
    }, [infoPayment.feeSelected])

    const {t} = useTranslation();

    const onClickPayment = (payment)=> {
        setPaymentSelected(payment);
        setOpenDrawer(true);
    };

    const onCloseDrawer = () => {
        setOpenDrawer(false);
    };

    const onChangeSelectedFee = (event) => {
        const {value} = event.target;

        setInfoPayment({
            ...infoPayment,
            feeSelected: value
        });
    };

    const onClickPayIn = async () => {
        // const partner = `partnerCode=MOMODGSZ20200920&accessKey=81GwRfqAAaaIb78s&requestId=${infoPayment.orderId}&amount=${infoPayment.feeSelected}&orderId=${infoPayment.orderId}&orderInfo=${infoPayment.orderInfo}&returnUrl=https://momo.vn&notifyUrl=https://momo.vn&extraData=email=abc@gmail.com`;

        // let signature = CryptoJs.HmacSHA256(partner , appConfig.SECRET_KEY_MOMO_TEST);

        // let data = {
        //     partnerCode: "MOMODGSZ20200920",
        //     accessKey: "81GwRfqAAaaIb78s",
        //     orderId: infoPayment.orderId,
        //     requestId: infoPayment.orderId,
        //     orderInfo: infoPayment.orderInfo,
        //     amount: infoPayment.feeSelected,
        //     requestType: 'captureMoMoWallet',
        //     extraData: "email=abc@gmail.com",
        //     signature: CryptoJs.enc.Hex.stringify(signature),
        //     notifyUrl: "https://momo.vn",
        //     returnUrl: "https://momo.vn",

        // }

        // const momo = await axios({
        //     method: 'POST',
        //     url: appConfig.API_MOMO_TEST,
        //     data: data
        // })

        // console.log(momo)
    }

    return (
        <Layout dashBoard>
            <Drawer
                title={<strong>
                    <img src={paymentSelected.logo} width="20px" /> &nbsp;
                    {t(`Pay in by ${paymentSelected.label}`)}
                </strong>}
                placement='right'
                closable={false}
                onClose={onCloseDrawer}
                visible={isOpenDrawer}
                getContainer={false}
                width={400}
                style={{position: 'absolute'}}
            >
                <div style={{margin: '5px 0px', fontWeight: 'bold'}}>{t('Chose the fee you want to pay')}</div>
                <Radio.Group value={infoPayment.feeSelected} onChange={onChangeSelectedFee}>
                    {fees.map(fee => {
                        return (
                            <Radio key={fee.key} value={fee.value}>{numeral(fee.value).format('0,0.0')} đ</Radio>
                        );
                    })}
                </Radio.Group>
                <div style={{margin: '5px 0px', fontWeight: 'bold'}}>{t('Or input your fee you want to pay')}</div>
                <InputNumber
                    style={{width: 200}}
                    value={infoPayment.feeSelected}
                    formatter={value => `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    onChange={(value) => {setInfoPayment({...infoPayment, feeSelected: value})}}
                    parser={value => value.replace(/₫\s?|(,*)/g, '')}
                />
                <br />
                <Button style={{width: '100%', marginTop: 20}} type='primary' onClick={onClickPayIn}>{t('Pay')}</Button>
                <ul className={styles['list-warning']}>
                    <li>Lưu ý quan trọng: Trong quá trình thanh toán, bạn vui lòng KHÔNG ĐÓNG TRÌNH DUYỆT.</li>

                    <li> Nếu gặp khó khăn trong quá trình thanh toán, xin liên hệ 0917686101 để chúng tôi hỗ trợ bạn.</li>
                </ul>
            </Drawer>
            <h1 style={{fontSize: 30}}>{t('Pay in')}</h1>
            <Divider />
            {
                payments.map(payment => {

                    return (
                        <div key={payment.key} className={styles['wrapper-payment']} onClick={() => onClickPayment(payment)}>
                            <div className={styles['image']}>
                                <img src={payment.logo} alt={payment.logo} width='120px' />
                            </div>
                            <div className={styles['title']}>{payment.label}</div>
                        </div>
                    );
                })
            }
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

export default connect(mapStateToProps, mapDispatchToProps)(PayIn);