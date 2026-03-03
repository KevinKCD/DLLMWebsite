import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import AuthForm from '../../Components/Form/AuthForm';
import heroImg from '../../Components/Images/Homepage.jpg';
import './Auth.css';

function Login() {
  const navigate = useNavigate();
  const { login, user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user?.uid) {
      navigate(`/profile/${user.uid}`);
    }
  }, [user, loading, navigate]);

  const handleLogin = async (form) => {
    await login(form.email, form.password);
  };

  return (
    <div className="auth-layout">
      <div className="auth-left">
        <div className="auth-modal">
          <AuthForm
            title="Login"
            fields={[
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
            ]}
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
}

export default Login;
