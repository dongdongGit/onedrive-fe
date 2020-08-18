import fetch from '@/config/fetch'
import request from '@/utils/request'

/**
 * 登陆
 */
export const login = data => request({
    url: `admin/login`,
    data: data,
    method: 'POST'
});

/**
 * 用户信息
 */
export const session = () => request({url: `admin/session`,});

