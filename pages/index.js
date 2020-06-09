// Libraries
import React, {useEffect, useState} from 'react';
import {withRouter} from 'next/router';
import Link from 'next/link';
import Slider from 'react-slick';
import remark from 'remark';
import axios from 'axios';
import html from 'remark-html';
import {Row, Col, Button, Divider, Select} from 'antd';
import {useTranslation} from 'react-i18next';

// Components
import Layout from '../components/Layout/Layout';
import CustomCard from '../components/Card/Card';

// Utils
import {getListMarkDowns} from '../utils';
import {appConfig} from '../constant';

// Icons
import {SearchOutlined, CheckCircleOutlined, DownOutlined} from '@ant-design/icons';

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
    const [provinces, setProvinces] = useState([{id: 0, code: 'ALL', name: 'Tất cả'}]);
    const [districts, setDistricts] = useState([{id: 'all', name: 'Tất cả'}]);
    const [streets, setStreets] = useState([{id: 'all', name: 'Tất cả'}]);
    const [filter, setfilter] = useState({
        optionType: 'all',
        province: 'ALL',
        district: 'Tất cả',
        street: 'all'
    });
    const {t, i18n} = useTranslation();
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

    const settings = {
        infinite: true,
        centerMode: true,
        slidesToShow: 2,
        autoplay: true,
        slidesToScroll: 1,
        speed: 1000,
        dots: true,
        autoplaySpeed: 3000,
        cssEase: 'linear'
    };

    useEffect(() => {
        getLocal();
    }, []);

    useEffect(() => {
        if (filter.province === 'ALL') {
            setDistricts([{
                id: 'all', name: 'Tất cả'
            }]);
        } else {
            const province = provinces.find(province => province.code === filter.province);

            const newDistricts = [{id: 'all', name: 'Tất cả'}].concat(province.districts);

            setDistricts(newDistricts);
        }

        setfilter({
            ...filter,
            district: 'Tất cả'
        });

    }, [filter.province]);

    useEffect(() => {
        if (filter.district === 'Tất cả') {
            setStreets([{id: 'all', name: 'Tất cả'}]);
        } else {
            const district = districts.find(district => district.name === filter.district);

            const newStreets = [{id: 'all', name: 'Tất cả'}].concat(district.streets);

            setStreets(newStreets);
        }

        setfilter({
            ...filter,
            street: 'all'
        });
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
        }
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

    return (
        <Layout>
            <Row style={{padding: '20px 50px'}}>
                <Col xs={{span: 24}} md={{span: 10}}>
                    <div className='d-flex'>
                        <div style={{fontSize: 60, fontWeight: 600}}>Vmotel-Search </div>
                        <CheckCircleOutlined style={{fontSize: 30, position: 'relative', left: '-5px', top: '-10px', color: '#5cdbd3'}} />
                    </div>
                    <div style={{fontSize: 20, fontWeight: 500}}>Trang web tìm kiếm nhà trọ, căn hộ, phòng ở.</div>
                    <section style={{marginTop: 10, width: 400}}>
                        <p>Bạn lo lắng khi không tìm được nơi ở, chi phí quá cao, an ninh không tốt, phòng xuống cấp trật chội. Với
						Vmotel-Search, bạn không những có thể tìm được phòng ưng ý, chi phí thấp, an ninh tốt mà còn xem được chất lượng
						và uy tín của phòng trọ, căn hộ.
                        </p>
                    </section>
                    <Button type='ghost' style={{border: '1px solid #13c2c2', color: '#13c2c2'}} shape='round' icon={<SearchOutlined />}>Tìm phòng</Button>
                    <Row gutter={[16, 16]} style={{marginTop: 20, width: '90%', fontSize: 12}}>
                        <Col xs={{span: 24}} md={{span: 24}}>
                            <Row>
                                <Col span={18}>
                                    <strong>Phòng đẹp, sạch sẽ</strong>
                                    <p>Vmotel sẽ ưu tiên đề xuất những căn phòng mang lại không gian đẹp, thoáng mát, thoải mái.</p>
                                </Col>
                                <Divider type='vertical' style={{height: 'unset', borderLeft: '2px solid #f0f0f0'}} />
                                <Col span={5}>
                                    <div className={'d-flex center'} style={{height: '100%', borderRight: '1px solid f0f0f0'}}>
                                        <img src='/images/bed.svg' style={{width: 50}} />
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={{span: 24}} md={{span: 24}}>
                            <Row>
                                <Col span={18}>
                                    <strong>Chi phí hợp lý, giá rẻ</strong>
                                    <p>Đối với những sinh viên lên thành phố học, kinh tế hạn hẹp, Vmotel sẽ tìm cho bạn những căn phòng vừa hợp túi tiền</p>
                                </Col>
                                <Divider type='vertical' style={{height: 'unset', borderLeft: '2px solid #f0f0f0'}} />
                                <Col span={5}>
                                    <div className={'d-flex center'} style={{height: '100%', borderRight: '1px solid f0f0f0'}}>
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
                <Row style={{width: '100%'}} className={'filter-custom'} gutter={[16, 16]}>
                    <Col xs={{span: 24}} md={{span: 4}}>
                        <div className='d-flex row left'>
                            <strong>Chọn tin:</strong>
                            <Select style={{width: 200}} value={filter.optionType} onChange={onChangeOptionTypes}>
                                {appConfig.optionTypes && appConfig.optionTypes.length > 0 && appConfig.optionTypes.map(option => {
                                    return <Select.Option key={option.id} value={option.id}>{option.value}</Select.Option>;
                                })}
                            </Select>
                        </div>
                    </Col>
                    <Col xs={{span: 24}} md={{span: 4}}>
                        <div className='d-flex row left'>
                            <strong>Tỉnh thành:</strong>
                            <Select 
                                style={{width: 200}} 
                                value={filter.province} 
                                onChange={onChangeProvinces}
                                placeholder={'hello'}
                            >
                                {provinces && provinces.length > 0 && provinces.map(province => {
                                    return <Select.Option key={province.id} value={province.code}>{province.name}</Select.Option>;
                                })}
                            </Select>
                        </div>
                    </Col>
                    <Col xs={{span: 24}} md={{span: 4}}>
                        <div className='d-flex row left'>
                            <strong>Quận huyện:</strong>
                            <Select style={{width: 200}} value={filter.district} onChange={onChangeDistrict}>
                                {districts && districts.length > 0 && districts.map(district => {
                                    return <Select.Option key={district.name} value={district.name}>{district.name}</Select.Option>;
                                })}
                            </Select>
                        </div>
                    </Col>
                    <Col xs={{span: 24}} md={{span: 4}}>
                        <div className='d-flex row left'>
                            <strong>Đường:</strong>
                            <Select style={{width: 200}} value={filter.street} onChange={onChangeStrict}>
                                {streets && streets.length > 0 && streets.map(street => {
                                    return <Select.Option key={street.id} value={street.id}>{`${street.prefix || ''} ${street.name}`}</Select.Option>;
                                })}
                            </Select>
                        </div>
                    </Col>
                </Row>
            </Row >
        </Layout >
    );
}

export default withRouter(Home);