import { Suspense } from 'react';
import ResetPasswordClient from '../../components/ResetPasswordClient';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <ResetPasswordClient />
    </Suspense>
  );
}
