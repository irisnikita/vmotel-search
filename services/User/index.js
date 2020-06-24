import {services} from '../services';
import {appConfig} from '../../constant';

export function create(params) {
    return services.create({...params,API: appConfig.API_VMOTEL + '/user/login'});
}
export function register(params) {
    return services.create({...params,API: appConfig.API_VMOTEL + '/user/register'});
}
export function validate(params) {
    return services.create({...params,API: appConfig.API_VMOTEL + '/user/validate'});
}
// export function getUsers(params) {
//     return services.getList({...params,API: appConfig.API_VMOTEL + '/user/get-user'});
// }
export function getUser(params) {
    return services.get({...params,API: appConfig.API_VMOTEL + '/user/get-user'});
}