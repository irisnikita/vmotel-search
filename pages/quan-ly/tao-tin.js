import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import {useRouter} from 'next/router';
import numeral from 'numeral';
import {Divider, Row, Col, Select, Typography, Input, Button, Form, InputNumber, Spin, notification} from 'antd';
import _ from 'lodash';
import axios from 'axios';
import moment from 'moment';

import {appConfig} from '../../constant';

import Layout from '../../components/Layout/Layout';

// Components
import Editor from '../../components/Editor/Editor';
import Upload from '../../components/Upload/Upload';
import GoogleMap from '../../components/GoogleMap/GoogleMap';

// Services
import * as roomServices from '../../services/room/index';
import * as uploadServices from '../../services/Upload/index';
import * as postServices from '../../services/post/index';

import {connect} from 'react-redux';

function CreatePost(props) {
    const {t} = useTranslation();
    const [form] = Form.useForm();
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [streets, setStreets] = useState([]);
    const [wards, setWards] = useState([]);
    const [filter, setfilter] = useState({
        province: '',
        district: '',
        street: '',
        ward: ''
    });
    const [blocks, setBlocks] = useState([]);
    const [address, setAddress] = useState({
        number: '',
        addressTitle: '',
        location: {
            lat: 10.8225079,
            lng: 106.68809549999999
        }
    });
    const [addressNumber, setAddressNumber] = useState('');
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
    const [blockSelected, setBlockSelected] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [images, setImages] = useState([]);
    const router = useRouter();

    const layout = {
        labelCol: {span: 24},
        wrapperCol: {span: 24}
    };

    useEffect(() => {
        getLocal();

        // getBlocks();
    }, []);

    useEffect(() => {
       
        const province = provinces.find(province => province.code === filter.province.code);

        if (province) {
            const newDistricts = province.districts;

            setDistricts(newDistricts);

            const newDistrict = {
                id: newDistricts[0].id,
                name: newDistricts[0].name
            };

            setfilter({
                ...filter,
                district: newDistrict
            });
        }
    }, [filter.province]);

    useEffect(() => {
       
        const district = districts.find(district => district.name === filter.district.name);

        if (district) {
            const newStreets = district.streets;
            
            const newWards = district.wards;

            setStreets(newStreets);
            
            setWards(newWards);

            setfilter({
                ...filter,
                street: newStreets[0],
                ward: newWards[0]
            });
        }
    }, [filter.district]);

    // useEffect(() => {
    //     getDataRooms();
        
    // }, [blockSelected]);

    useEffect(() => {
        if (filter.province.name && filter.street.name && filter.district.name && filter.ward.name) {
            getGoeCode();
        }
    }, [filter, addressNumber]);

    const getGoeCode =  async () => {
        const value = `${addressNumber} ${filter.street.prefix} ${filter.street.name}, ${filter.ward.prefix} ${filter.ward.name}, ${filter.district.name}, ${filter.province.name}`;

        const getGoeCode = await axios({
            url: 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCfzCvAvH3FV0Rk1K7Y3yzo4QjCklT9mSU',
            method: 'GET',
            params: {address: value}

        });

        if (getGoeCode) {
            if (getGoeCode.data && getGoeCode.data.status === 'OK') {

                setAddress({
                    number: addressNumber,
                    addressTitle: value,
                    location: getGoeCode.data.results[0].geometry.location
                });
            }
        }

    };

    const getLocal = async () => {
        const getLocal = await import('../../Docs/json/local.json');

        if (getLocal) {
            let newProvinces = provinces.concat(getLocal.default);

            setProvinces(newProvinces);

            const newProvince = {
                id: newProvinces[0].id,
                code: newProvinces[0].code,
                name: newProvinces[0].name
            };

            setfilter({
                ...filter,
                province: newProvince
            });
        }
    };

    const getDataRooms = async () => {
        setIsLoading(true);

        const getRooms = await roomServices.getList({
            status: -1,
            idBlock: blockSelected.id,
            type: 'query'
        });

        if (getRooms) {
            if (getRooms.data && getRooms.data.data) {
                const {rooms = []} = getRooms.data.data;

                setRooms(rooms);
            }
        }

        setIsLoading(false);
    };

    // const getBlocks = async () => {
    //     const getBlocks = await blockServices.getList();

    //     if (getBlocks) {
    //         if (getBlocks.data && getBlocks.data.data) {
    //             const {blocks = []} = getBlocks.data.data;

    //             setBlocks(blocks);

    //             if (blocks.length > 0) {
    //                 const newBlock = {
    //                     id: blocks[0].id,
    //                     nameBlock: blocks[0].nameBlock
    //                 };
    
    //                 setBlockSelected(newBlock);
    //             }
    //         }
    //     }
    // };

    const onChangeOptionTypes = (value) => {
        const newOptionType = appConfig.optionTypes.find(type => type.id === value);

        setfilter({
            ...filter,
            optionType: newOptionType
        });
    };

    const onChangeProvinces = (value) => {
        let newProvince = provinces.find(province => province.code === value);

        newProvince = {
            id: newProvince.id,
            code: newProvince.code,
            name: newProvince.name
        };

        setfilter({
            ...filter,
            province: newProvince
        });
    };
    
    const onChangeWard = (value) => {
        let newWard = wards.find(ward => ward.id === value);

        if (newWard) {
            setfilter({
                ...filter,
                ward: newWard
            });
        }
    };

    const onChangeDistrict = (value) => {
        let newDistrict = districts.find(district => district.name === value);

        newDistrict = {
            id: newDistrict.id,
            name: newDistrict.name
        };

        setfilter({
            ...filter,
            district: newDistrict
        });
    };

    const onChangeStrict = (value) => {
        const newStreet = streets.find(street => street.id === value);

        setfilter({
            ...filter,
            street: newStreet
        });
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

    const onChangeBlock = (value) => {
        let newBlock = blocks.find(block => block.id === value);

        newBlock = {
            id: newBlock.id,
            nameBlock: newBlock.nameBlock
        };

        setBlockSelected(newBlock);
    };

    const showRenderRooms = () => {
        return rooms && rooms.length > 0 ? rooms.map(room => {

            return (
                <Col key={room.id}  className='flex-row box-room'>
                    <div className='status-room' style={{backgroundColor: room.status === 0 ? '#13c2c2' : '#f5222d'}}>
                        <strong className='name-room'>{room.nameRoom}</strong>
                        <i style={{fontSize: 40}} className='icon-airline_seat_individual_suite' />
                        <div className='desc-room'>
                            <Row style={{width: '100%'}} >
                                <Col span={4}><i className='icon-grouppeople' /></Col>
                                <Col span={20}>{room.maxPeople}</Col>
                            </Row>
                            <Row style={{width: '100%'}} >
                                <Col span={4}><i className='icon-attach_money' /></Col>
                                <Col span={20}>{numeral(room.price).format('0,0')}</Col>
                            </Row>
                        </div>
                    </div>
                </Col>
            );
        }) : <Col>{t('Khu trọ chưa có phòng truy cập ')}<a onClick={() => {window.open('http://localhost:8082/#/rooms-motel')}}>Vmotel</a> để tạo phòng.</Col>;
    };

    const onFinishForm = async (value) => {
        let newImages = [];

        setIsLoading(true);
        
        for (let image of images) {
            const uploadImages = await uploadServices.uploadImgbb({
                formData: image.data
            });

            if (uploadImages) {
                if (uploadImages.data && uploadImages.data.data) {
                    const {display_url} = uploadImages.data.data;

                    newImages.push(display_url);
                }
            }
        }

        const newForm = {
            ...value,
            filter,
            contact: props.userLogin.id,
            address: address,
            option: optionSelected,
            startTime: moment().format(),
            endTime: endDate(),
            images: newImages
        };

        setIsLoading(false);

        createPost(newForm);
    };

    const endDate = () => {
        switch (optionSelected.typeFee.id) {
            case 'days':
                return moment().add(optionSelected.rangeTime, 'days').format();                
        
            case 'months':
                return moment().add(optionSelected.rangeTime, 'months').format();                
        
            case 'weeks':
                return moment().add(optionSelected.rangeTime, 'weeks').format();                
        
            default:
                return moment().add(optionSelected.rangeTime, 'days').format(); 
        }
    };

    const createPost = async (post) => {
        setIsLoading(true);

        const create = await postServices.create(post);

        if (create) {
            if (create.data && create.data.data) {
                notification.success({
                    message: t('Success'),
                    description: t('You have create post success, please turn back home to see your post')
                });

                router.push('/quan-ly/quan-ly-tin');
            }
        }

        setIsLoading(false);
    };

    const callbackEditor = (html) => {
        form.setFieldsValue({
            description: html
        });
    };

    const callbackUpload = (images) => {
        setImages(images);
    };

    const onChangeStreet = (event) => {
        const {value} = event.target;
        
        setAddressNumber(value);
    };

    return (
        <Layout dashBoard>
            <Spin spinning={isLoading}>
                <h1 style={{fontSize: 30}}>{t('Post new')}</h1>
                <Divider />
                <div style={{color: '#f5222d'}}>
                    <div style={{fontSize: 25, color: '#434343'}}>{t('Address')}</div>
                    {t('(Lưu ý chọn đầy đủ và chính xác địa chỉ để bài viết được tiếp cận hiệu quả)')}
                </div>
                <div className='d-flex center filter-custom' style={{width: '100%', position: 'relative', top: 0, margin: '20px 0px'}}>
                    <Row className='inner-filter' gutter={[16, 16]}>
                        <Col xs={{span: 24}} md={{span: 6}}>
                            <div className='d-flex row left'>
                                <strong>{t('Provinces')}:</strong>
                                <Select
                                    showSearch
                                    style={{width: '100%'}}
                                    value={filter.province.code}
                                    onChange={onChangeProvinces}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {provinces && provinces.length > 0 && provinces.map(province => {
                                        return <Select.Option key={province.id} value={province.code}>{t(province.name)}</Select.Option>;
                                    })}
                                </Select>
                            </div>
                        </Col>
                        <Col xs={{span: 24}} md={{span: 6}}>
                            <div className='d-flex row left'>
                                <strong>{t('District')}:</strong>
                                <Select 
                                    showSearch
                                    style={{width: '100%'}} 
                                    value={filter.district.name} 
                                    onChange={onChangeDistrict}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {districts && districts.length > 0 && districts.map(district => {
                                        return <Select.Option key={district.name} value={district.name}>{t(district.name)}</Select.Option>;
                                    })}
                                </Select>
                            </div>
                        </Col>
                        <Col xs={{span: 24}} md={{span: 6}}>
                            <div className='d-flex row left'>
                                <strong>{t('Ward')}:</strong>
                                <Select 
                                    showSearch
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    style={{width: '100%'}}
                                    value={filter.ward.id}
                                    onChange={onChangeWard}
                                >
                                    {wards && wards.length > 0 && wards.map(ward => {
                                        return <Select.Option key={ward.id} value={ward.id}>{`${ward.prefix || ''} ${t(ward.name)}`}</Select.Option>;
                                    })}
                                </Select>
                            </div>
                        </Col>
                        <Col xs={{span: 24}} md={{span: 6}}>
                            <div className='d-flex row left'>
                                <strong>{t('Street')}:</strong>
                                <Select 
                                    showSearch
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    style={{width: '100%'}}
                                    value={filter.street.id}
                                    onChange={onChangeStrict}
                                >
                                    {streets && streets.length > 0 && streets.map(street => {
                                        return <Select.Option key={street.id} value={street.id}>{`${street.prefix || ''} ${t(street.name)}`}</Select.Option>;
                                    })}
                                </Select>
                            </div>
                        </Col>
                        <Col xs={{span: 24}} md={{span: 6}}>
                            <div className='d-flex row left'>
                                <strong>{t('Number')}:</strong>
                                <Input placeholder={t('Please input your number address')} onChange={onChangeStreet} value={addressNumber} />
                            </div>
                        </Col>
                        <Col xs={{span: 24}} md={{span: 18}}>
                            <div className='d-flex row left'>
                                <strong>{t('Address detail')}:</strong>
                                <Input disabled placeholder={t('Input address')} value={address.addressTitle} style={{width: '100%'}} />
                            </div>
                        </Col>
                    </Row>
                </div>
                <Row style={{width: '100%'}}>
                    <Col xs={{span: 24}} md={{span: 14}}>
                        <Form {...layout} onFinish={onFinishForm} form={form} name='form-information'>
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
                                rules={[
                                    {required: true, message: t('Please input the title!')},
                                    () => ({
                                        validator(rule, value) {
                                            if (!value || value.length >= 50 && value.length <= 225) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(t('Title must be more than 50 and less than 255 characters'));
                                        }
                                    })
                                ]}
                            >
                                <Input 
                                    placeholder={t('Input the title')}
                                />
                            </Form.Item>
                            <Form.Item
                                label={<strong>{t('Description')}</strong>}
                                name='description'
                            >
                                <Editor callback={callbackEditor} />
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
                                    min={0}
                                    max={50000000}
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
                                    max={500}
                                    placeholder={t('Input the area')}
                                    style={{width: 200}}
                                />
                            </Form.Item>
                            <div style={{fontSize: 25, color: '#434343', marginBottom: 20}}>{t('Images')}</div>
                            <Upload callback={callbackUpload} />
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
                            {/* <div style={{fontSize: 25, color: '#434343', marginBottom: 20}}>{t('Block')}</div> */}
                            {/* <div style={{marginBottom: 20}}>
                                {
                                    blocks && blocks.length > 0 ? <Select 
                                        style={{width: 200}} 
                                        placeholder={t('Select Block')}
                                        value={blockSelected.id}
                                        onChange={onChangeBlock}
                                    >
                                        {blocks && blocks.length > 0 && blocks.map(block => {
                                            return <Select.Option key={block.id} value={block.id}>{t(block.nameBlock)}</Select.Option>;
                                        })}
                                    </Select> : <div>{t('Bạn chưa tạo khu trọ phòng của Vmotel, Hãy truy cập ')}<a onClick={() => window.open('http://localhost:8082')}>{t('Vmotel')}</a> {t('để tạo.')}</div>
                                }
                                <Row gutter={[16, 16]} style={{marginTop: 10}}>
                                    {showRenderRooms()}
                                </Row>
                            </div> */}
                            <Form.Item>
                                <Button style={{width: '100%'}} type='primary' htmlType='submit'>{t('Pay and submit')} {`(${numeral(optionSelected.typeFee.fee[optionSelected.level.id] * optionSelected.rangeTime).format('0,0')})`}</Button>
                            </Form.Item>
                        </Form>
                    </Col>
                    <Col xs={{span: 24}} md={{span: 10}} style={{paddingLeft: '20px'}}>
                        <GoogleMap center={address.location} />
                        <div className={'notice-post'}>
                            <div style={{fontSize: 25, color: '#434343', marginBottom: 10}}>{t('Notice when add new post')}</div>
                            <p>Nội dung phải viết bằng tiếng Việt có dấu
Tiêu đề tin không dài quá 100 kí tự
Các bạn nên điền đầy đủ thông tin vào các mục để tin đăng có hiệu quả hơn.
Để tăng độ tin cậy và tin rao được nhiều người quan tâm hơn, hãy sửa vị trí tin rao của bạn trên bản đồ bằng cách kéo icon tới đúng vị trí của tin rao.
Tin đăng có hình ảnh rõ ràng sẽ được xem và gọi gấp nhiều lần so với tin rao không có ảnh. Hãy đăng ảnh để được giao dịch nhanh chóng!</p>
                        </div>
                    </Col>
                </Row>
            </Spin>
        </Layout>
    );
}

CreatePost.propTypes = {

};

const mapStateToProps = (state) => {
    return {
        userLogin: state.layout.userLogin
    };
};

export default connect(mapStateToProps, null)(CreatePost);

