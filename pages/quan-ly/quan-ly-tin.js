// Libraries
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Divider, Row, Col, Table, Badge, Dropdown, Menu, Button, Descriptions, notification, Modal, Spin, Tooltip} from 'antd';
import numeral from 'numeral';
import moment from 'moment';
import {useRouter} from 'next/router';
import {useTranslation} from 'react-i18next';

// Components
import Layout from '../../components/Layout/Layout';

// Services
import * as postServices from '../../services/post/index';
import {connect} from 'react-redux';

// Icons
import {EditOutlined, EyeInvisibleOutlined,ExclamationCircleOutlined, UpCircleOutlined, EyeOutlined, DeleteOutlined, UnorderedListOutlined,  FileDoneOutlined, SketchOutlined, CrownOutlined, RightOutlined, LeftOutlined, UserOutlined, PhoneOutlined} from '@ant-design/icons';

const {confirm} = Modal;

function ManagePosts(props) {
    // props
    const {userId} = props;
    const {t} = useTranslation();
    const router = useRouter();
    const [posts, setPosts] = useState([]);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        getPosts();
    }, []);

    const convertChar = (string) => {
        string = string.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D')
            .replace(/[^\w\s]/g, '')
            .replace(/\s/g, '-').toLowerCase();
    
        return string;
    };

    const getPosts = async () => {
        setLoading(true);

        const get = await postServices.getPostByUser({
            userId,
            page: 0,
            limit: 20
        });

        if (get) {
            if (get.data && get.data.data) {
                const {posts = []} = get.data.data;

                const newPosts = posts.map(post => ({
                    ...post,
                    key: post._id,
                    typePost: post.filter.optionType.value,
                    title: {
                        level: post.option.level.id,
                        title: post.title,
                        status: post.status,
                        id: post._id,
                        province: post.filter.province.name,
                        district: post.filter.district.name
                    },
                    actions: {
                        id: post._id,
                        status: post.status
                    }
                }));

                setPosts(newPosts);
            }
        }
        
        setLoading(false);
    };

    const columns = [
        {
            title: t('Type post'),
            dataIndex: 'typePost',
            key: 'typePost'
        },
        {
            title: t('Title'),
            dataIndex: 'title',
            width: 300,
            key: 'title',
            render: (props) => {
                switch (props.level) {
                    case 'hot':
                        return <Tooltip title={t("Preview post")} placement="topLeft" mouseEnterDelay={0.2} color='cyan' ><div onClick={() => onClickTitle(props)} className='box-2 link' style={{color: '#ff7676'}}>{props.title}</div></Tooltip>;
                    case 'normal':
                        return <Tooltip title={t("Preview post")} placement="topLeft" mouseEnterDelay={0.2} color='cyan' ><div onClick={() => onClickTitle(props)}  className='box-2 link' style={{color: '#08979c'}}>{props.title}</div></Tooltip>;
                    case 'vip':
                        return <Tooltip title={t("Preview post")} placement="topLeft" mouseEnterDelay={0.2} color='cyan' ><div onClick={() => onClickTitle(props)}  className='box-2 link' style={{color: '#9e1068', fontWeight: 500}}>{props.title}</div></Tooltip>;
                    default:
                        break;
                }
            }
        },
        {
            title: t('Price'),
            dataIndex: 'price',
            key: 'price',
            render: (price) => <div>{numeral(price).format('0,0')}/{t('month')}</div>
        },
        {
            title: t('Date Submitted'),
            dataIndex: 'startTime',
            key: 'startTime',
            render: (date) => <div>{moment(date).format('DD/MM/YYYY HH:mm')}</div>
        },
        {
            title: t('End date'),
            dataIndex: 'endTime',
            key: 'endTime',
            render: (date) => <div>{moment(date).format('DD/MM/YYYY HH:mm')}</div>
        },
        {
            title: t('Status'),
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const newStatus = status || false;

                return <Badge status={newStatus ? 'processing' : 'error'} text={newStatus ? t('Running') : t('Stopped')} />;
            }
        },
        {
            title: t('Actions'),
            dataIndex: 'actions',
            align: 'center',
            key: 'actions',
            render: ({id, status}) => {
                return (
                    <Dropdown 
                        trigger={['click']}
                        overlayStyle={{width: 120}}
                        overlay={
                            <Menu>
                                <Menu.Item onClick={() => router.push('/posts/sua-tin/[id]', `/posts/sua-tin/${id}`)}><EditOutlined /> {t('Edit')}</Menu.Item>
                                <Menu.Item onClick={() => onClickShowHide({id, status})}>{!status ? <><EyeOutlined /> {t('Show')}</> : <><EyeInvisibleOutlined /> {t('Hide')}</>}</Menu.Item>
                                <Menu.Item ><UpCircleOutlined />{t('Upgrade')}</Menu.Item>
                                <Menu.Item style={{color: '#f5222d'}} onClick={() => onClickDelete(id)}><DeleteOutlined />{t('Delete')}</Menu.Item>
                            </Menu>
                        }
                    >
                        <Button type='primary' shape='circle'><UnorderedListOutlined /></Button>
                    </Dropdown>
                );
            }
        }
    ];

    const onClickTitle = ({id, status, province, district, title}) => {
        if(status) {
            const newTitle = convertChar(title) + `"${id}"`;
            const newProvince = convertChar(province)
            const newDistrict = convertChar(district)

            router.push('/posts/[province]/[district]/[post]', `/posts/${newProvince}/${newDistrict}/${newTitle}`)
        } else {
            notification.error({
                message: t('Your post had been hided'),
                description: t('Please show post to get this link')
            })
        }
    }

    const onClickShowHide = ({id, status}) => {
        if (status) {
            confirm({
                title: t('Do you want to hide this post ?'),
                icon: <ExclamationCircleOutlined />, 
                content: t('If you hide this post, post will hide, and you can show again, don\'t need to create new!'),
                onOk() {
                    showHidePost({id, status});
                },
                onCancel() {

                }
            });
        } else {
            showHidePost({id, status});
        }
    };

    const showHidePost = async ({id, status}) => {
        setLoading(true);

        const showHide = await postServices.updateStatus({
            id,
            status: !status
        });

        if (showHide) {
            if (showHide.data && showHide.data.data) {
                notification.success({
                    message: status ? t('Hide post') : t('Show post'),
                    description: status ? t('Hide post success!') : t('Show post success!')
                });

                getPosts();
            } else {
                notification.error({
                    message: status ? t('Hide post') : t('Show post'),
                    description: status ? t('Hide post error!') : t('Show post error!')
                });
            }
        }

        setLoading(false);
    };

    const onClickDelete = async (id) => {
        confirm({
            title: t('Do you want to delete this post ?'),
            icon: <ExclamationCircleOutlined />, 
            content: t('If you delete this post, they won\'t show again, and you must create ne'),
            onOk() {
                deletePost(id);
            },
            onCancel() {

            }
        });
    };

    const deletePost = async (id) => {
        setLoading(true);

        if (id) {
            const deletePost = await postServices.del({
                id
            });

            if (deletePost) {
                if (deletePost.data && deletePost.data.data) {
                    notification.success({
                        message: t('Delete post'),
                        description: t('Delete post success!')
                    });

                    getPosts();
                } else {
                    notification.error({
                        message: t('Delete post'),
                        description: t('Delete post failed!')
                    });
                }
            }
        }

        setLoading(false);
    };

    const showRenderPackage = (level) => {
        switch (level) {
            case 'hot':
                return <div style={{color: '#ff7676'}}><SketchOutlined /> {t('Hot')}</div>;
            case 'normal':
                return <div style={{color: '#08979c'}}><FileDoneOutlined /> {t('Normal')}</div>;
            case 'vip':
                return <div style={{color: '#eb2f96'}}><CrownOutlined /> {t('Vip')}</div>;
            default:
                break;
        }
    };

    return (
        <Layout dashBoard>
            <h1 style={{fontSize: 30}}>{t('Manage posts')}</h1>
            <Divider />
            <Spin spinning={isLoading}>
                <Table 
                    size='small' 
                    bordered 
                    dataSource={posts} 
                    columns={columns} 
                    expandable={{
                        expandedRowRender: postInfo => (
                            <Descriptions >
                                <Descriptions.Item label={<strong>{t('Address')}</strong>} span={3}>{postInfo.address.addressTitle}</Descriptions.Item>
                                <Descriptions.Item label={<strong>{t('Type of post')}</strong>} span={1}>{postInfo.typePost}</Descriptions.Item>
                                <Descriptions.Item label={<strong>{t('Code')}</strong>} span={2}>{postInfo._id}</Descriptions.Item>
                                <Descriptions.Item label={<strong>{t('Province')}</strong>}>{postInfo.filter.province.name}</Descriptions.Item>
                                <Descriptions.Item label={<strong>{t('District')}</strong>}>{postInfo.filter.district.name}</Descriptions.Item>
                                <Descriptions.Item label={<strong>{t('Street')}</strong>}>{postInfo.filter.street.name}</Descriptions.Item>
                                <Descriptions.Item label={<strong>{t('Area')}</strong>}>{postInfo.area}m<sup>2</sup></Descriptions.Item>
                                <Descriptions.Item label={<strong>{t('Price')}</strong>}>{numeral(postInfo.price).format('0,0')}/{t('month')}</Descriptions.Item>
                                <Descriptions.Item label={<strong>{t('Status')}</strong>}> <Badge status={postInfo.status ? 'processing' : 'error'} text={t(postInfo.status ? 'Running' : 'Stopped')} /></Descriptions.Item>
                                <Descriptions.Item label={<strong>{t('Package')}</strong>}>{showRenderPackage(postInfo.title.level)}</Descriptions.Item>
                                <Descriptions.Item label={<strong>{t('Date Submitted')}</strong>}>{moment(postInfo.startTime).format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
                                <Descriptions.Item label={<strong>{t('End date')}</strong>}>{moment(postInfo.endTime || new Date()).format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
                            </Descriptions>
                        )
                    }}
                />
            </Spin>
        </Layout>
    );
}

ManagePosts.propTypes = {

};

const mapStateToProps = (state) => {
    return {
        userId: state.layout.userLogin.id
    };
}; 

export default connect(mapStateToProps, null)(ManagePosts);

