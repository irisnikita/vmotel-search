import React from 'react';
import PropTypes from 'prop-types';
import {Card, Button} from 'antd';
import {useTranslation} from 'react-i18next';
import numeral from 'numeral';

import styles from './styles.module.scss';
import stylesFeeCard from '../FeeCard/styles.module.scss';

import {EnvironmentOutlined, RightCircleOutlined} from '@ant-design/icons';

function NormalCard(props) {
    const {room = {}} = props;
    const {t} = useTranslation();
    
    return (
        <Card
            bodyStyle={{padding: 10}}
            className={styles['normal-card']}
            hoverable
            cover={<div className={styles['image-cover']} style={{backgroundImage: `url(${room.images[0]})`}} />}
        >
            <div className='d-flex row left inner-body' style={{justifyContent: 'space-between', height: '200px'}}>
                <div className={styles['title']}>{room.title}</div>
                <div className='d-flex'>
                    <strong>{t('price')}:</strong> &nbsp;
                    <span style={{fontWeight: 500, color: '#08979c'}}>{numeral(room.price).format('0,0')}/{t('month')}</span>
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
                    <a style={{color: '#531dab', fontWeight: 600}} className={styles['link-address']}><EnvironmentOutlined />{`${room.province.name}, ${room.district.name}`}</a>
                </div>
                <p className={styles['description']}>{room.description}</p>
            </div>
            <div className='d-flex space-between'>
                <div style={{color: '#bfbfbf', fontSize: '15px'}}>{room.dateCreate}</div>
                <Button className={styles['btn-view']} shape='round' >
                    <div className='d-flex center'><RightCircleOutlined /></div> &nbsp;
                    <div>{t('Read post')}</div>
                </Button>
            </div>
        </Card>
    );
}

NormalCard.propTypes = {

};

export default NormalCard;

