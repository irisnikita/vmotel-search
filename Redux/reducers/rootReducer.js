import layoutReducer from '../reducers/layout';
import {combineReducers} from 'redux';

const rootReducer = combineReducers({
    layout: layoutReducer
});

export default rootReducer;