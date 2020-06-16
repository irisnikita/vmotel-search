// Libraries
import React, {useState, useEffect} from 'react';
import {Slider, Row, Col, Dropdown, Button, Menu} from 'antd';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import numeral from 'numeral';

function SliderCus(props) {
    // Props
    const {min, max, step, title, type, callback, wrapperTitle, defaultValue} = props;
    const [range, setRange] = useState([0,50]);
    const [isOpen, setOpen] = useState(false);
    const [rangeSelect, setRangeSelect] = useState([0, 50]);

    const {t} = useTranslation();

    const tipFormatter = (value) => {
        let price = value * 1000000;
        const sub = <sub>2</sub>;

        switch (type) {
            case 'price':
                return `${numeral(price).format('0,0')} vnđ`;

            case 'area':
                return (`${value * 10} m2`);

            default:
                return `${numeral(price).format('0,0')} vnđ`;
        }
    };

    useEffect(() => {
        if (defaultValue) {
            setRangeSelect(defaultValue);
            setRangeSelect(defaultValue);
        } else {
            setRange([min, max]);
            setRangeSelect([min, max]);
        }
    }, [min, max, defaultValue]);

    useEffect(() => {
        setRange(rangeSelect);
    }, [isOpen]);

    const onChangeSlider = (value) => {
        setRange(value);
    };

    const showRenderRange = () => {
        switch (type) {
            case 'price':
                return (
                    <>
                        <strong>{numeral(range[0] * 1000000).format('0,0')} vnđ</strong> &nbsp;
                        <div>-</div>&nbsp;
                        <strong>{numeral(range[1] * 1000000).format('0,0')}{range[1] === max ? '+' : null} vnđ</strong>
                    </>
                );
            case 'area': 
                return (
                    <>
                        <strong>{range[0] * 10} m<sup>2</sup></strong> &nbsp;
                        <div>-</div>&nbsp;
                        <strong>{range[1] * 10}{range[1] === max ? '+' : null}  m<sup>2</sup></strong>
                    </>
                );
            default:
                break;
        }
    };

    const onClickApply = () => {
        setRangeSelect(range);
        if (callback) {
            callback(range);
        }
    };

    return (
        <div className='d-flex row left'> 
            <strong>{t(wrapperTitle)}:</strong>
            <Dropdown
                trigger={['click']}
                placement='bottomCenter'
                overlay={
                    <Menu style={{width: 500, padding: 20}}>
                        <div className='d-flex' style={{fontSize: '15px'}}>
                            {showRenderRange()}
                        </div>
                        <div className='d-flex space-between' >
                            <strong>{type === 'price' ? t('Minimum price') : t('Minimum area')}</strong>
                            <Slider onChange={onChangeSlider} tipFormatter={tipFormatter} range max={max} value={range} style={{width: 200}} step={step} />
                            <strong>{type === 'price' ? t('Maximum price') : t('Maximum area')}</strong>
                        </div>
                        <div  />
                        <Menu.Item className='d-flex space-between' style={{padding: '0px'}}>
                            <Button style={{width: 200}} danger>{t('Cancel')}</Button>
                            <Button style={{width: 200}} onClick={onClickApply} type='primary'>{t('Apply')}</Button>
                        </Menu.Item>
                    </Menu>
                }
            >
                <Button style={{width: props.width ? props.width : 200}} onClick={() => setOpen(!isOpen)}>{t(title)}</Button>
            </Dropdown>
        </div>
    );
}

SliderCus.defaultProps = {
    min: 0,
    max: 50,
    step: 0.5,
    title: 'Select prices',
    type: 'price',
    wrapperTitle: 'Select prices'
};

SliderCus.propTypes = {
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number
};

export default  SliderCus;
