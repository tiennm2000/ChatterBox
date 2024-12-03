import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Background from '../../assets/login1.jpg';
import Victory from '../../assets/victory.svg';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import { LOGIN_ROUTE, SIGNUP_ROUTE } from '@/utils/constants';
import { useNavigate } from 'react-router-dom';
import { validateLogin, validateSignup } from '@/utils/validationAuths';
import { useAppStore } from '@/store';
import { AxiosError } from 'axios';

const Auth = () => {
  const navigate = useNavigate();
  const setUserInfo = useAppStore().setUserInfo;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [signupError, setSignupError] = useState('');

  const handleLogin = async () => {
    if (validateLogin(email, password)) {
      try {
        const response = await apiClient.post(
          LOGIN_ROUTE,
          { email, password },
          { withCredentials: true }
        );

        if (response.data.user._id) {
          setUserInfo(response.data.user);
          if (response.data.user.profileSetup) {
            navigate('/chat');
          } else {
            navigate('/profile');
          }
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          setLoginError(error.response?.data);
        }
      }
    }
  };

  const handleSignup = async () => {
    if (validateSignup(email, password, confirmPassword)) {
      try {
        const response = await apiClient.post(
          SIGNUP_ROUTE,
          { email, password },
          { withCredentials: true }
        );
        if (response.status === 201) {
          setUserInfo(response.data.user);
          navigate('/profile');
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          setSignupError(error.response?.data);
        }
      }
    }
  };

  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      <div
        className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-xl w-[80vw]
        md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2"
      >
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex flex-col justify-center items-center">
            <div className="flex items-center justify-center ">
              <h1 className="text-5xl font-bold md:text-6xl ">Welcome</h1>
              <img src={Victory} alt="victory image" className="h-[100px]" />
            </div>
            <p className="font-medium text-center">
              Fill in the details to get started with the Chatter Box
            </p>
          </div>

          <div className="flex items-center justify-center w-full ">
            <Tabs className="w-3/4" defaultValue="login">
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-transparent text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-transparent text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                >
                  SignUp
                </TabsTrigger>
              </TabsList>
              <TabsContent className="flex flex-col gap-5 mt-10" value="login">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setLoginError('')}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setLoginError('')}
                />
                {loginError && (
                  <p className="text-red-500 mt-4">{loginError}</p>
                )}
                <Button className="rounded-full p-6" onClick={handleLogin}>
                  Login
                </Button>
              </TabsContent>
              <TabsContent className="flex flex-col gap-5" value="signup">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setSignupError('')}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setSignupError('')}
                />
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  className="rounded-full p-6"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => setSignupError('')}
                />

                {signupError && (
                  <p className="text-red-500 mt-4">{signupError}</p>
                )}
                <Button className="rounded-full p-6" onClick={handleSignup}>
                  Signup
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="hidden xl:flex items-center justify-center">
          <img src={Background} alt="background-login" className="h-[500px]" />
        </div>
      </div>
    </div>
  );
};

export default Auth;
