import {services} from '../services';
import {appConfig} from '../../constant';

export function create(params) {
    return services.create({...params, API: appConfig.API_VMOTEL + '/comment/create'});
}
export function getList(params) {
    return services.getList({...params, API: appConfig.API_VMOTEL + '/comment/get-comments'});
}