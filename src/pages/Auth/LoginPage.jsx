import React from 'react';
import Layout from '../../components/Layout';
import { LoginForm } from '../../components/Auth';

const LoginPage = () => {
  return (
    <Layout>
      <div className="flex-1">
        <LoginForm />
      </div>
    </Layout>
  );
};

export default LoginPage;