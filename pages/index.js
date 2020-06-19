// Libraries
import React, {useEffect, useState} from 'react';
import {withRouter} from 'next/router';
import Link from 'next/link';
import Slider from 'react-slick';
import remark from 'remark';
import axios from 'axios';
import html from 'remark-html';
import {Row, Col, Button, Divider, Select, Pagination, Card, Empty} from 'antd';
import {useTranslation} from 'react-i18next';

// Components
import Layout from '../components/Layout/Layout';
import CustomCard from '../components/Card/Card';
import SliderCus from '../components/SliderCus/SliderCus';
import FeeCard from '../components/FeeCard/FeeCard';
import NormalCard from '../components/NormalCard/NormalCard';

// Utils
import {getListMarkDowns} from '../utils';
import {appConfig} from '../constant';

// Services
import * as postServices from '../services/post/index';

// Icons
import {SearchOutlined, FileDoneOutlined, UnorderedListOutlined, CheckCircleOutlined, DownOutlined, SketchOutlined} from '@ant-design/icons';

export async function getStaticProps() {
    const allMarkDown = getListMarkDowns();

    return {
        props: {
            allMarkDown,
            namespacesRequired: ['common', 'footer']
        }
    };
}

function Home(props) {
    const [introduces, setIntroduces] = useState([]);
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
    const [rooms, setRooms] = useState([
        {
            id: 1,
            price: 3000000,
            title: 'Phòng trọ nguyên căn, mới xây, đầy đủ tiện nghi',
            province: 'Hồ Chí Minh',
            district: 'Quận 1',
            square: 20,
            address: '66/9 Bình lợi, P.13, Quận.Bình Thạnh',
            description: 'Phòng trọ lớn, sạch sẽ có chỗ để xe an toàn, an ninh cao, mới xây, gần chợ khu trung tâm giải trí',
            images: ['/images/rooms/phong-tro-1.jpg', '/images/rooms/phong-tro-2.jpg', '/images/rooms/phong-tro-3.jpg']
        },
        {
            id: 2,
            price: 2500000,
            title: 'Phòng cho thuê chính chủ 985/24 Âu Cơ, Quận Tân Phú',
            province: 'Hồ Chí Minh',
            district: 'Quận Tân Phú',
            square: 20,
            address: '985/24 Âu Cơ, phường Tân Sơn Nhì, quận Tân Phú, TP.HCM',
            description: 'Phòng mới xây sạch sẽ, đẹp, thoáng mát, có bếp riêng, thang máy, lối vào cửa tự do, bảo vệ 24/24.',
            images: ['/images/rooms/phong-tro-4.jpg', '/images/rooms/phong-tro-5.jpg', '/images/rooms/phong-tro-6.jpg']
        },
        {
            id: 3,
            price: 3000000,
            title: 'Phòng trọ nguyên căn, mới xây, đầy đủ tiện nghi',
            province: 'Hồ Chí Minh',
            district: 'Quận 1',
            square: 20,
            address: '66/9 Bình lợi, P.13, Quận.Bình Thạnh',
            description: 'Phòng trọ lớn, sạch sẽ có chỗ để xe an toàn, an ninh cao, mới xây, gần chợ khu trung tâm giải trí',
            images: ['/images/rooms/phong-tro-1.jpg', '/images/rooms/phong-tro-2.jpg', '/images/rooms/phong-tro-3.jpg']
        },
        {
            id: 4,
            price: 3000000,
            title: 'Phòng trọ nguyên căn, mới xây, đầy đủ tiện nghi',
            province: 'Hồ Chí Minh',
            district: 'Quận 1',
            square: 20,
            address: '66/9 Bình lợi, P.13, Quận.Bình Thạnh',
            description: 'Phòng trọ lớn, sạch sẽ có chỗ để xe an toàn, an ninh cao, mới xây, gần chợ khu trung tâm giải trí',
            images: ['/images/rooms/phong-tro-1.jpg', '/images/rooms/phong-tro-2.jpg', '/images/rooms/phong-tro-3.jpg']
        }
    ]);
    const [isLoading, setLoading] = useState(false);

    const [feeMotels, setFeeMotels] = useState([
        {
            id: 1,
            price: 3000000,
            title: 'Phòng trọ nguyên căn, mới xây, đầy đủ tiện nghi',
            province: {id: '1', code: 'SG', name: 'Hồ Chí Minh'},
            district: {id: '12', name: 'Quận 11'},
            dateCreate: '13/06/2020',
            street: {id: '3371', name: 'Hồng Bàng', prefix: 'Đường'},
            area: 20,
            address: '708/19/12 Đường Hồng Bàng, Phường 1, Quận 11, Hồ Chí Minh',
            description: 'Phòng trọ lớn, sạch sẽ có chỗ để xe an toàn, an ninh cao, mới xây, gần chợ khu trung tâm giải trí',
            images: ['/images/rooms/phong-tro-1.jpg', '/images/rooms/phong-tro-2.jpg', '/images/rooms/phong-tro-3.jpg']
        },
        {
            id: 2,
            price: 2500000,
            title: 'Phòng cho thuê chính chủ 985/24 Âu Cơ, Quận Tân Phú',
            province: {id: '1', code: 'SG', name: 'Hồ Chí Minh'},
            district: {id: '12', name: 'Quận 11'},
            dateCreate: '13/06/2020',
            street: {id: '3371', name: 'Hồng Bàng', prefix: 'Đường'},
            area: 20,
            address: '985/24 Âu Cơ, phường Tân Sơn Nhì, quận Tân Phú, TP.HCM',
            description: 'Phòng mới xây sạch sẽ, đẹp, thoáng mát, có bếp riêng, thang máy, lối vào cửa tự do, bảo vệ 24/24.',
            images: ['/images/rooms/phong-tro-4.jpg', '/images/rooms/phong-tro-5.jpg', '/images/rooms/phong-tro-6.jpg']
        },
        {
            id: 3,
            price: 3000000,
            title: 'Phòng trọ nguyên căn, mới xây, đầy đủ tiện nghi',
            province: {id: '1', code: 'SG', name: 'Hồ Chí Minh'},
            district: {id: '12', name: 'Quận 11'},
            dateCreate: '13/06/2020',
            street: {id: '3371', name: 'Hồng Bàng', prefix: 'Đường'},
            area: 20,
            address: '66/9 Bình lợi, P.13, Quận.Bình Thạnh',
            description: 'Phòng trọ lớn, sạch sẽ có chỗ để xe an toàn, an ninh cao, mới xây, gần chợ khu trung tâm giải trí',
            images: ['/images/rooms/phong-tro-1.jpg', '/images/rooms/phong-tro-2.jpg', '/images/rooms/phong-tro-3.jpg']
        },
        {
            id: 4,
            price: 3000000,
            title: 'Phòng trọ nguyên căn, mới xây, đầy đủ tiện nghi',
            province: {id: '1', code: 'SG', name: 'Hồ Chí Minh'},
            dateCreate: '13/06/2020',
            district: {id: '12', name: 'Quận 11'},
            street: {id: '3371', name: 'Hồng Bàng', prefix: 'Đường'},
            area: 20,
            address: '66/9 Bình lợi, P.13, Quận.Bình Thạnh',
            description: 'Phòng trọ lớn, sạch sẽ có chỗ để xe an toàn, an ninh cao, mới xây, gần chợ khu trung tâm giải trí',
            images: ['/images/rooms/phong-tro-1.jpg', '/images/rooms/phong-tro-2.jpg', '/images/rooms/phong-tro-3.jpg']
        },
        {
            id: 5,
            price: 3000000,
            title: 'Phòng trọ nguyên căn, mới xây, đầy đủ tiện nghi',
            province: {id: '1', code: 'SG', name: 'Hồ Chí Minh'},
            district: {id: '12', name: 'Quận 11'},
            dateCreate: '13/06/2020',
            street: {id: '3371', name: 'Hồng Bàng', prefix: 'Đường'},
            area: 20,
            address: '66/9 Bình lợi, P.13, Quận.Bình Thạnh',
            description: 'Phòng trọ lớn, sạch sẽ có chỗ để xe an toàn, an ninh cao, mới xây, gần chợ khu trung tâm giải trí',
            images: ['/images/rooms/phong-tro-1.jpg', '/images/rooms/phong-tro-2.jpg', '/images/rooms/phong-tro-3.jpg']
        },
        {
            id: 6,
            price: 3000000,
            title: 'Phòng trọ nguyên căn, mới xây, đầy đủ tiện nghi',
            province: {id: '1', code: 'SG', name: 'Hồ Chí Minh'},
            district: {id: '12', name: 'Quận 11'},
            dateCreate: '13/06/2020',
            street: {id: '3371', name: 'Hồng Bàng', prefix: 'Đường'},
            area: 20,
            address: '66/9 Bình lợi, P.13, Quận.Bình Thạnh',
            description: 'Phòng trọ lớn, sạch sẽ có chỗ để xe an toàn, an ninh cao, mới xây, gần chợ khu trung tâm giải trí',
            images: ['/images/rooms/phong-tro-1.jpg', '/images/rooms/phong-tro-2.jpg', '/images/rooms/phong-tro-3.jpg']
        }
    ]);

    const [normalPosts, setNormalPosts] = useState([]);
    const [hotPosts, setHotPosts] = useState([]);

    const settings = {
        infinite: true,
        centerMode: true,
        slidesToShow: 2,
        autoplay: true,
        slidesToScroll: 1,
        speed: 1000,
        dots: true,
        autoplaySpeed: 3000,
        cssEase: 'linear',
        responsive: [
            {
                breakpoint: 600,
                settings: {
                    centerMode: false,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            }
        ]
    };

    useEffect(() => {
        getLocal();

        getHotPosts();
    }, []);

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

    useEffect(() => {
        getMarkDown().then(introduces => {
            setIntroduces(introduces);
        });

    }, [props.allMarkDown]);

    const getLocal = async () => {
        const getLocal = await import('../Docs/json/local.json');

        if (getLocal) {
            const newProvinces = provinces.concat(getLocal.default);

            setProvinces(newProvinces);

            if (localStorage.getItem('filter')) {
                const newFilter = JSON.parse(localStorage.getItem('filter'));

                setfilter({
                    ...filter,
                    province: newFilter.province,
                    optionType: newFilter.optionType,
                    prices: newFilter.prices,
                    areas: newFilter.areas
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

    const getHotPosts = async () => {
        const getHotPosts = await postServices.getList({
            limit: 6,
            levelId: 'hot'
        });

        if (getHotPosts) {
            if (getHotPosts.data && getHotPosts.data.data) {
                const {posts} = getHotPosts.data.data;

                setHotPosts(posts || []);
            }
        }
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
            levelId: 'normal'
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
   
    const getMarkDown = async () => {
        let newIntroduces = [];

        for (let markdown of props.allMarkDown) {
            if (markdown.contentHtml) {
                // Use remark to convert markdown into HTML string
                const processedContent = await remark()
                    .use(html)
                    .process(markdown.contentHtml);

                const contentHtml = processedContent.toString();

                newIntroduces.push({
                    ...markdown,
                    contentHtml: contentHtml
                });
            }
        }

        return newIntroduces;
    };

    const showRenderSologan = () => {
        const newProvince = provinces.find(province => province.code === filter.province);
        const district = districts.find(district => district.name === filter.district);
        const street = streets.find(street => street.id === filter.street);

        if (newProvince && district && street) {
            switch (filter.province) {
                case 'all':
                    switch (filter.district) {
                        case 'all':
                            return (
                                <>
                                    <h1>{t('Cho thuê phòng trọ số 1, giá rẻ, tiện nghi, an toàn, uy tín Việt Nam')} {filter.street !== 'all' && ` Đường ${street.name}`}</h1>
                                    <p>Bạn sợ lừa đảo, an ninh không an toàn, giá bị hớ, với Vmotel bạn có thể an tâm khi chọn phòng.</p>
                                </>
                            );

                        default:
                            return (
                                <>
                                    <h1>{t(`Cho thuê phòng trọ số 1, Quận ${district.name}, giá rẻ, tiện nghi, an toàn, uy tín Việt Nam `)} {filter.street !== 'all' && ` Đường ${street.name}`}</h1>
                                    <p>Bạn sợ lừa đảo, an ninh không an toàn, giá bị hớ, với Vmotel bạn có thể an tâm khi chọn phòng.</p>
                                </>
                            );
                    }
                default:
                    return (
                        <>
                            <h1>{t(`Cho thuê phòng trọ ${t(newProvince.name)}, ${district.name !== 'all' ? `Quận ${district.name}` : ''}, giá rẻ, tiện nghi, an toàn, uy tín Việt Nam`)}{filter.street !== 'all' && ` Đường ${street.name}`}</h1>
                            <p>Bạn sợ lừa đảo, an ninh không an toàn, giá bị hớ, với Vmotel bạn có thể an tâm khi chọn phòng.</p>
                        </>
                    );
            }
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
            const cols = [1,2,3,4,5,6,7,8,9,10,11,12];

            return cols.map(col => {
                return <Col key={col} xs={{span: 24}} md={{span: 8}}>
                    <Card style={{width: '100%'}} loading={isLoading} />
                </Col>;
            }); 
        } else {
            return normalPosts && normalPosts.length > 0 ? normalPosts.map(motel => {
                return (
                    <Col key={motel._id} xs={{span: 24}} md={{span: 8}}>
                        <NormalCard room={motel} />
                    </Col>
                );
            }) : <Empty style={{width: '100%', height: '200px'}} />;
        }
    };

    return (
        <Layout>
            <Row className='wrapper-index'>
                <Col xs={{span: 24}} md={{span: 10}}>
                    <div className='d-flex'>
                        <div style={{fontSize: 60, fontWeight: 600}} className='logo-title'>Vmotel-Search </div>
                        <CheckCircleOutlined style={{fontSize: 30, position: 'relative', left: '-5px', top: '-10px', color: '#5cdbd3'}} />
                    </div>
                    <div style={{fontSize: 20, fontWeight: 500}}>{t('Website to search motel, apartment')}</div>
                    <section style={{marginTop: 10, maxWidth: 400}}>
                        <p>{t('introduce')}</p>
                    </section>
                    <Button type='ghost' style={{border: '1px solid #13c2c2', color: '#13c2c2'}} shape='round' icon={<SearchOutlined />}>{t('search-room')}</Button>
                    <Row gutter={[16, 16]} style={{marginTop: 20, width: '90%', fontSize: 12}}>
                        <Col xs={{span: 24}} md={{span: 24}}>
                            <Row>
                                <Col xs={{span: 18}} md={{span: 18}}>
                                    <strong>Phòng đẹp, sạch sẽ</strong>
                                    <p>Vmotel sẽ ưu tiên đề xuất những căn phòng mang lại không gian đẹp, thoáng mát, thoải mái.</p>
                                </Col>
                                <Divider type='vertical' style={{height: 'unset', borderLeft: '2px solid #f0f0f0'}} />
                                <Col xs={{span: 4}} md={{span: 5}}>
                                    <div className={'d-flex center'} style={{height: '100%', width: '100%', borderRight: '1px solid f0f0f0'}}>
                                        <img src='/images/bed.svg' style={{width: 50}} />
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={{span: 24}} md={{span: 24}}>
                            <Row>
                                <Col xs={{span: 18}} md={{span: 18}}>
                                    <strong>Chi phí hợp lý, giá rẻ</strong>
                                    <p>Đối với những sinh viên lên thành phố học, kinh tế hạn hẹp, Vmotel sẽ tìm cho bạn những căn phòng vừa hợp túi tiền</p>
                                </Col>
                                <Divider type='vertical' style={{height: 'unset', borderLeft: '2px solid #f0f0f0'}} />
                                <Col sxs={{span: 4}} md={{span: 5}}>
                                    <div className={'d-flex center'} style={{height: '100%', width: '100%', borderRight: '1px solid f0f0f0'}}>
                                        <img src='/images/money.svg' style={{width: 50}} />
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <div className='d-flex center' style={{width: '100%'}}>
                            <Button type='link' icon={<DownOutlined />}>Xem thêm</Button>
                        </div>
                    </Row>
                </Col>
                <Col xs={{span: 24}} md={{span: 14}}>
                    <div className='d-flex center slick-custom' style={{height: '100%'}}>
                        <Slider {...settings} className='react-slick'>
                            {rooms.length > 0 && rooms.map(room => (
                                <div key={room.id} className='item-slick'>
                                    <CustomCard
                                        room={room}
                                    />
                                </div>
                            ))}
                        </Slider>
                    </div>
                </Col>
                <div className='d-flex center filter-custom' style={{width: '100%', marginTop: '20px'}}>
                    <Row className='inner-filter' gutter={[16, 16]}>
                        <Col xs={{span: 24}} md={{span: 4}}>
                            <div className='d-flex row left'>
                                <strong>{t('Select post')}:</strong>
                                <Select style={{width: 200}} value={filter.optionType} onChange={onChangeOptionTypes}>
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
                                    style={{width: 200}}
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
                                <Select style={{width: 200}} value={filter.district} onChange={onChangeDistrict}>
                                    {districts && districts.length > 0 && districts.map(district => {
                                        return <Select.Option key={district.name} value={district.name}>{t(district.name)}</Select.Option>;
                                    })}
                                </Select>
                            </div>
                        </Col>
                        <Col xs={{span: 24}} md={{span: 4}}>
                            <div className='d-flex row left'>
                                <strong>{t('Street')}:</strong>
                                <Select style={{width: 200}} value={filter.street} onChange={onChangeStrict}>
                                    {streets && streets.length > 0 && streets.map(street => {
                                        return <Select.Option key={street.id} value={street.id}>{`${street.prefix || ''} ${t(street.name)}`}</Select.Option>;
                                    })}
                                </Select>
                            </div>
                        </Col>
                        <Col xs={{span: 24}} md={{span: 4}}>
                            <SliderCus defaultValue={filter.prices} wrapperTitle='price' title='Select prices' callback={callbackSliderPrice} />
                        </Col>
                        <Col xs={{span: 24}} md={{span: 4}}>
                            <SliderCus defaultValue={filter.areas} wrapperTitle='area' type='area' min={0} max={50} step={1} title='Select area' callback={callbackSliderArea} />
                        </Col>
                    </Row>
                
                </div>
                <Row style={{width: '100%', margin: '20px 0px'}}>
                    <div className='d-flex row left'>
                        {showRenderSologan()}
                    </div>
                </Row>
                <Row style={{width: '100%', margin: '20px 0px'}}>
                    <div className='d-flex'>
                        <strong className='gradient-text'>{t('TIN NỔI BẬT')} - </strong>&nbsp;
                        <SketchOutlined style={{fontSize: 30, color: '#ff7676'}} />
                    </div>
                </Row>
                <Row style={{width: '100%', margin: '20px 0px'}} gutter={[16,16]}>
                    {hotPosts && hotPosts.length > 0 ? hotPosts.map(post => {
                        return (
                            <Col key={post._id} xs={{span: 24}} md={{span: 12}}>
                                <FeeCard post={post} />
                            </Col>
                        );
                    }) : null}
                </Row>
                <Row style={{width: '100%'}}>
                    <Col xs={{span: 24}} md={{span: 16}}>
                        <div className='d-flex' style={{marginBottom: '20px'}}>
                            <strong style={{color: '#08979c', fontSize: '25px'}}>{t('TIN MỚI')} - </strong>&nbsp;
                            <FileDoneOutlined style={{fontSize: 30, color: '#08979c'}} />
                        </div>
                        <Row gutter={[16, 16]}>
                            {showRenderNormalPosts()}
                        </Row>
                        <div className='d-flex center' style={{width: '100%'}}>
                            <Pagination total={total} onChange={onChangePagination} showSizeChanger defaultCurrent={1} pageSize={filter.limit} onShowSizeChange={onShowSizeChange} />
                        </div>
                    </Col>
                    <Col xs={{span: 24}} md={{span: 8}}>
                        <div className='d-flex' style={{marginBottom: '20px'}}>
                            <strong style={{color: '#f5222d', fontSize: '25px'}}>{t('DANH MỤC')} - </strong>&nbsp;
                            <UnorderedListOutlined style={{fontSize: 30, color: '#f5222d'}} />
                        </div>
                    </Col>
                </Row>
            </Row>
        </Layout >
    );
}

export default withRouter(Home);