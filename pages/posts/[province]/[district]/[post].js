import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { appConfig } from '../../../../constant';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import Slider from 'react-slick';
import numeral from 'numeral';
import moment from 'moment';
import { Row, Col, Descriptions, Button, Badge, Typography, Divider, Tag } from 'antd';
import axios from 'axios';
import * as postServices from '../../../../services/post/index';

import Layout from '../../../../components/Layout/Layout';

import { FileDoneOutlined, SketchOutlined, CrownOutlined, RightOutlined, LeftOutlined } from '@ant-design/icons';

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

// export async function getStaticPaths() {
//     const res = await fetch(`${appConfig.API_VMOTEL}/post/get-paths`);
//     const posts = await res.json();
//     const { paths = [] } = posts.data;

//     const newPaths = paths.map(path => {
//         const title = convertChar(path.title);
//         const province = convertChar(path.filter.province.name)
//         const district = convertChar(path.filter.district.name)
//         const id = path._id;

//         return {
//             params: {
//                 post: title + `"${id}"`,
//                 province,
//                 district,
//             }
//         }
//     })

//     return {
//         paths: newPaths,
//         fallback: false // See the "fallback" section below
//     };
// }

// This also gets called at build time
export async function getServerSideProps(props) {
    const { params = {} } = props;

    const id = params.post.match(/"([^"]*)"/g)[0].replace(/"/g, '');

    const res = await fetch(`${appConfig.API_VMOTEL}/post/get-post/${id}`)
    const data = await res.json();

    // Pass post data to the page via props
    return { props: { postInfo: data.data.post } }
}

function Post(props) {
    const { postInfo } = props;
    const { t } = useTranslation();
    const meta = {
        image: postInfo.images[0],
        title: postInfo.title + `,${postInfo.filter.province.name}, ${postInfo.filter.district.name}`
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
                    <div>
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
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 8 }}></Col>
            </Row>
        </Layout>
    )
}

Post.propTypes = {

}

export default Post

