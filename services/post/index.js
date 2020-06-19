import {services} from '../services';
import {appConfig} from '../../constant';

export function create(params) {
    return services.create({...params, API: appConfig.API_VMOTEL + '/post/create'});
}
export function getList(params) {
    return services.getList({...params, API: appConfig.API_VMOTEL + '/post/get-list'});
}
export function getPost(params) {
    return services.get({...params, API: appConfig.API_VMOTEL + '/post/get-post'});
}
export function getPaths(params) {
    return services.getList({...params, API: appConfig.API_VMOTEL + '/post/get-paths'});
}
export function del(params) {
    return services.del({...params, API: appConfig.API_VMOTEL + '/post/delete'});
}
export function delAll(params) {
    return services.create({...params, API: appConfig.API_VMOTEL + '/post/delete-all'});
}
export function update(params) {
    return services.update({...params, API: appConfig.API_VMOTEL + '/post/update'});
}
// export function getUsers(params) {
//     return services.getList({...params,API: appConfig.API + '/user/get-user'});
// }
// export function getUser(params) {
//     return services.get({...params,API: appConfig.API + '/user/get-user'});
// }