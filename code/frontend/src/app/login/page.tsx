'use client';

import AuthForm from '@/components/AuthForm';

export default function Login() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <AuthForm 
        isLogin={true}
        invitationConfig={{
          useInvitationCode: process.env.NEXT_PUBLIC_USE_INVITATION_CODE === 'true',
          requiredCode: process.env.NEXT_PUBLIC_INVITATION_CODE
        }}
      />
    </div>
  );
}