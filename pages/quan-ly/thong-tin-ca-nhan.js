// Libraries
import React from 'react';
import PropTypes from 'prop-types';
import {Divider, Row, Col} from 'antd';
import {useTranslation} from 'react-i18next';

// Components
import Layout from '../../components/Layout/Layout';

function UserInfo(props) {
    const {t} = useTranslation();

    return (
        <Layout dashBoard>
            <h1 style={{fontSize: 30}}>{t('User information')}</h1>
            <Divider />
        </Layout>
    );
}

UserInfo.propTypes = {

};

export default UserInfo;

