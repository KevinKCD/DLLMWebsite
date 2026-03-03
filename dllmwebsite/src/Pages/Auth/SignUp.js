import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import AuthForm from '../../Components/Form/AuthForm';
import './Auth.css';
import heroImg from '../../Components/Images/Homepage.jpg';

function SignUp() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSignup = async (form) => {
    const newUser = await signup(form.fullName, form.email, form.password);
    navigate(`/profile/${newUser.uid}`);
  };

  return (
    <div className="auth-layout">
      <div className="auth-left">
        <div className="auth-modal">
          <AuthForm
            title="Create an account"
            fields={[
              {
                name: 'fullName',
                label: 'Full Name',
                type: 'text',
                placeholder: 'John Doe',
              },
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
            submitText="Sign Up"
            loadingText="Creating Account..."
            onSubmit={handleSignup}
            footerText="Already have an account?"
            footerActionText="Log in"
            onFooterClick={() => navigate('/login')}
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

export default SignUp;
