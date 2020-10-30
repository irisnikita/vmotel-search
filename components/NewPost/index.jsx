// Libraries
import React, { useEffect, useState } from 'react'
import { List, Typography, Divider, Space, Row, Col } from 'antd';
import numeral from 'numeral'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'; import moment from 'moment'
import Link from 'next/link';

// Services
import * as postServices from '../../services/post/index';

import styles from './styles.module.scss'
import { fromPairs } from 'lodash';

const { Text } = Typography;

export default function NewPost() {
    const { t, i18n } = useTranslation();
    const [data, setData] = useState([])

    const router = useRouter();

    useEffect(() => {
        getNewPosts();
    }, [])

    const getNewPosts = async () => {
        const newPosts = await postServices.getList({
            limit: 6,
        });

        if (newPosts) {

            const { data = [] } = newPosts.data;

            setData(data.posts)
        }
    }

    const convertChar = (string) => {
        string = string.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D')
            .replace(/[^\w\s]/g, '')
            .replace(/\s/g, '-').toLowerCase();

        return string;
    };


    return (
        <List
            size="large"
            dataSource={data}
            renderItem={item => {
                let params = {};

                const title = convertChar(item.title);
                const province = convertChar(item.filter.province.name)
                const district = convertChar(item.filter.district.name)

                params = {
                    title: title + `"${item._id}"`,
                    province,
                    district,
                    id: item._id
                }

                return (
                    <List.Item>
                        <Link href="/posts/[province]/[district]/[post]" as={`/posts/${params.province}/${params.district}/${params.title}`}>
                            <a>
                                <span className={styles['link']}> &#9679; {item.title}</span>
                            </a>
                        </Link> <br />
                        <Row justify="space-between">
                            <Col>{numeral(item.price).format('0,0')} vnd/{t('month')}</Col>
                            <Col >{moment(item.startTime).locale(i18n.language).fromNow()}</Col>
                        </Row>
                    </List.Item>
                )
            }}
        />
    )
}
