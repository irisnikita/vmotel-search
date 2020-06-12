import React, {useState, useEffect} from 'react';
import Head from 'next/head';
import {Layout as AntdLayout, Menu, Input, Space, Button, Row, Col, Avatar, Dropdown, Select} from 'antd';
import {useTranslation} from 'react-i18next';

const {Header, Content} = AntdLayout;

// Styles
import styles from './styles.module.scss';

// Icons
import {PlusOutlined, UserOutlined} from '@ant-design/icons';

export default function Layout(props) {
    const {t, i18n} = useTranslation();
    const defaultTitle = 'Tìm nhà trọ, khu trọ, giá rẻ, đẹp, gần trung tâm';
    const {children = '', title = defaultTitle} = props;
    const flags = [{id: 'vi', label: 'vietnamese'}, {id: 'en', label: 'english'}];
    const [lang, setLang] = useState({id: 'vi', label: 'vietnamese'});

    useEffect(() => {
        if (process.browser) {
            if (localStorage.getItem('lang')) {
                const newLang = flags.find(flag => flag.id === localStorage.getItem('lang'));

                setLang(newLang);
            } 
        }
    }, []);

    const onClickFlag = (lang) => {
        setLang(lang);

        i18n.changeLanguage(lang.id);
        
        if (process.browser) {
            localStorage.setItem('lang', lang.id);
        }
    };

    return (
        <div>
            <Head>
                <title>{title}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <AntdLayout>
                <Header className={`${styles['default-header']} d-flex space-between`}>
                    <div className='d-flex'>
                        <Space>
                            <img src="/images/vmotel-logo.png" alt="tim-nha-tro" width={64} />
                            <Input.Search className={`${styles['input-search']} input-focus`} placeholder={t('place-to-search')} />
                        </Space>
                    </div>
                    <div className='d-flex right-menu'>
                        <Avatar icon={<UserOutlined />} size={32} style={{marginRight: 10}} />
                        <Button type='primary' shape='round' className='mr-10'>{t('sign-in')}</Button>
                        <Button type='ghost' shape='round' className='mr-10' icon={<PlusOutlined />}>{t('post')}</Button>
                        <Dropdown trigger={['click']} overlay={<Menu>
                            {flags && flags.length > 0 && flags.map(flag => {
                                const isSelected = flag.id === lang.id;

                                return (
                                    <Menu.Item style={{backgroundColor: isSelected ? '#87e8de' : '#fff'}} key={flag.id} onClick={() => onClickFlag(flag)}>
                                        <Space>
                                            <img src={`/images/flags/${flag.id}.svg`} width={20} alt={flag.id} />
                                            <div>{t(flag.label)}</div>
                                        </Space>
                                    </Menu.Item>
                                );
                            })}
                        </Menu>}>
                            <Button type='ghost' >
                                <div className='d-flex'>
                                    <img src={`/images/flags/${lang.id}.svg`} width={20} /> &nbsp;
                                    <div>{t(lang.label)}</div> &nbsp;
                                </div>
                            </Button>
                        </Dropdown>
                    </div>
                </Header>
                <Content className={styles['content']}>
                    {children}
                </Content>
            </AntdLayout>
        </div>
    );
}
