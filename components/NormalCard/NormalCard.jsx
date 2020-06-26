import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Card, Button} from 'antd';
import {useTranslation} from 'react-i18next';
import numeral from 'numeral';
import Link from 'next/link';
import moment from 'moment';
import {useRouter} from 'next/router';

import styles from './styles.module.scss';
import stylesFeeCard from '../FeeCard/styles.module.scss';

import {EnvironmentOutlined, RightCircleOutlined} from '@ant-design/icons';

function NormalCard(props) {
    const {room = {}} = props;
    const [params, setParams] = useState({
        title: '',
        province: '',
        district: ''
    });
    const {t} = useTranslation();
    const router = useRouter();
    
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
        const title = convertChar(room.title);
        const province = convertChar(room.filter.province.name)
        const district = convertChar(room.filter.district.name)

        setParams({
            title: title + `"${room._id}"`,
            province,
            district,
            id: room._id
        })
    }, [room])

    return (
        <Card
            bodyStyle={{padding: 10}}
            className={styles['normal-card']}
            hoverable
            cover={<div className={styles['image-cover']} style={{backgroundImage: `url(${room.images[0] || '/images/giphy.gif'})`}} />}
        >
            <div className='d-flex row left inner-body' style={{justifyContent: 'space-between', height: '200px'}}>
                <div className={styles['title']}>{room.title}</div>
                <div className='d-flex'>
                    <strong>{t('price')}:</strong> &nbsp;
                    <span style={{fontWeight: 500, color: '#08979c'}}>{numeral(room.price).format('0,0')}/{t('month')}</span>
                </div>
                <div className='d-flex'>
                    <strong>{t('address')}:</strong> &nbsp;
                    <div className={styles['address']} style={{fontWeight: 500}}>{room.address.addressTitle}</div>
                </div>
                <div className='d-flex'>
                    <strong>{t('area')}:</strong> &nbsp;
                    <span style={{fontWeight: 500}}>{room.area}m<sup>2</sup></span>
                </div>
                <div className='d-flex'>
                    <a style={{color: '#531dab', fontWeight: 600}} className={styles['link-address']}><EnvironmentOutlined />{`${room.filter.province.name}, ${room.filter.district.name}`}</a>
                </div>
                <div className={styles['description']}>
                    <div dangerouslySetInnerHTML={{__html: room.description}}></div>
                </div>
            </div>
            <div className='d-flex space-between' style={{marginTop: 10}}>
                <div style={{color: '#bfbfbf', fontSize: '15px'}}>{moment(room.startTime).fromNow()}</div>
                <Link href="/posts/[province]/[district]/[post]" as={`/posts/${params.province}/${params.district}/${params.title}`}>
                    <a>
                        <Button className={styles['btn-view']} shape='round' >
                            <div className='d-flex center'><RightCircleOutlined /></div> &nbsp;
                            <div>{t('Read post')}</div>
                        </Button>
                    </a>
                </Link>
            </div>
        </Card>
    );
}

NormalCard.propTypes = {

};

export default NormalCard;

