// Libraries
import React, {useEffect, useState} from 'react';
import {List, Typography, Divider, Space} from 'antd';
import {useRouter} from 'next/router';

import styles from './styles.module.scss';

// Services
import * as postServices from '../../services/post';

const {Link, Text} = Typography;

export default function Category() {
    const [data, setData] = useState([]);

    const router = useRouter();

    useEffect(() => {
        getCategory();
    }, []);

    const getCategory = async () => {
        const category = await postServices.getCategory();

        if (category) {

            const {data = []} = category.data;

            setData(data);
        }
    };

    const onClickLink = (item) => {
        if (item.district === '') {
            router.push('/posts/[province]', `/posts/${item.province}`);
        } else {
            router.push('/posts/[province]/[district]', `/posts/${item.province}/${item.district}`);
        }
    };

    return (
        <List
            size="small"
            dataSource={data}
            renderItem={item => (
                <List.Item>
                    <Link style={{color: 'black'}}>
                        <span className={styles['link']} onClick={() => onClickLink(item)}> &#9679; {item.value}</span>
                    </Link>
                </List.Item>
            )}
        />
    );
}
