import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Row, Col, Form, Input, Rate, Button, message, Spin} from 'antd';
import {connect} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {userLogin} from '../../Redux/actions/layout';
import {isEmpty} from 'lodash';
import moment from 'moment';

// Services
import * as commentServices from '../../services/comment/index';

const desc = ['Terrible', 'Bad', 'Normal', 'Good', 'Wonderful'];

function CommentBox(props) {
    const [form] = Form.useForm();
    const {t} = useTranslation();
    const [isLoading, setLoading] = useState(false);

    const layout = {
        labelCol: {span: 24},
        wrapperCol: {span: 24}
    };

    const tailLayout = {
        wrapperCol: {span: 24}
    };

    const onFinishForm = (value) => {
        if (value.description) {
            createComment(value);
        } else {
            message.error(t('The description is empty!'));
        }
    };

    const createComment = async (value) => {
        setLoading(true);

        if (!isEmpty(props.userLogin)) {

            const create = await commentServices.create({
                postId: props.postId,
                contactId: props.userLogin.id,
                rate: value.rate,
                description: value.description,
                dateCreate: moment().format()
            });

            if (create) {
                if (create.data && create.data.data) {
                    if (props.callback) {
                        message.success(t('Add FeedBack Success'));

                        props.callback();

                        form.setFieldsValue({
                            description: '',
                            userName: '',
                            email: '',
                            rate: 5
                        });
                    }
                }
            }
        } else {
            const create = await commentServices.create({
                contact: {
                    userName: value.userName,
                    email: value.email
                },
                postId: props.postId,
                rate: value.rate,
                description: value.description,
                dateCreate: moment().format()
            });

            if (create) {
                if (create.data && create.data.data) {
                    if (props.callback) {
                        props.callback();
                    }
                }
            }
        }

        setLoading(false);
    }; 

    return (
        <Spin spinning={isLoading}>
            <Form form={form} initialValues={{rate: 5}} onFinish={onFinishForm} {...layout} name='comment-box'>
                <Form.Item
                    name='rate'
                    label={t('Rate')}
                >
                    <Rate tooltips={desc} allowClear={false} />
                </Form.Item>
                {isEmpty(props.userLogin) ? <>
                    <Row gutter={[16]}>
                        <Col xs={{span: 24}} md={{span: 12}}>
                            <Form.Item
                                name='userName'
                                label={t('User name')}
                                rules={[{required: true, message: t('Please input your name!')}]}
                            >
                                <Input placeholder={t('Place your name')} />
                            </Form.Item>
                        </Col>
                        <Col xs={{span: 24}} md={{span: 12}}>
                            <Form.Item
                                name='email'
                                label={t('Email')}
                                rules={[{required: true, message: t('Please input your email!')}]}
                            >
                                <Input placeholder={t('Place your email')} />
                            </Form.Item>
                        </Col>
                    </Row>
                </> : null}
                <Form.Item
                    name='description'
                    label={t('Description')}
                >
                    <Input.TextArea placeholder={t('Place your description')} />
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button htmlType='submit' type='primary' style={{width: 200}}>{t('Submit')}</Button>
                </Form.Item>
            </Form>
        </Spin>
    );
}

CommentBox.propTypes = {

};

CommentBox.defaultProps = {
    postId: ''
};

const mapStateToProps = (state) => {
    return {
        userLogin: state.layout.userLogin
    };
};

export default connect(mapStateToProps, null)(CommentBox);

