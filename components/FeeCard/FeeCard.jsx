// Libraries
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Row, Col} from 'antd';
import Link from 'next/link';
import numeral from 'numeral';
import {useTranslation} from 'react-i18next';

// Styles
import styles from './styles.module.scss';

import {EnvironmentOutlined, SketchOutlined, EyeOutlined} from '@ant-design/icons';

function FeeCard(props) {
    const {post = {}} = props;
    const {images = [], address = '', area, description, filter = {}, price, title} = post;
    const [params, setParams] = useState({
        title: '',
        province: '',
        district: ''
    });
    const {district, province} = filter;
    const {t} = useTranslation();

    const convertChar = (string) => {
        string = string.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D')
            .replace(/[^\w\s]/g, '')
            .replace(/\s/g, '-').toLowerCase();
    
        return string;
    };

    useEffect(() => {
        const title = convertChar(post.title || '');
        const province = convertChar(post.filter.province.name)
        const district = convertChar(post.filter.district.name)

        setParams({
            title: title + `"${post._id}"`,
            province,
            district
        })
    }, [post])

    return (
        <Row className={styles['fee-card']}>
            <Col xs={{span: 24}} md={{span: 8}}>
                <Link href='/posts/[province]/[district]/[post]' as={`/posts/${params.province}/${params.district}/${params.title}`}>
                    <a>
                        <div className={styles['background-image']} style={{backgroundImage: `url(${images[0]})`}}>
                            <div className={styles['number-image']}>{images.length} {t('images')}</div>
                            <div className={`${styles['banner-fee']} d-flex center`}>
                                <SketchOutlined style={{fontSize: 20, color: '#fff'}} />
                            </div>
                            <div className={styles['preview']}>
                                <EyeOutlined /> 
                            </div>
                        </div>
                    </a>
                </Link>
                
            </Col>
            <Col xs={{span: 24}} md={{span: 16}}>
                <div className={styles['content']}>
                    <div className={`gradient-text ${styles['title']}`}>{title}</div>
                    <div className='d-flex'>
                        <strong>{t('price')}:</strong> &nbsp;
                        <span style={{fontWeight: 500, color: '#f54ea2'}}>{numeral(price).format('0,0')}/{t('month')}</span>
                    </div>
                    <div className='d-flex'>
                        <strong>{t('address')}:</strong> &nbsp;
                        <span style={{fontWeight: 500}}>{address}</span>
                    </div>
                    <div className='d-flex'>
                        <strong>{t('area')}:</strong> &nbsp;
                        <span style={{fontWeight: 500}}>{area}m<sup>2</sup></span>
                    </div>
                    <div className='d-flex'>
                        <a style={{color: '#531dab', fontWeight: 600}} className={styles['link-address']}><EnvironmentOutlined /> {`${province.name}, ${district.name}`}</a>
                    </div>
                    <div className={styles['description']}>
                        <div dangerouslySetInnerHTML={{__html: description}}></div>
                    </div>
                </div>
            </Col>
        </Row>
    );
}

FeeCard.propTypes = {

};

export default FeeCard;

