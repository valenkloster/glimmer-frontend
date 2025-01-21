import React from 'react';
import Layout from '../../components/Layout';
import { RegisterForm } from '../../components/Auth';

const RegisterPage = () => {
  return (
    <Layout>
      <div className="flex-1">
        <RegisterForm />
      </div>
    </Layout>
  );
};

export default RegisterPage;