import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import numeral from 'numeral';
import {Divider, Row, Col, Select, Typography, Input, Button, Form, InputNumber} from 'antd';

import {appConfig} from '../../constant';

import Layout from '../../components/Layout/Layout';

// Components
import Editor from '../../components/Editor/Editor';
import Upload from '../../components/Upload/Upload';

import {connect} from 'react-redux';

const {Title, Text} = Typography;

function InforMation(props) {
    const {t} = useTranslation();
    const [form] = Form.useForm();
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [streets, setStreets] = useState([]);
    const [filter, setfilter] = useState({
        optionType: '',
        province: '',
        district: '',
        street: '',
        prices: [0, 50],
        areas: [0, 50]
    });
    const [typeFees, setTypeFees] = useState([
        {id: 'days', label: 'Days', fee: {normal: 2000, hot: 10000, vip: 50000}, value: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70], prefix: 'day'} ,
        {id: 'weeks', label: 'Weeks', fee: {normal: 10000, hot: 60000, vip: 300000}, value: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], prefix: 'week'},
        {id: 'months', label: 'Months', fee: {normal: 40000, hot: 240000, vip: 1000000}, value: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], prefix: 'month'}
    ]);
    const [optionSelected, setOptionSelected] = useState({
        level: appConfig.levelPost[0],
        typeFee: typeFees[0],
        rangeTime: typeFees[0].value[0]
    });

    const layout = {
        labelCol: {span: 24},
        wrapperCol: {span: 24}
    };

    useEffect(() => {
        getLocal();
    }, []);
    
    // useEffect(() => {
    //     console.log(props.userLogin);
    //     if (props.userLogin) {

    //     }
    // }, [props.userLogin]);

    useEffect(() => {
       
        const province = provinces.find(province => province.code === filter.province);

        if (province) {
            const newDistricts = province.districts;

            setDistricts(newDistricts);

            setfilter({
                ...filter,
                district: newDistricts[0].name
            });
        }
       
    }, [filter.province]);

    useEffect(() => {
       
        const district = districts.find(district => district.name === filter.district);

        if (district) {
            const newStreets = district.streets;

            setStreets(newStreets);

            setfilter({
                ...filter,
                street: newStreets[0].id
            });
        }
        
    }, [filter.district]);

    const getLocal = async () => {
        const getLocal = await import('../../Docs/json/local.json');

        if (getLocal) {
            const newProvinces = provinces.concat(getLocal.default);

            setProvinces(newProvinces);

            setfilter({
                ...filter,
                province: newProvinces[0].code
            });
        }
    };

    const onChangeOptionTypes = (value) => {
        setfilter({
            ...filter,
            optionType: value
        });
    };

    const onChangeProvinces = (value) => {
        setfilter({
            ...filter,
            province: value
        });
    };

    const onChangeDistrict = (value) => {
        setfilter({
            ...filter,
            district: value
        });
    };

    const onChangeStrict = (value) => {
        setfilter({
            ...filter,
            street: value
        });
    };

    const callbackSliderPrice = (value) => {
        setfilter({
            ...filter,
            prices: value
        });
    };

    const callbackSliderArea = (value) => {
        setfilter({
            ...filter,
            areas: value
        });
    };

    const showRenderRangeDate = () => {

    };

    const onChangeLevel = (value) => {
        const newLevel = appConfig.levelPost.find(level => level.id === value);

        setOptionSelected({
            ...optionSelected,
            level: newLevel
        });
    };

    const onChangeTypeTime = (value) => {
        const newTypeTime = typeFees.find(type => type.id === value);

        setOptionSelected({
            ...optionSelected,
            typeFee: newTypeTime
        });
    };

    const onChangeTime = (value) => {
        setOptionSelected({
            ...optionSelected,
            rangeTime: value
        });
    };

    return (
        <Layout dashBoard>
            <h1 style={{fontSize: 30}}>{t('Post new')}</h1>
            <Divider />
            <div style={{color: '#f5222d'}}>
                <div style={{fontSize: 25, color: '#434343'}}>{t('Address')}</div>
                {t('(Lưu ý chọn đầy đủ và chính xác địa chỉ để bài viết được tiếp cận hiệu quả)')}
            </div>
            <div className='d-flex center filter-custom' style={{width: '100%', position: 'relative', top: 0, margin: '20px 0px'}}>
                <Row className='inner-filter' gutter={[16, 16]}>
                    <Col xs={{span: 24}} md={{span: 5}}>
                        <div className='d-flex row left'>
                            <strong>{t('Provinces')}:</strong>
                            <Select
                                style={{width: 170}}
                                value={filter.province}
                                onChange={onChangeProvinces}
                                placeholder={'hello'}
                            >
                                {provinces && provinces.length > 0 && provinces.map(province => {
                                    return <Select.Option key={province.id} value={province.code}>{t(province.name)}</Select.Option>;
                                })}
                            </Select>
                        </div>
                    </Col>
                    <Col xs={{span: 24}} md={{span: 5}}>
                        <div className='d-flex row left'>
                            <strong>{t('District')}:</strong>
                            <Select style={{width: 170}} value={filter.district} onChange={onChangeDistrict}>
                                {districts && districts.length > 0 && districts.map(district => {
                                    return <Select.Option key={district.name} value={district.name}>{t(district.name)}</Select.Option>;
                                })}
                            </Select>
                        </div>
                    </Col>
                    <Col xs={{span: 24}} md={{span: 5}}>
                        <div className='d-flex row left'>
                            <strong>{t('Street')}:</strong>
                            <Select style={{width: 170}} value={filter.street} onChange={onChangeStrict}>
                                {streets && streets.length > 0 && streets.map(street => {
                                    return <Select.Option key={street.id} value={street.id}>{`${street.prefix || ''} ${t(street.name)}`}</Select.Option>;
                                })}
                            </Select>
                        </div>
                    </Col>
                    <Col xs={{span: 24}} md={{span: 9}}>
                        <div className='d-flex row left'>
                            <strong>{t('Address detail')}:</strong>
                            <Input placeholder={t('Input address')} style={{width: '100%'}} />
                        </div>
                    </Col>
                </Row>
                
            </div>
            <Row style={{width: '100%'}}>
                <Col xs={{span: 24}} md={{span: 14}}>
                    <Form {...layout} form={form} name='form-information'>
                        <div style={{fontSize: 25, color: '#434343', marginBottom: 20}}>{t('Information')}</div>
                        <Form.Item
                            label={<strong>{t('Type post')}</strong>}
                            name='typePost'
                            rules={[{required: true, message: t('Please select type of post!')}]}
                        >
                            <Select 
                                style={{width: 200}} 
                                placeholder={t('Select type of post')}
                                onChange={onChangeOptionTypes}
                            >
                                {appConfig.optionTypes && appConfig.optionTypes.length > 0 && appConfig.optionTypes.map(option => {
                                    return <Select.Option key={option.id} value={option.id}>{t(option.value)}</Select.Option>;
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label={<strong>{t('Title')}</strong>}
                            name='title'
                            rules={[{required: true, message: t('Please input the title!')}]}
                        >
                            <Input 
                                placeholder={t('Input the title')}
                            />
                        </Form.Item>
                        <Form.Item
                            label={<strong>{t('Description')}</strong>}
                            name='description'
                        >
                            <Editor />
                        </Form.Item>
                        <div style={{marginBottom: 10}}>
                            <strong style={{color: 'black'}}>{t('Contact')}</strong>
                            <Row style={{marginTop: 10}} gutter={[10, 10]}>
                                <Col span={24}>
                                    <Input disabled value={props.userLogin.phoneNumber} />
                                </Col>
                                <Col span={24}>
                                    <Input disabled value={props.userLogin.fullName} />
                                </Col>      
                            </Row>   
                        </div>
                        <Form.Item
                            label={<strong>{t('Price')}</strong>}
                            name='price'
                            rules={[{required: true, message: t('Please input price!')}]}
                        >
                            <InputNumber 
                                style={{width: 200}} 
                                formatter={value => `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/₫\s?|(,*)/g, '')}
                            />
                        </Form.Item>
                        <Form.Item
                            label={<strong>{t('Area')}</strong>}
                            name='area'
                            rules={[{required: true, message: t('Please input area!')}]}
                        >
                            <InputNumber 
                                min={1}
                                max={1000}
                                placeholder={t('Input the area')}
                                style={{width: 200}}
                            />
                        </Form.Item>
                        <div style={{fontSize: 25, color: '#434343', marginBottom: 20}}>{t('Images')}</div>
                        <Upload />
                        <div style={{fontSize: 25, color: '#434343', marginBottom: 20}}>{t('Services')}</div>
                        <div className='d-flex space-between' style={{width: '100%', marginBottom: 20}}>
                            <div className='d-flex row left'>
                                <strong>{t('Package vip')}:</strong>
                                <Select
                                    onChange={onChangeLevel}
                                    style={{width: 170}}
                                    value={optionSelected.level.id}
                                >
                                    {appConfig.levelPost && appConfig.levelPost.length > 0 && appConfig.levelPost.map(level => {
                                        return <Select.Option  key={level.id} value={level.id}>{t(level.label)}</Select.Option>;
                                    })}
                                </Select>
                            </div>
                            <div className='d-flex row left'>
                                <strong>{t('Package time')}:</strong>
                                <Select
                                    onChange={onChangeTypeTime}
                                    style={{width: 170}}
                                    value={optionSelected.typeFee.id}
                                >
                                    {typeFees && typeFees.length > 0 && typeFees.map(type => {
                                        return <Select.Option key={type.id} value={type.id}>{t(type.label)}</Select.Option>;
                                    })}
                                </Select>
                            </div>
                            <div className='d-flex row left'>
                                <strong>{t(`Number ${optionSelected.typeFee.prefix}`)}:</strong>
                                <Select
                                    style={{width: 170}}
                                    value={optionSelected.rangeTime}
                                    onChange={onChangeTime}
                                >
                                    {optionSelected.typeFee.value && optionSelected.typeFee.value.length > 0 && optionSelected.typeFee.value.map(value => {
                                        return <Select.Option key={value} value={value}>{t(value)} {optionSelected.typeFee.prefix}</Select.Option>;
                                    })}
                                </Select>
                            </div>
                        </div>
                        <Form.Item>
                            <Button style={{width: '100%'}} type='primary' htmlType='submit'>{t('Pay and submit')} {`(${numeral(optionSelected.typeFee.fee[optionSelected.level.id] * optionSelected.rangeTime).format('0,0')})`}</Button>
                        </Form.Item>
                    </Form>
                </Col>
                <Col xs={{span: 24}} md={{span: 10}} />
            </Row>
        </Layout>
    );
}

InforMation.propTypes = {

};

const mapStateToProps = (state) => {
    return {
        userLogin: state.layout.userLogin
    };
};

export default connect(mapStateToProps, null)(InforMation);

