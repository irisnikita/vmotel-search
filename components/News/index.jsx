// Libraries
import React, { useEffect, useState } from 'react'
import { List, Typography, Image, Divider, Space, Row, Col } from 'antd';
import numeral from 'numeral'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'; import moment from 'moment'
import Link from 'next/link';

// Services
import * as postServices from '../../services/post/index';

import styles from './styles.module.scss'
import { fromPairs } from 'lodash';

const { Text } = Typography;

const data = [
    {
        image: "https://static123.com/phongtro123/uploads/images/thumbs/250x150/fit/2020/06/09/chothuematbang01-1_1591697241.jpg",
        description: 'Top 5 website đăng tin cho thuê mặt bằng hiệu quả nhất hiện nay',
    },
    {
        image: "https://static123.com/phongtro123/uploads/images/thumbs/250x150/fit/2020/03/13/trang-web-dang-tin-o-ghep-bds123_1584091714.png",
        description: 'Đăng tin tìm người ở ghép miễn phí ở đâu hiệu quả?',
    },
    {
        image: "https://static123.com/phongtro123/uploads/images/thumbs/250x150/fit/2019/09/07/dau-tu-dat-xay-phong-tro_1567824476.jpg",
        description: 'Kinh nghiệm chọn đất đầu tư xây phòng trọ không bao giờ lỗ',
    },
    {
        image: "https://static123.com/phongtro123/uploads/images/thumbs/250x150/fit/2019/09/07/bds123-giao-dien_1567824794.png",
        description: 'Đăng tin cho thuê văn phòng ở đâu hiệu quả nhất?',
    },
    {
        image: "https://static123.com/phongtro123/uploads/images/thumbs/250x150/fit/2019/09/07/bds123-giao-dien_1567824838.png",
        description: 'Đăng tin cho thuê mặt bằng ở đâu nhanh chóng và hiệu quả nhất?.',
    },
    {
        image: "https://static123.com/phongtro123/uploads/images/thumbs/250x150/fit/2019/09/07/cach-dang-tin-tim-nguoi-o-ghep_1567824883.png",
        description: 'Top 3 website đăng tin tìm người ở ghép hiệu quả nhất',
    },
];


export default function News() {
    const { t, i18n } = useTranslation();


    return (
        <List
            dataSource={data}
            renderItem={item => {
                return (
                    <div className='d-flex' style={{ alignItems: 'start', margin: '10px 0px' }}>
                        <img
                            style={{ marginRight: 5 }}
                            width={100}
                            src={item.image}
                        />
                        <div >
                            <strong>Kinh nghiệm</strong>
                            <br />
                            <div className="box-2">
                                {item.description}
                            </div>
                        </div>
                    </div>
                )
            }}
        />
    )
}
