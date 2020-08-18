import axios from 'axios';
import { baseUrl } from '@/config/env'
import { Loading, Message } from 'element-ui';

const axiosInstance = axios.create();
axiosInstance.defaults.timeout = 6000;
axiosInstance.defaults.baseURL = baseUrl.baseUri;

var elementLoading = Loading.service
var loading;

let base_url = baseUrl;
// 错误信息
const error = (message = '遇到错误，请刷新重试！', params = {}) => {
  const default_params = {
    'message': message,
    'type': 'error'
  };

  Message(Object.assign(default_params, params));
}

const startLoading = () => {
  loading = elementLoading({
    lock: true,
    target: document.querySelector('.loading')//设置加载动画区域
  });
}

const endLoading = () => {
  loading.close();
}

let needLoadingRequestCount = 0;

const showFullScreenLoading = () => {
  if (needLoadingRequestCount === 0) {
    startLoading();
  }

  needLoadingRequestCount++;
};
const tryHideFullScreenLoading = () => {
  if (needLoadingRequestCount <= 0) return;
  
  needLoadingRequestCount--;

  if (needLoadingRequestCount === 0) {
    endLoading();
  }
};

// 请求拦截器
axiosInstance.interceptors.request.use(
  config => {
    showFullScreenLoading();

    return config;
  },
  err => {
    tryHideFullScreenLoading();
    error();
    Promise.reject(err);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  response => {
    tryHideFullScreenLoading();

    return response.data;
  },
  err => {
    tryHideFullScreenLoading();
    const result = JSON.parse(err.request.response);

    switch (result.status) {
      case 401:
      case 404:
        error(result.error.message);
        break;
      case 422:
        let message = '';
        let use_html = false;

        if (result.data && result.data instanceof Array) {
          use_html = true;
          result.data.forEach(element => {
            message = message + '<p>' + element['content'] + '</p>';
          });
        }
        error(result.error.message, { dangerouslyUseHTMLString: use_html});
        break;
      case 500:
        error(result.error.message || "服务器错误", { dangerouslyUseHTMLString: true});
        break;
      default:
        break;
    }

    return Promise.reject(err);
  }
);


export default async (params) => {
  let url = params.url;
  let bsae_url = base_url;
  url = url.startsWith('/') ? url : '/' + url;
  base_url = bsae_url.endsWith('/') ? bsae_url.substr(-2) : bsae_url;
  params.url = base_url + url;

  return axiosInstance.request(params);
}