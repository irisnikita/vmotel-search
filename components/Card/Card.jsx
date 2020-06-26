import React from 'react'
import {Card, Row, Col, Button, Space} from 'antd';
import Slider from "react-slick";
import {useRouter} from 'next/router';
import numeral from 'numeral';
import {useTranslation} from 'react-i18next';

import styles from './styles.module.scss';

import {EnvironmentOutlined, CrownOutlined} from '@ant-design/icons';

const convert = (string) => {
    if(string && typeof string === 'string') {
        return string.replace(/<p>|<\/p>|<h1>|<\/h1>/g,'')
    }

    return string
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

export default function CustomCard(props) {
    const {images = [], title = '', description = '', _id = '', area = '',filter = {}, province = '', price = '', district = '', address = {}} = props.room
    const {t} = useTranslation();
    const router = useRouter();

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
      };

      const onClickCard = () => {
        const newTitle = convertChar(title) + `"${_id}"`;
        const province = convertChar(filter.province.name)
        const district = convertChar(filter.district.name)

        router.push('/posts/[province]/[district]/[post]', `/posts/${province}/${district}/${newTitle}`)

      }

    return (
        <div>
            <Card 
                hoverable
                onClick={onClickCard}
                style={{ width: 260, height: 450 }}
                cover={
                    <Slider {...settings} className={styles['my-slick-slider']}>
                        {images.length > 0 && images.map((image, index) => (
                            <div key={image + index}>
                                <div className={styles['image-slick']} style={{backgroundImage: `url(${image})`}}/>
                            </div>
                        ))}
                    </Slider>
                }
                className={styles['card-custom']}
            >
                <div className={styles['vip']}>
                    <div className={styles['vip-content']}>
                        <div className={styles['text-trans']}>
                            <CrownOutlined style={{fontSize: 20}}/>
                        </div>
                    </div>
                </div>
                <Card.Meta
                    style={{fontSize: 12}}
                    title={title}
                    description={convert(description)}
                />
                <br/>
                <Row style={{fontSize: 13}}>
                    <Col span={24}>
                        <strong>{t('price')}:</strong> &nbsp;
                        <span style={{fontWeight: 500, color: '#1890ff'}}>{numeral(price).format('0,0')}/{t('month')}</span>
                    </Col>
                    <Col span={24}>
                        <strong>{t('address')}:</strong> &nbsp;
                        <span style={{fontWeight: 500}}>{address.addressTitle}</span>
                    </Col>
                    <Col span={24}>
                        <div className='d-flex space-between'>
                            <span style={{fontWeight: 500}}>{area} m<sup>2</sup></span>
                            <a style={{color: '#531dab', fontWeight: 600}} className={styles['link-address']}><EnvironmentOutlined /> {`${filter.province.name}, ${filter.district.name}`}</a>
                        </div>
                    </Col>
                </Row>
            </Card>
        </div>
    )
}
