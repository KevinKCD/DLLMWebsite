import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import AuthForm, { AuthField } from '../../Components/Form/AuthForm';
import heroImg from '../../Components/Images/Homepage.jpg';
import './Auth.css';

interface LoginFormValues {
  email: string;
  password: string;
  [key: string]: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user?.uid) {
      navigate(`/profile/${user.uid}`);
    }
  }, [user, loading, navigate]);

  const handleLogin = async (form: LoginFormValues) => {
    try {
      await login(form.email, form.password);
    } catch (err: any) {
      console.error('Login failed:', err.message || err);
    }
  };

  const loginFields: AuthField[] = [
    {
      name: 'email',
      label: 'Email address',
      type: 'email',
      placeholder: 'you@example.com',
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: '••••••••',
    },
  ];

  return (
    <div className="auth-layout">
      <div className="auth-left">
        <div className="auth-modal">
          <AuthForm<LoginFormValues>
            title="Login"
            fields={loginFields}
            submitText="Login"
            loadingText="Logging in..."
            onSubmit={handleLogin}
            footerText="Don't have an account?"
            footerActionText="Sign up"
            onFooterClick={() => navigate('/signup')}
          />
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-hero">
          <img src={heroImg} alt="Hero" className="auth-hero-img" />
        </div>
      </div>
    </div>
  );
};

export default Login;
