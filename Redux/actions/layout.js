export const types = {
    USER_LOGIN: 'USER_LOGIN'
};

export function userLogin(payload) {
    return {type: types.USER_LOGIN, payload};
}