// Libraries
import React from 'react'
import { List, Typography, Divider, Space } from 'antd';

import styles from './styles.module.scss'

const data = [
    'Cho thuê phòng trọ, nhà trọ',
    'Cho thuê phòng trọ, nhà trọ Hồ Chí Minh',
    'Cho thuê phòng trọ, nhà trọ Hà Nội',
    'Cho thuê nhà nguyên căn',
    'Cho thuê nhà nguyên căn Hồ Chí Minh',
    'Cho thuê nhà nguyên căn Hà Nội',
    'Cho thuê căn hộ',
    'Cho thuê căn hộ Hồ Chí Minh',
    'Cho thuê căn hộ Hà Nội',
];
const { Link, Text } = Typography;

export default function Category() {
    return (
        <List
            size="small"
            dataSource={data}
            renderItem={item => (
                <List.Item>
                    <Link href="https://fb.com" target="_blank" style={{ color: "black" }}>
                        <span className={styles['link']}> &#9679; {item}</span>
                    </Link>
                </List.Item>
            )}
        />
    )
}
