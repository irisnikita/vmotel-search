import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { appConfig } from '../../../../constant';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import Slider from 'react-slick';
import numeral from 'numeral';
import moment from 'moment';
import { Row, Col, Descriptions, Button, Badge, Typography, Divider, Tag, Empty, Card, Avatar } from 'antd';

// Services
import * as postServices from '../../../../services/post/index';
import * as userServices from '../../../../services/User/index';

// Components
import Layout from '../../../../components/Layout/Layout';
import NormalCard from '../../../../components/NormalCard/NormalCard';

// Icons
import { FileDoneOutlined, SketchOutlined, CrownOutlined, RightOutlined, LeftOutlined, UserOutlined, PhoneOutlined } from '@ant-design/icons';

const { Title } = Typography;

const convertChar = (string) => {
    string = string.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .replace(/[^\w\s]/g, '')
        .replace(/\s/g, '-').toLowerCase();

    return string;
};

// This also gets called at build time
export async function getServerSideProps(props) {
    const { params = {} } = props;

    const id = params.post.match(/"([^"]*)"/g)[0].replace(/"/g, '');

    const res = await fetch(`${appConfig.API_VMOTEL}/post/get-post/${id}`)
    const data = await res.json();
    const { post = {} } = data.data;
    // Pass post data to the page via props
    return { props: { postInfo: post } }
}

function Post(props) {
    const { postInfo = {} } = props;
    const { t } = useTranslation();
    const meta = {
        image: postInfo.images[0],
        title: postInfo.title + `,${postInfo.filter.province.name}, ${postInfo.filter.district.name}`
    }
    const [postRelatives, setPostRelatives] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [user, setUser] = useState({})

    useEffect(() => {
        getPostsRelative()
    }, [])

    useEffect(() => {
        getUser()
    }, [postInfo])

    const getUser = async () => {
        const getUser = await userServices.getUser({
            id: postInfo.contact.id
        })

        if (getUser) {
            if (getUser.data && getUser.data.data) {
                const { user = {} } = getUser.data.data;

                setUser(user)
            }
        }
    }

    const getPostsRelative = async () => {
        setLoading(true);

        const getPosts = await postServices.getList({
            limit: 10,
            provinceCode: postInfo.filter.province.code,
            districtName: postInfo.filter.district.name
        })

        setLoading(false)

        if (getPosts) {
            if (getPosts.data && getPosts.data.data) {
                const { posts = {} } = getPosts.data.data;

                setPostRelatives(posts)
            }
        }

    }

    function SampleNextArrow(props) {
        const { className, style, onClick } = props;
        return (
            <div
                className={`${className} arrow`}
                style={{ ...style, zIndex: 1000, right: 20 }}
                onClick={onClick}
            >
                <RightOutlined />
            </div>
        );
    }

    function SamplePrevArrow(props) {
        const { className, style, onClick } = props;
        return (
            <div
                className={`${className} arrow`}
                style={{ ...style, left: 20, zIndex: 1000 }}
                onClick={onClick}
            >
                <LeftOutlined />
            </div>
        );
    }

    const showRenderNormalPosts = () => {
        if (isLoading) {
            const cols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

            return cols.map(col => {
                return <Col key={col} xs={{ span: 24 }} md={{ span: 8 }}>
                    <Card style={{ width: '100%' }} loading={isLoading} />
                </Col>;
            });
        } else {
            return postRelatives && postRelatives.length > 1 ? postRelatives.map(motel => {
                if (motel._id !== postInfo._id)
                    return (
                        <Col key={motel._id} xs={{ span: 24 }} md={{ span: 8 }}>
                            <NormalCard room={motel} />
                        </Col>
                    );
            }) : <Empty style={{ width: '100%', height: 200, marginTop: 20 }} />;
        }
    };

    const settings = {
        infinite: true,
        slidesToShow: 1,
        autoplay: true,
        slidesToScroll: 1,
        speed: 1000,
        dots: true,
        autoplaySpeed: 3000,
        cssEase: 'linear',
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />
    };

    const showRenderPackage = () => {
        switch (postInfo.option.level.id) {
            case 'hot':
                return <div style={{ color: '#ff7676' }}><SketchOutlined /> {t('Hot')}</div>
            case 'normal':
                return <div style={{ color: '#08979c' }}><FileDoneOutlined /> {t('Normal')}</div>
            case 'vip':
                return <div style={{ color: '#eb2f96' }}><CrownOutlined /> {t('Vip')}</div>
            default:
                break;
        }
    }

    const showRenderTitle = () => {
        switch (postInfo.option.level.id) {
            case 'hot':
                return <Title level={3} style={{ color: '#ff7676' }}>{postInfo.title}</Title>
            case 'normal':
                return <Title level={3} style={{ color: '#08979c' }}>{postInfo.title}</Title>
            case 'vip':
                return <Title level={3} style={{ color: '#eb2f96' }}>{postInfo.title}</Title>
            default:
                break;
        }

    }

    const onClickPhone = (phone) => {
        const element = document.createElement('textarea');

        element.value = phone;

        document.body.appendChild(element);

        element.select();

        document.execCommand('copy');

        document.body.removeChild(element)
    }

    return (
        <Layout {...meta}>
            <Row style={{ padding: 20 }}>
                <div style={{ width: '100%' }}>{showRenderTitle()}</div>
                <Col xs={{ span: 24 }} md={{ span: 16 }}>
                    <div className='d-flex list-menu-btn' >
                        <Button type='link' style={{ fontWeight: 500 }}>{t('GENERAL INFO')}</Button>
                        <Button type='link' style={{ fontWeight: 500 }}>{t('DETAILS')}</Button>
                        <Button type='link' style={{ fontWeight: 500 }}>{t('MAP')}</Button>
                        <Button type='link' style={{ fontWeight: 500 }}>{t('IMAGES')}</Button>
                    </div>
                    <Descriptions bordered>
                        <Descriptions.Item label={<strong>{t('Address')}</strong>} span={3}>{postInfo.address}</Descriptions.Item>
                        <Descriptions.Item label={<strong>{t('Type of post')}</strong>} span={1}>{postInfo.typePost}</Descriptions.Item>
                        <Descriptions.Item label={<strong>{t('Code')}</strong>} span={2}>{postInfo._id}</Descriptions.Item>
                        <Descriptions.Item label={<strong>{t('Province')}</strong>}>{postInfo.filter.province.name}</Descriptions.Item>
                        <Descriptions.Item label={<strong>{t('District')}</strong>}>{postInfo.filter.district.name}</Descriptions.Item>
                        <Descriptions.Item label={<strong>{t('Street')}</strong>}>{postInfo.filter.street.name}</Descriptions.Item>
                        <Descriptions.Item label={<strong>{t('Area')}</strong>}>{postInfo.area}m<sup>2</sup></Descriptions.Item>
                        <Descriptions.Item label={<strong>{t('Price')}</strong>}>{numeral(postInfo.price).format('0,0')}/{t('month')}</Descriptions.Item>
                        <Descriptions.Item label={<strong>{t('Status')}</strong>}> <Badge status="processing" text={t('Running')} /></Descriptions.Item>
                        <Descriptions.Item label={<strong>{t('Package')}</strong>}>{showRenderPackage()}</Descriptions.Item>
                        <Descriptions.Item label={<strong>{t('Date Submitted')}</strong>}>{moment(postInfo.startTime).format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
                        <Descriptions.Item label={<strong>{t('End date')}</strong>}>{moment(postInfo.endTime || new Date()).format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
                    </Descriptions>
                    <div className='description-post'>
                        <Title level={4}>{t('Description')}</Title>
                        <div dangerouslySetInnerHTML={{ __html: postInfo.description }}></div>
                        <Divider dashed></Divider>
                        <div>
                            <Tag color="magenta">{postInfo.filter.province.name}</Tag>
                            <Tag color="red">{postInfo.filter.district.name}</Tag>
                            <Tag color="volcano">{postInfo.filter.street.name}</Tag>
                        </div>
                    </div>
                    <div style={{ marginBottom: 30 }}>
                        <Title level={4}>{t('Images')}</Title>
                        <Slider {...settings}>
                            {
                                postInfo.images && postInfo.images.length > 0 ?
                                    postInfo.images.map(image => {
                                        return (
                                            <div key={image} className='wrapper-image'>
                                                <img src={image} className='image' alt={image}></img>
                                            </div>
                                        )
                                    }) : null
                            }
                        </Slider>
                        {
                            postInfo.images && postInfo.images.length <= 0 ? <div className='image-default' style={{ backgroundImage: 'url(/images/background-login.jpg)' }}><div style={{ height: 'max-content' }}>No Images</div></div> : null
                        }
                    </div>
                    <Title level={4}>{t('Cho thuê phòng trọ, căn hộ')}, {postInfo.filter.province.name}, {postInfo.filter.district.name}</Title>
                    <Row gutter={[16, 16]}>
                        {showRenderNormalPosts()}
                    </Row>
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 8 }}>
                    <div className='info-user'>
                        <Row>
                            <Col span={5}>
                                <Avatar size={70} icon={<UserOutlined />} src={user.image} />
                            </Col>
                            <Col span={19}>
                                <h1>{user.fullName}</h1>
                                <p>{user.email}</p>
                            </Col>
                        </Row>
                        <Button type='primary' onClick={() => onClickPhone(user.phoneNumber)} style={{ width: '100%' }} icon={<PhoneOutlined style={{ fontSize: 15 }} />}>
                            <a style={{ color: '#fff', marginLeft: 5, fontSize: 15 }}>{user.phoneNumber}</a>
                        </Button>
                    </div>
                </Col>
            </Row>
        </Layout>
    )
}

Post.propTypes = {

}

export default Post

