import React from 'react'
import {Card, Carousel, Row, Col, Button, Space} from 'antd';
import Slider from "react-slick";
import numeral from 'numeral';

import styles from './styles.module.scss';

import {EnvironmentOutlined, CrownOutlined} from '@ant-design/icons';

export default function CustomCard(props) {
    const {images = [], title = '', description = '', square = '', province = '', price = '', district = '', address = ''} = props.room

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
      };

    return (
        <div>
            <Card 
                hoverable
                style={{ width: 260, height: 450 }}
                cover={
                    <Slider {...settings} className={styles['my-slick-slider']}>
                        {images.length > 0 && images.map(image => (
                            <div key={image}>
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
                    description={description}
                />
                <br/>
                <Row style={{fontSize: 13}}>
                    <Col span={24}>
                        <strong>Giá:</strong> &nbsp;
                        <span style={{fontWeight: 500, color: '#1890ff'}}>{numeral(price).format('0,0')}/Tháng</span>
                    </Col>
                    <Col span={24}>
                        <strong>Địa chỉ:</strong> &nbsp;
            <span style={{fontWeight: 500}}>{address}</span>
                    </Col>
                    <Col span={24}>
                        <div className='d-flex space-between'>
                            <span style={{fontWeight: 500}}>{square} m<sup>2</sup></span>
                            <a style={{color: '#531dab', fontWeight: 600}} className={styles['link-address']}><EnvironmentOutlined /> {`${province}, ${district}`}</a>
                        </div>
                    </Col>
                </Row>
            </Card>
        </div>
    )
}
