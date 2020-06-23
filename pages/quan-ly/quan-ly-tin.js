// Libraries
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Divider, Row, Col, Table, Badge, Dropdown, Menu, Button} from 'antd';
import numeral from 'numeral';
import moment from 'moment';
import {useTranslation} from 'react-i18next';

// Components
import Layout from '../../components/Layout/Layout';

// Services
import * as postServices from '../../services/post/index';
import {connect} from 'react-redux';

// Icons
import {DownOutlined, EditOutlined, EyeInvisibleOutlined, UpCircleOutlined, DeleteOutlined, UnorderedListOutlined} from '@ant-design/icons';

function ManagePosts(props) {
    // props
    const {userId} = props;

    const {t} = useTranslation();
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        getPosts();
    }, []);

    const getPosts = async () => {
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
                    actions: post._id
                }));

                setPosts(newPosts);
            }
        }

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
            render: (title) => <div className='box-2'>{title}</div>
        },
        {
            title: t('Price'),
            dataIndex: 'price',
            key: 'price',
            render: (price) => <div>{numeral(price).format('0,0')}/{t('month')}</div>
        },
        {
            title: t('Start time'),
            dataIndex: 'startTime',
            key: 'startTime',
            render: (date) => <div>{moment(date).format('DD/MM/YYYY HH:mm')}</div>
        },
        {
            title: t('End time'),
            dataIndex: 'endTime',
            key: 'endTime',
            render: (date) => <div>{moment(date).format('DD/MM/YYYY HH:mm')}</div>
        },
        {
            title: t('Status'),
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                console.log(status);
                const newStatus = status || false;

                return <Badge status={newStatus ? 'processing' : 'error'} text={newStatus ? t('Running') : t('Stopped')} />;
            }
        },
        {
            title: t('Actions'),
            dataIndex: 'actions',
            align: 'center',
            key: 'actions',
            render: (status) => {
                return (
                    <Dropdown 
                        trigger={['click']}
                        overlayStyle={{width: 120}}
                        overlay={
                            <Menu>
                                <Menu.Item><EditOutlined /> {t('Edit')}</Menu.Item>
                                <Menu.Item><EyeInvisibleOutlined /> {t('Hide')}</Menu.Item>
                                <Menu.Item><UpCircleOutlined />{t('Upgrade')}</Menu.Item>
                                <Menu.Item style={{color: '#f5222d'}}><DeleteOutlined />{t('Delete')}</Menu.Item>
                            </Menu>
                        }
                    >
                        <Button type='primary' shape='circle'><UnorderedListOutlined /></Button>
                    </Dropdown>
                );
            }
        }
    ];

    return (
        <Layout dashBoard>
            <h1 style={{fontSize: 30}}>{t('Manage posts')}</h1>
            <Divider />
            <Table size='small' bordered dataSource={posts} columns={columns} />
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

