import {produce} from 'immer';

import {types} from '../actions/layout';

const initialState = {
    userLogin: {},
    path: '',
    isTry: '',
    blocks: [],
    blockSelected: {}
};

const layoutReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.USER_LOGIN:
            return (produce(state, draftState => {
                draftState.userLogin = action.payload.userLogin;
            }));
        default:
            return {...state};
    }
};

export default layoutReducer;