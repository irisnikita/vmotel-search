// Libraries
import React from 'react'
import { List, Typography, Divider, Space, Row, Col } from 'antd';
import numeral from 'numeral'
import { useTranslation } from 'react-i18next'; import moment from 'moment'

import styles from './styles.module.scss'

// const data = [
//     'Phòng trọ Tân Phú ,đường Cầu Xéo giao nhau vơi Gò Dầu và Tân Kỳ Tân Quý , giờ giấc tự do 2.7 triệu/tháng',
//     'Cho thuê phòng trọ, nhà trọ Hồ Chí Minh',
//     'Cho thuê phòng trọ, nhà trọ Hà Nội',
//     'Cho thuê nhà nguyên căn',
//     'Cho thuê nhà nguyên căn Hồ Chí Minh',
//     'Cho thuê nhà nguyên căn Hà Nội',
//     'Cho thuê căn hộ',
//     'Cho thuê căn hộ Hồ Chí Minh',
//     'Cho thuê căn hộ Hà Nội',
// ];
const data = [
    {
        title: "Phong 1",
        price: 2000000,
        cTime: '12/10/2020'
    }
];


const { Link, Text } = Typography;

export default function Category() {
    const { t, i18n } = useTranslation();


    return (
        <List
            size="large"
            dataSource={data}
            renderItem={item => (
                <List.Item>
                    <Link href="https://fb.com" target="_blank">
                        <span className={styles['link']}> &#9679; {item.title}</span>
                    </Link> <br />
                    <Row justify="space-between">
                        <Col>{numeral(item.price).format('0,0')} vnd/{t('month')}</Col>
                        <Col >{moment(item.cTime, 'DD/MM/YYYY').locale(i18n.language).fromNow()}</Col>
                    </Row>
                </List.Item>
            )}
        />
    )
}
