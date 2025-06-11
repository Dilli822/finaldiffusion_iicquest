import { SignUp } from '@clerk/clerk-react';

const SignUpPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <SignUp
        appearance={{
          variables: {
            colorPrimary: '#6366f1',
            margin: '20px',
          },
          elements: {
            formFieldInput: {
              baseTheme: ['light'],
            },
            formFieldLabel: {
              textAlign: 'left',
            },
          },
        }}
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        after_sign_up_url='/'
      />
    </div>
  );
};

export default SignUpPage;