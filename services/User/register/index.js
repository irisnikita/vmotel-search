import {services} from '../../services';
import {appConfig} from '../../../constant';

export function create(params) {
    return services.create({...params,API: appConfig.API + '/user/register'});
}