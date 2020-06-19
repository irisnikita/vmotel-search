// Libraries
import React from 'react';
import PropTypes from 'prop-types';
import {Row, Col} from 'antd';
import numeral from 'numeral';
import {useTranslation} from 'react-i18next';

// Styles
import styles from './styles.module.scss';

import {EnvironmentOutlined, SketchOutlined, EyeOutlined} from '@ant-design/icons';

function FeeCard(props) {
    const {post = {}} = props;
    const {images = [], address = '', area, description, filter = {}, price, title} = post;
    const {district, province} = filter;
    const {t} = useTranslation();

    return (
        <Row className={styles['fee-card']}>
            <Col xs={{span: 24}} md={{span: 8}}>
                <div className={styles['background-image']} style={{backgroundImage: `url(${images[0]})`}}>
    <div className={styles['number-image']}>{images.length} {t('images')}</div>
                    <div className={`${styles['banner-fee']} d-flex center`}>
                        <SketchOutlined style={{fontSize: 20, color: '#fff'}} />
                    </div>
                    <div className={styles['preview']}>
                        <EyeOutlined /> 
                    </div>
                </div>
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

