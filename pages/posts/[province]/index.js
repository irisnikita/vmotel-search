// Libraries

import React, {useEffect, useState} from 'react';
import {withRouter} from 'next/router';
import {Row, Col, Button, Divider, Select, Pagination, Card, Empty} from 'antd';
import {useTranslation} from 'react-i18next';
import {useRouter} from 'next/router';

// Components
import Layout from '../../../components/Layout/Layout';
import SliderCus from '../../../components/SliderCus/SliderCus';
import NormalCard from '../../../components/NormalCard/NormalCard';
import Category from '../../../components/Category';
import NewPost from '../../../components/NewPost';

// Utils
import {appConfig} from '../../../constant';

// Services
import * as postServices from '../../../services/post/index';

// Icons
import {SearchOutlined, FileDoneOutlined, UnorderedListOutlined, CheckCircleOutlined, DownOutlined, SketchOutlined} from '@ant-design/icons';

export async function getServerSideProps(props) {
    const {params = {}} = props;
    let posts = [];
    let total = 0;

    console.log('getServerSideProps -> params', params);

    const res = await fetch(`${appConfig.API_VMOTEL}/post/get-list?province=${params.province}`);
    const data = await res.json();

    if (data.data) {
        posts = data.data.posts || [];
        total = data.data.total || 0;
    }
    // Pass post data to the page via props
    return {props: {posts: posts, total, province: params.province}};
}

function Home(props) {
    // Props
    const {province} = props;

    // State
    const [provinces, setProvinces] = useState([{id: 0, code: 'ALL', name: 'all'}]);
    const [districts, setDistricts] = useState([{id: 'all', name: 'all'}]);
    const [streets, setStreets] = useState([{id: 'all', name: 'all'}]);
    const [filter, setfilter] = useState({
        optionType: 'all',
        province: 'ALL',
        district: 'all',
        street: 'all',
        prices: [0, 50],
        areas: [0, 50],
        page: 1,
        limit: 20
    });
    const [total, setTotal] = useState(20);
    const [isMount, setMount] = useState(false);
    const {t} = useTranslation();
    const [isLoading, setLoading] = useState(false);
    const [titleProvince, setTitleProvince] = useState('');
    const [normalPosts, setNormalPosts] = useState([]);

    const router = useRouter();

    useEffect(() => {
        getLocal();
    }, [props.province]);

    useEffect(() => {
        if (filter.province === 'ALL') {
            setDistricts([{
                id: 'all', name: 'all'
            }]);
        } else {
            const province = provinces.find(province => province.code === filter.province);

            if (province) {
                const newDistricts = [{id: 'all', name: 'all'}].concat(province.districts);

                setDistricts(newDistricts);
            }

        }

        if (!isMount && localStorage.getItem('filter')) {
            const newFilter = JSON.parse(localStorage.getItem('filter'));

            setfilter({
                ...filter,
                district: newFilter.district
            });
        } else {
            setfilter({
                ...filter,
                district: 'all'
            });
        }

    }, [filter.province]);

    useEffect(() => {
        if (filter.district === 'all') {
            setStreets([{id: 'all', name: 'all'}]);
        } else {
            const district = districts.find(district => district.name === filter.district);

            if (district) {
                const newStreets = [{id: 'all', name: 'all'}].concat(district.streets);

                setStreets(newStreets);
            }
        }
        if (!isMount && localStorage.getItem('filter')) {
            const newFilter = JSON.parse(localStorage.getItem('filter'));

            setfilter({
                ...filter,
                street: newFilter.street
            });
        } else {
            setfilter({
                ...filter,
                street: 'all'
            });
        }

    }, [filter.district]);

    const getLocal = async () => {
        const getLocal = await import('../../../Docs/json/local.json');

        if (getLocal) {
            const newProvinces = provinces.concat(getLocal.default);

            setProvinces(newProvinces);

            const province = getLocal.default.find(nProvince => convertChar(nProvince.name).toLowerCase() === props.province);

            if (province) {
                setTitleProvince(province.name);

                setfilter({
                    ...filter,
                    province: province.code
                });
            }
        }

        setMount(true);
    };

    useEffect(() => {
        getPostNormal();
    }, [filter]);

    const convertChar = (string) => {
        string = string.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D')
            .replace(/[^\w\s]/g, '')
            .replace(/\s/g, '-');

        return string;
    };

    const getPostNormal = async () => {
        setLoading(true);

        const getPostNormal = await postServices.getList({
            page: filter.page - 1,
            limit: filter.limit,
            areaStart: filter.areas[0] * 10,
            areaEnd: filter.areas[1] * 10,
            optionTypeId: filter.optionType,
            provinceCode: filter.province,
            districtName: filter.district,
            streetId: filter.street,
            priceStart: filter.prices[0] * 1000000,
            priceEnd: filter.prices[1] * 1000000,
            levelId: 'all'
        });

        if (getPostNormal) {
            if (getPostNormal.data && getPostNormal.data.data) {
                const {posts, total} = getPostNormal.data.data;

                setNormalPosts(posts || []);

                setTotal(total);
            }
        }

        setLoading(false);
    };

    const onChangeOptionTypes = (value) => {
        setfilter({
            ...filter,
            optionType: value
        });
    };

    const onChangeProvinces = (value) => {
        const province = provinces.find(nProvince => nProvince.code === value);

        if (province) {
            router.push('/posts/[province]', `/posts/${convertChar(province.name).toLowerCase()}`);
        }

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

    const onShowSizeChange = (current, pageSize) => {
        setfilter({
            ...filter,
            limit: pageSize
        });
    };

    const onChangePagination = (page) => {
        setfilter({
            ...filter,
            page
        });
    };

    const showRenderNormalPosts = () => {
        if (isLoading) {
            const cols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

            return cols.map(col => {
                return <Col key={col} xs={{span: 24}} md={{span: 8}}>
                    <Card style={{width: '100%'}} loading={isLoading} />
                </Col>;
            });
        } else {
            return normalPosts && normalPosts.length > 0 ? normalPosts.map(motel => {
                return (
                    <Col key={motel._id} xs={{span: 12}} md={{span: 8}}>
                        <NormalCard room={motel} />
                    </Col>
                );
            }) : <Empty style={{width: '100%', height: '200px'}} />;
        }
    };

    return (
        <Layout>
            <Row className='wrapper-index'>
                <div className='d-flex center filter-custom' style={{width: '100%'}}>
                    <Row className='inner-filter' gutter={[16, 16]}>
                        <Col xs={{span: 24}} md={{span: 4}}>
                            <div className='d-flex row left'>
                                <strong>{t('Select post')}:</strong>
                                <Select style={{width: '100%'}} value={filter.optionType} onChange={onChangeOptionTypes}>
                                    {appConfig.optionTypes && appConfig.optionTypes.length > 0 && appConfig.optionTypes.map(option => {
                                        return <Select.Option key={option.id} value={option.id}>{t(option.value)}</Select.Option>;
                                    })}
                                </Select>
                            </div>
                        </Col>
                        <Col xs={{span: 24}} md={{span: 4}}>
                            <div className='d-flex row left'>
                                <strong>{t('Provinces')}:</strong>
                                <Select
                                    style={{width: '100%'}}
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
                        <Col xs={{span: 24}} md={{span: 4}}>
                            <div className='d-flex row left'>
                                <strong>{t('District')}:</strong>
                                <Select style={{width: '100%'}} value={filter.district} onChange={onChangeDistrict}>
                                    {districts && districts.length > 0 && districts.map(district => {
                                        return <Select.Option key={district.name} value={district.name}>{t(district.name)}</Select.Option>;
                                    })}
                                </Select>
                            </div>
                        </Col>
                        <Col xs={{span: 24}} md={{span: 4}}>
                            <div className='d-flex row left'>
                                <strong>{t('Street')}:</strong>
                                <Select style={{width: '100%'}} value={filter.street} onChange={onChangeStrict}>
                                    {streets && streets.length > 0 && streets.map(street => {
                                        return <Select.Option key={street.id} value={street.id}>{`${street.prefix || ''} ${t(street.name)}`}</Select.Option>;
                                    })}
                                </Select>
                            </div>
                        </Col>
                        <Col xs={{span: 24}} md={{span: 4}}>
                            <SliderCus width='100%' defaultValue={filter.prices} wrapperTitle='price' title='Select prices' callback={callbackSliderPrice} />
                        </Col>
                        <Col xs={{span: 24}} md={{span: 4}}>
                            <SliderCus width='100%' defaultValue={filter.areas} wrapperTitle='area' type='area' min={0} max={50} step={1} title='Select area' callback={callbackSliderArea} />
                        </Col>
                    </Row>

                </div>
                <Row style={{width: '100%', marginTop: 20}} gutter={[10, 10]}>
                    <Col xs={{span: 24}} md={{span: 15}}>
                        <div className='d-flex' style={{marginBottom: '20px'}}>
                            <strong style={{color: '#08979c', fontSize: '25px'}}>{t(`Cho thuê phòng trọ căn hộ ${titleProvince}`)} - </strong>&nbsp;
                            <FileDoneOutlined style={{fontSize: 30, color: '#08979c'}} />
                        </div>
                        <Row gutter={[16, 16]}>
                            {showRenderNormalPosts()}
                        </Row>
                        <div className='d-flex center' style={{width: '100%'}}>
                            <Pagination total={total} onChange={onChangePagination} showSizeChanger defaultCurrent={1} pageSize={filter.limit} onShowSizeChange={onShowSizeChange} />
                        </div>
                    </Col>
                    <Col xs={{span: 24}} md={{span: 9}}>
                        <div className='d-flex' style={{margin: '0px 0px 20px 15px'}}>
                            <strong style={{color: '#f5222d', fontSize: '25px'}}>{t('DANH MỤC')} - </strong>&nbsp;
                            <UnorderedListOutlined style={{fontSize: 30, color: '#f5222d'}} />
                        </div>
                        <Category />
                        <div className='d-flex' style={{margin: '10px 0px 0px 15px'}}>
                            <strong style={{color: '#f5222d', fontSize: '25px'}}>{t('TIN MỚI ĐĂNG')} </strong>&nbsp;
                        </div>
                        <NewPost />
                    </Col>
                </Row>
            </Row>
        </Layout >
    );
}

export default withRouter(Home);

