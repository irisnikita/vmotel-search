import React, {useState, useEffect} from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {Layout as AntdLayout, Menu, Input, Space, Button, Row, Col, Avatar, Dropdown, Select} from 'antd';
import {useTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import _ from 'lodash';

// Actions
import {userLogin} from '../../Redux/actions/layout';

// Components
import DashBoard from '../DashBoard/DashBoard';

// Styles
import styles from './styles.module.scss';

// Services
import * as userServices from '../../services/User/index';

// Icons
import {PlusOutlined, UserOutlined} from '@ant-design/icons';

const {Header, Content} = AntdLayout;

function Layout(props) {
    const {t, i18n} = useTranslation();
    const defaultTitle = 'Tìm nhà trọ, khu trọ, giá rẻ, đẹp, gần trung tâm';
    const {children = '', title = defaultTitle} = props;
    const flags = [{id: 'vi', label: 'vietnamese'}, {id: 'en', label: 'english'}];
    const [lang, setLang] = useState({id: 'vi', label: 'vietnamese'});
    const router = useRouter();

    useEffect(() => {
        if (process.browser) {
            if (localStorage.getItem('lang')) {
                const newLang = flags.find(flag => flag.id === localStorage.getItem('lang'));

                setLang(newLang);
            } 
            if (localStorage.getItem('userInfo')) {
                validateUser();
            }
        }
    }, []);
    
    const validateUser = async () => {
        const validate = await userServices.validate();

        if (validate) {
            if (validate.data && validate.data.data) {
                const {user} = JSON.parse(localStorage.getItem('userInfo'));

                props.userLogin({
                    userLogin: user
                });
            }
        }
    };

    const onClickFlag = (lang) => {
        setLang(lang);

        i18n.changeLanguage(lang.id);
        
        if (process.browser) {
            localStorage.setItem('lang', lang.id);
        }
    };

    const onClickPost = () => {
        if (_.isEmpty(props.user)) {
            router.push('/login?linkPage=post');
        } else {
            router.push('/quan-ly/tao-tin');
        }
    };

    return (
        <div>
            <Head>
                <title>{title}</title>
                <link rel="icon" href="/favicon.ico" />
                <script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.0.0/highlight.min.js" />
                <script charSet="UTF-8" src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.0.0/languages/go.min.js" />
                <script src="https://widget.cloudinary.com/v2.0/global/all.js" type="text/javascript" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            </Head>
            <AntdLayout>
                {props.isLoginPage ? null :  <Header className={`${styles['default-header']} d-flex space-between`}>
                    <div className='d-flex'>
                        <Space>
                            <Link href='/'>
                                <img style={{cursor: 'pointer'}} src="/images/vmotel-logo.png" alt="tim-nha-tro" width={64} />
                            </Link>
                            <Input.Search className={`${styles['input-search']} input-focus`} placeholder={t('place-to-search')} />
                        </Space>
                    </div>
                    <div className='d-flex right-menu'>
                        
                        <Avatar src={props.user.avatar} icon={<UserOutlined />} size={32} style={{marginRight: 10}} />
                        {
                            _.isEmpty(props.user) ? <Link href='/login'>
                                <Button type='primary' shape='round' className='mr-10'>{t('sign-in')}</Button>
                            </Link> : <strong className='mr-10'>{props.user.fullName}</strong> 
                        }
                        <Button type='ghost' shape='round' onClick={onClickPost} className='mr-10' icon={<PlusOutlined />}>{t('post')}</Button>
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
                } 
               
                {props.dashBoard ? 
                    <DashBoard userLogin={props.user}>{children}</DashBoard> :  <Content className={styles['content']}>
                        {children}
                    </Content>}
            </AntdLayout>
        </div>
    );
}

const mapDispatchToProps = {
    userLogin
};

const mapStateToProps = (state) => {
    return {
        user: state.layout.userLogin
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);