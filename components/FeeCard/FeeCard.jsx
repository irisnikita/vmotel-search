// Libraries
import React from 'react';
import PropTypes from 'prop-types';
import {Row, Col} from 'antd';
import {useTranslation} from 'react-i18next';

// Styles
import styles from './styles.module.scss';

import {EnvironmentOutlined, SketchOutlined} from '@ant-design/icons';

function FeeCard(props) {
    const {t} = useTranslation();

    return (
        <div className={styles['fee-card']}>
            <div>
                <div className={styles['background-image']} style={{backgroundImage: 'url(\'/images/rooms/phong-tro-1.jpg\')'}}>
                    <div className={styles['number-image']}>7 {t('images')}</div>
                    <div className={`${styles['banner-fee']} d-flex center`}>
                        <SketchOutlined style={{fontSize: 20, color: '#fff'}} />
                    </div>
                </div>
            </div>
            <div className={styles['content']}>
                <div className={`gradient-text ${styles['title']}`}>Phòng trọ mới xây, có thang máy, tiện nghi tại 708/19/12 Đường Hồng Bàng, Phường 1, Quận 11</div>
                <div className='d-flex'>
                    <strong>{t('price')}:</strong> &nbsp;
                    <span style={{fontWeight: 500, color: '#f54ea2'}}>2,000,000/{t('month')}</span>
                </div>
                <div className='d-flex'>
                    <strong>{t('address')}:</strong> &nbsp;
                    <span style={{fontWeight: 500}}>66/9 Bình lợi, P.13, Quận.Bình Thạnh</span>
                </div>
                <div className='d-flex'>
                    <strong>{t('area')}:</strong> &nbsp;
                    <span style={{fontWeight: 500}}>20m<sup>2</sup></span>
                </div>
                <div className='d-flex'>
                    <a style={{color: '#531dab', fontWeight: 600}} className={styles['link-address']}><EnvironmentOutlined /> {'Hồ Chí Minh, Quận Tân Bình'}</a>
                </div>
                <p className={styles['description']}>Cho thuê phòng trọ tiện nghi mới xây 100% Trung Tâm Quận 11, giáp Q.5, Q.6, Q.10, Tân Bình.Địa chỉ: 708/19/12 Đường Hồng Bàng, Phường 1, Quận 11, TP. Hồ Chí Minh.</p>
            </div>
        </div>
    );
}

FeeCard.propTypes = {

};

export default FeeCard;

