import { message } from 'antd';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// 请求响应接口
export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
  success: boolean;
}

// 请求配置接口
export interface RequestConfig extends AxiosRequestConfig {
  skipErrorHandler?: boolean; // 跳过默认错误处理
  showSuccessMessage?: boolean; // 显示成功消息
}

class RequestService {
  private instance: AxiosInstance;

  constructor() {
    // 创建 axios 实例
    this.instance = axios.create({
      baseURL: '/api', // 基础URL，对应 .umirc.ts 中的 proxy 配置
      timeout: 10000, // 请求超时时间
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 设置请求拦截器
    this.setupRequestInterceptor();

    // 设置响应拦截器
    this.setupResponseInterceptor();
  }

  /**
   * 请求拦截器
   */
  private setupRequestInterceptor() {
    this.instance.interceptors.request.use(
      config => {
        // 在请求发送前做一些处理
        // 例如：添加 token
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // 添加时间戳防止缓存
        if (config.method === 'get') {
          config.params = {
            ...config.params,
            _t: Date.now(),
          };
        }

        return config;
      },
      error => {
        console.error('请求拦截器错误:', error);
        return Promise.reject(error);
      },
    );
  }

  /**
   * 响应拦截器
   */
  private setupResponseInterceptor() {
    this.instance.interceptors.response.use(
      (response: AxiosResponse<any>) => {
        const { data } = response;

        // 如果是文件下载等特殊响应，直接返回
        if (response.config.responseType === 'blob') {
          return response;
        }

        // 处理业务逻辑错误
        if (data.code !== 200 && data.success !== true) {
          const errorMessage = data.message || '请求失败';

          // 特殊状态码处理
          switch (data.code) {
            case 401:
              message.error('登录已过期，请重新登录');
              // 清除本地存储的用户信息
              localStorage.removeItem('token');
              localStorage.removeItem('userInfo');
              // 跳转到登录页
              window.location.href = '/login';
              break;
            case 403:
              message.error('没有权限访问该资源');
              break;
            case 404:
              message.error('请求的资源不存在');
              break;
            case 500:
              message.error('服务器内部错误');
              break;
            default:
              message.error(errorMessage);
          }

          return Promise.reject(new Error(errorMessage));
        }

        // 显示成功消息（如果配置了的话）
        const config = response.config as RequestConfig;
        if (config.showSuccessMessage && data.message) {
          message.success(data.message);
        }

        // 返回完整的 response 对象，但将 data 替换为处理后的数据
        return {
          ...response,
          data: data,
        };
      },
      error => {
        // 网络错误或其他错误处理
        const config = error.config as RequestConfig;

        if (!config?.skipErrorHandler) {
          if (error.response) {
            // 服务器返回了错误状态码
            const { status, statusText } = error.response;
            switch (status) {
              case 400:
                message.error('请求参数错误');
                break;
              case 401:
                message.error('未授权，请登录');
                break;
              case 403:
                message.error('拒绝访问');
                break;
              case 404:
                message.error('请求地址不存在');
                break;
              case 408:
                message.error('请求超时');
                break;
              case 500:
                message.error('服务器内部错误');
                break;
              case 502:
                message.error('网关错误');
                break;
              case 503:
                message.error('服务不可用');
                break;
              case 504:
                message.error('网关超时');
                break;
              default:
                message.error(`连接错误 ${status}: ${statusText}`);
            }
          } else if (error.request) {
            // 请求已发出但没有收到响应
            message.error('网络连接异常，请检查网络');
          } else {
            // 其他错误
            message.error('请求配置错误');
          }
        }

        return Promise.reject(error);
      },
    );
  }

  /**
   * GET 请求
   */
  get<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.instance.get(url, config);
  }

  /**
   * POST 请求
   */
  post<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.instance.post(url, data, config);
  }

  /**
   * PUT 请求
   */
  put<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.instance.put(url, data, config);
  }

  /**
   * DELETE 请求
   */
  delete<T = any>(
    url: string,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.instance.delete(url, config);
  }

  /**
   * PATCH 请求
   */
  patch<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.instance.patch(url, data, config);
  }

  /**
   * 文件上传
   */
  upload<T = any>(
    url: string,
    file: File | FormData,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    const formData = file instanceof FormData ? file : new FormData();
    if (file instanceof File) {
      formData.append('file', file);
    }

    return this.instance.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    });
  }

  /**
   * 文件下载
   */
  download(
    url: string,
    filename?: string,
    config?: RequestConfig,
  ): Promise<void> {
    return this.instance
      .get(url, {
        ...config,
        responseType: 'blob',
      })
      .then(response => {
        const blob = new Blob([response.data]);
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      });
  }

  /**
   * 取消请求
   */
  cancelRequest(message?: string) {
    // 这里可以实现请求取消逻辑
    // 需要在具体请求时传入 cancelToken
    if (message) {
      console.log('Request cancelled:', message);
    }
  }
}

// 创建请求实例
const request = new RequestService();

export default request;
