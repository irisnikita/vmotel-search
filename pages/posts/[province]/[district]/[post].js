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
import * as commentServices from '../../../../services/comment/index';

// Components
import Layout from '../../../../components/Layout/Layout';
import NormalCard from '../../../../components/NormalCard/NormalCard';
import CommentBox from '../../../../components/CommentBox/CommentBox';
import CommentItem from '../../../../components/CommentItem/CommentItem';

// Icons
import { FileDoneOutlined, SketchOutlined, CrownOutlined, RightOutlined, EditOutlined, LeftOutlined, UserOutlined, PhoneOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import GoogleMap from '../../../../components/GoogleMap/GoogleMap';

const { Title } = Typography;

// This also gets called at build time
export async function getServerSideProps(props) {
    const { params = {} } = props;
    let post = {};

    const id = params.post.match(/"([^"]*)"/g)[0].replace(/"/g, '');
    console.log(id)

    const res = await fetch(`${appConfig.API_VMOTEL}/post/get-post/${id}`)
    const data = await res.json();

    if(data.data) {
        post = data.data.post;
    }
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
    const [comments, setComments] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        getPostsRelative()
    }, [])

    useEffect(() => {
        getComments();
    }, [postInfo])

    const getComments = async () => {
        const getComments = await commentServices.getList({
            postId: postInfo._id
        })

        if(getComments) {
            if(getComments.data && getComments.data.data) {
                const {comments = []} = getComments.data.data;

                setComments(comments)
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
            }) : <Empty style={{ width: '100%', height: 300, marginTop: 20 }} description={t('No data')}/>;
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
                return <Title level={3} style={{ color: '#9e1068', fontWeight: 500 }}>{postInfo.title}</Title>
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

    const onClickEdit = () => {
        router.push('/posts/sua-tin/[id]', `/posts/sua-tin/${postInfo._id}`)
    }

    const showRenderComments = () => {
        return comments.length > 0 ? comments.map(comment => {
            const newComment = {
                contact: comment.contactId ? comment.contactId : comment.contact,
                rate: comment.rate,
                description: comment.description,
                dateCreate: comment.dateCreate
            }
            return <CommentItem comment={newComment} key={comment._id}/>
        }) : <Empty style={{ width: '100%', height: 300, marginTop: 20 }} description={t('No data')}/>
    }

    const callbackCommentBox = () => {
        getComments();
    }

    return (
        <Layout {...meta}>
            <Row style={{ padding: 20 }}>
                <div style={{ width: '100%' }} id='info'>{showRenderTitle()}</div>
                <Col xs={{ span: 24 }} md={{ span: 16 }}>
                    <Row className='d-flex list-menu-btn space-between'>
                        <Col className='d-flex'>
                            <a href='#info'><Button type='link' style={{ fontWeight: 500 }}>{t('GENERAL INFO')}</Button></a>
                            <a href='#details'><Button type='link' style={{ fontWeight: 500 }}>{t('DETAILS')}</Button></a>
                            <a href='#map'><Button type='link' style={{ fontWeight: 500 }}>{t('MAP')}</Button></a>
                            <a href='#images'><Button type='link' style={{ fontWeight: 500 }}>{t('IMAGES')}</Button></a>
                        </Col>
                        <Col>
                            {postInfo.contact._id === props.userLogin.id ? <Button icon={<EditOutlined />} onClick={onClickEdit} style={{marginLeft: 15}}>{t('Edit')}</Button> : null}
                        </Col>
                    </Row>
                    <Descriptions bordered>
                        <Descriptions.Item label={<strong>{t('Address')}</strong>} span={3}>{postInfo.address && postInfo.address.addressTitle}</Descriptions.Item>
                        <Descriptions.Item label={<strong>{t('Type of post')}</strong>} span={1}>{postInfo.filter && postInfo.filter.optionType.value}</Descriptions.Item>
                        <Descriptions.Item label={<strong>{t('Code')}</strong>} span={2}>{postInfo._id}</Descriptions.Item>
                        <Descriptions.Item label={<strong>{t('Province')}</strong>}>{postInfo.filter && postInfo.filter.province.name}</Descriptions.Item>
                        <Descriptions.Item label={<strong>{t('District')}</strong>}>{postInfo.filter && postInfo.filter.district.name}</Descriptions.Item>
                        <Descriptions.Item label={<strong>{t('Street')}</strong>}>{postInfo.filter && postInfo.filter.street.name}</Descriptions.Item>
                        <Descriptions.Item label={<strong>{t('Area')}</strong>}>{postInfo.area}m<sup>2</sup></Descriptions.Item>
                        <Descriptions.Item label={<strong>{t('Price')}</strong>}>{numeral(postInfo.price).format('0,0')}/{t('month')}</Descriptions.Item>
                        <Descriptions.Item label={<strong>{t('Status')}</strong>}> <Badge status="processing" text={t('Running')} /></Descriptions.Item>
                        <Descriptions.Item label={<strong>{t('Package')}</strong>}>{showRenderPackage()}</Descriptions.Item>
                        <Descriptions.Item label={<strong>{t('Date Submitted')}</strong>}>{moment(postInfo.startTime).format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
                        <Descriptions.Item label={<strong>{t('End date')}</strong>}>{moment(postInfo.endTime || new Date()).format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
                    </Descriptions>
                    <div className='description-post' id='details'>
                        <Title level={4}>{t('Description')}</Title>
                        <div dangerouslySetInnerHTML={{ __html: postInfo.description }}></div>
                        <Divider dashed></Divider>
                        <div>
                            <Tag color="magenta">{postInfo.filter.province.name}</Tag>
                            <Tag color="red">{postInfo.filter.district.name}</Tag>
                            <Tag color="volcano">{postInfo.filter.street.name}</Tag>
                        </div>
                    </div>
                    <div style={{ marginBottom: 30 }} id='images'>
                        <Title level={4} >{t('Images')}</Title>
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
                    <Title level={4} id='map'>{t('Map')}</Title>
                    <GoogleMap center={postInfo.address.location}/>
                    <Title style={{marginTop: 20}} level={4}>{t('Cho thuê phòng trọ, căn hộ')}, {postInfo.filter.province.name}, {postInfo.filter.district.name}</Title>
                    <Row gutter={[16, 16]}>
                        {showRenderNormalPosts()}
                    </Row>
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 8 }}>
                   <div style={{position: 'sticky', top: 70}}>
                    <div className='info-user'>
                            <Row>
                                <Col span={5}>
                                    <Avatar size={70} icon={<UserOutlined />} src={postInfo.contact.avatar} />
                                </Col>
                                <Col span={19}>
                                    <h1>{postInfo.contact.fullName}</h1>
                                    <p>{postInfo.contact.email}</p>
                                </Col>
                            </Row>
                            <Button type='primary' onClick={() => onClickPhone(postInfo.contact.phoneNumber)} style={{ width: '100%' }} icon={<PhoneOutlined style={{ fontSize: 15 }} />}>
                                <a href={`tel:${postInfo.contact.phoneNumber}`} style={{ color: '#fff', marginLeft: 5, fontSize: 15 }}>{postInfo.contact.phoneNumber}</a>
                            </Button>
                        </div>
                        <div className='comment-box'>
                            <Title level={4}>{t('Feedback')}</Title>
                            <CommentBox postId={postInfo._id} callback={callbackCommentBox}/>
                            {showRenderComments()}
                            <div style={{height: 50}}></div>
                        </div>
                   </div>
                </Col>
            </Row>
        </Layout>
    )
}

Post.propTypes = {

}

const mapStateToProps = (state) => {
    return {
        userLogin: state.layout.userLogin
    }
}

export default connect(mapStateToProps, null)(Post)

