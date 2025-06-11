import { SignIn } from '@clerk/clerk-react';

const SignInPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <SignIn 
        appearance={{
          variables: {
            colorPrimary: '#6366f1',
          },
        }}
        routing="path"
        path="/sign-in"
      />
    </div>
  );
};

export default SignInPage;