import axios from 'axios';
import { baseUrl } from '@/env'
import { Loading, Message } from 'element-ui';

const axiosInstance = axios.create();
axiosInstance.defaults.timeout = 6000;
axiosInstance.defaults.baseURL = baseUrl.baseUri;

var elementLoading = Loading.service
var loading;

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
axiosInstance.interceptors.response.use(function (res) {
  tryHideFullScreenLoading();

  return res.data;
}, function (error) {
  tryHideFullScreenLoading();

  const result = JSON.parse(error.request.response);
  switch (error.request.status) {
    case 401:
      error(result.error.message);
      break;
    case 422:
      let message = '';
      result.data.forEach(element => {
        message = message + '<p>' + element['content'] + "</p>";
      });
      error(result.error.message, { dangerouslyUseHTMLString: true});
      break;
    case 500:
      error(result.error.message || "服务器错误", { dangerouslyUseHTMLString: true});
      break;
    default:
      break;
  }

  return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
  response => {
    tryHideFullScreenLoading();
    
    return res.data;
  },
  error => {

  }
);

export default async () => {
}