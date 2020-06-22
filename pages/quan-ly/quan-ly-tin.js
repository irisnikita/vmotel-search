// Libraries
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Divider, Row, Col, Table} from 'antd';
import {useTranslation} from 'react-i18next';

// Components
import Layout from '../../components/Layout/Layout';

// Services
import * as postServices from '../../services/post/index';
import {connect} from 'react-redux';

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
                    key: post._id
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
            key: 'title'
        },
        {
            title: t('Price'),
            dataIndex: 'price',
            key: 'price'
        },
        {
            title: t('Start time'),
            dataIndex: 'startTime',
            key: 'startTime'
        },
        {
            title: t('End time'),
            dataIndex: 'endTime',
            key: 'endTime'
        },
        {
            title: t('Status'),
            dataIndex: 'status',
            key: 'status'
        }
    ];

    return (
        <Layout dashBoard>
            <h1 style={{fontSize: 30}}>{t('Manage posts')}</h1>
            <Divider />
            <Table dataSource={posts} columns={columns} />
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

