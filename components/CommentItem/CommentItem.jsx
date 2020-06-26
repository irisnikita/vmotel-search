import React from 'react';
import PropTypes from 'prop-types';
import {Row, Col, Avatar, Rate} from 'antd';
import moment from 'moment';
import {useTranslation} from 'react-i18next';

// Icons
import {UserOutlined} from '@ant-design/icons';

const desc = ['Terrible', 'Bad', 'Normal', 'Good', 'Wonderful'];

function CommentItem(props) {
    const {t} = useTranslation();
    const {comment = {}} = props;

    return (
        <div>
            <Row gutter={10}>
                <Col><Avatar icon={<UserOutlined />} src={comment.contact.avatar || ''} /></Col>
                <Col>
                    <strong>{comment.contact.userName ? comment.contact.userName : comment.contact.fullName}</strong>
                </Col>
                <Col>
                    {moment(comment.dateCreate).fromNow()}
                </Col>
            </Row>  
            <div style={{display: 'inline-block'}}>
                <Rate value={comment.rate} disabled /> &nbsp;
                <span>{t(desc[comment.rate - 1])}</span>
                <p>{comment.description}</p>
            </div>
        </div>
    );
}

CommentItem.propTypes = {
    
};

CommentItem.defaultProps = {
    comment: {}
};

export default CommentItem;

