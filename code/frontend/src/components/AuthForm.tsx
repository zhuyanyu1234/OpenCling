'use client';

import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
type AxiosError = {
  isAxiosError: boolean;
  response?: {
    data?: {
      message?: string;
    };
  };
};

// 自定义函数判断是否为 Axios 错误
const isAxiosError = (error: unknown): error is AxiosError => {
  return (error as AxiosError).isAxiosError === true;
};

export default function AuthForm({
  isLogin,
  invitationConfig
}: {
  isLogin: boolean;
  invitationConfig: {
    useInvitationCode: boolean;
    requiredCode?: string;
  };
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [invitationCode, setInvitationCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert('邮箱和密码为必填项');
      return;
    }

    if (invitationConfig.useInvitationCode && (!invitationCode || invitationCode !== invitationConfig.requiredCode)) {
      alert('邀请码无效');
      return;
    }

    try {
      const endpoint = isLogin ? '/api/login' : '/api/signup';
      const { data } = await axios.post(endpoint, { email, password });
      
      // 定义 data 的类型
      type ResponseData = {
        success: boolean;
      };

      // 类型断言，将 data 断言为 ResponseData 类型
      if ((data as ResponseData).success) {
        window.location.href = '/';
      }
    } catch (error) {
        if (isAxiosError(error)) {
        const axiosError = error as any;
        alert(axiosError.response?.data?.message || '请求失败');
      } else {
        alert('请求失败');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 p-8 bg-gray-900 rounded-lg">
      <div>
        // 移除国际化残留属性
        <label className="block text-sm font-medium mb-2">
          邮箱
        </label>
        
        // 同步所有标签结构
        <label className="block text-sm font-medium mb-2">
          密码
        </label>
        
        // 确保服务端与客户端渲染一致
        {invitationConfig.useInvitationCode && (
          <div>
            <label className="block text-sm font-medium mb-2">
              邀请码
            </label>
          </div>
        )}
        <input
          type="email"
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">密码</label>
        <input
          type="password"
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      
      {invitationConfig.useInvitationCode && (
        <div>
          <label className="block text-sm font-medium mb-2">邀请码</label>
          <input
            type="text"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500"
            value={invitationCode}
            onChange={(e) => setInvitationCode(e.target.value)}
          />
        </div>
      )}
      
      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
      >
        {isLogin ? '立即登录' : '注册账号'}
      </button>
      
      <p className="text-center mt-4 text-gray-300">
        {isLogin ? '没有账号？' : '已有账号？'}
        <Link
          href={isLogin ? '/register' : '/login'}
          className="text-blue-400 hover:text-blue-300 underline ml-1"
        >
          {isLogin ? '立即注册' : '立即登录'}
        </Link>
      </p>
    </form>
  );
}