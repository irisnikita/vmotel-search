import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {Row, Col} from 'antd';
import {useTranslation} from 'react-i18next';

import styles from './styles.module.scss';

import {ToTopOutlined, DeleteOutlined} from '@ant-design/icons';

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function Upload(props) {
    const [images, setImages] = useState([]);
    const {t} = useTranslation();

    const onChangeUpload = async (event) => {
        event.preventDefault();

        const {files} = event.target;

        let newImages = [...images];

        for (let file of files) {
            let data = new FormData();

            data.append('file', files[file]);

            const getBase = await getBase64(file);

            newImages.push({
                data: data,
                src: getBase
            });
        }

        setImages(newImages);
    };

    useEffect(() => {
        console.log(images);
    }, [images]);

    const onClickDelete = (index) => {
        const newImages = [...images];

        newImages.splice(index, 1);

        setImages(newImages)
    }

    return (
        <div>
            <div className={styles['upload-posts']}>
                <div className='d-flex center'>
                    <ToTopOutlined /> &nbsp;
                    <div>Upload</div>
                </div>
                <input type='file' id='file' name='file' multiple onChange={onChangeUpload} />
            </div>
            <Row gutter={[16, 16]} style={{marginTop: 20}}>
                {
                    images && images.length > 0 ? images.map((image, index) => {
                        return (
                            <Col key={index} span={8}>
                                <div 
                                    className={styles['image-item']} 
                                    style={{backgroundImage: `url(${image.src})`}}
                                >
                                    <div className={styles['delete-wrapper']} onClick={() => onClickDelete(index)}>
                                    <DeleteOutlined /> &nbsp;
                                    <div>{t('Delete image')}</div>
                                    </div>
                                </div>
                            </Col>
                        );
                    }) : null
                }
            </Row>
        </div>
    );
}

Upload.propTypes = {

};

export default Upload;

