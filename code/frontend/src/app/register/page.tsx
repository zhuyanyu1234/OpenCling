'use client';

// 尝试导入相对路径，可能是别名配置问题
import AuthForm from '../../components/AuthForm';

export default function Signup() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <AuthForm 
        isLogin={false}
        invitationConfig={{
          useInvitationCode: process.env.NEXT_PUBLIC_USE_INVITATION_CODE === 'true',
          requiredCode: process.env.NEXT_PUBLIC_INVITATION_CODE
        }}
      />
    </div>
  );
}