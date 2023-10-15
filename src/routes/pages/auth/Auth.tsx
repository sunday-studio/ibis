import { useState } from 'react';

import { generateNewDirectory } from '@/lib/auth/auth-helpers';
import { supabase } from '@/lib/auth/supabase';
import { ACCESS_TOKEN, USER_DATA } from '@/lib/constants';
import { setData } from '@/lib/storage';
import { open } from '@tauri-apps/api/dialog';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type Views = 'login' | 'signup' | 'onboarding';

type ViewType = React.ReactNode | JSX.Element | (() => JSX.Element) | any;

const Onboarding = () => {
  const [location, setLocation] = useState<null | string>(null);
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const openPicker = async () => {
    const selected = await open({
      directory: true,
    });
    setLocation(selected as unknown as string);
  };

  const createDirectoryAndStartService = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);

    const directoryName = `${location}/${name}`;

    try {
      await generateNewDirectory(directoryName);

      const { data, error } = await supabase.auth.updateUser({
        data: {
          hasCompletedOnboarding: true,
          safeDirectory: directoryName,
        },
      });

      setLoading(false);

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success(`${name} safe is all set up and ready to go`);

      if (data) {
        navigate('/');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form action="">
      <div className="form-control">
        <label htmlFor="safe-name">Safe name</label>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Apple-store"
          required
          autoCapitalize="none"
        />
      </div>

      <div className="form-control">
        <label htmlFor="safe-name">Location</label>
        <div className="location-picker" onClick={() => openPicker()}>
          {location ?? 'Pick location'}
        </div>
        <span className="description">Pick a place on your workspace to put your safe</span>
      </div>

      <button type="submit" onClick={createDirectoryAndStartService}>
        {loading ? 'Setting up for you.....' : 'Continue'}
      </button>
    </form>
  );
};

const AuthPage = () => {
  const [type, setType] = useState<Views>('login');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    // check if user has completed onboarding & has directory route
    if (
      !data?.user?.user_metadata?.hasCompletedOnboarding ||
      !data?.user?.user_metadata?.safeDirectory
    ) {
      setData(USER_DATA, data?.session);
      setData(ACCESS_TOKEN, data?.session?.access_token);
      setType('onboarding');
      return;
    }

    if (data) {
      setData(USER_DATA, data?.session);
      setData(ACCESS_TOKEN, data?.session?.access_token);
      navigate('/');
    }
  };

  const signup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      options: {
        data: {
          hasCompletedOnboarding: false,
          name: formData.get('name'),
        },
      },
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    if (data) {
      toast.success('Account created sucessfully, now you can log in and join us on the good side');
      setType('login');
    }
  };

  const viewToRender: Record<Views, ViewType> = {
    login: (
      <form onSubmit={login}>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input
            autoCapitalize="none"
            required
            type="email"
            placeholder="jon@appleseed.com"
            name="email"
          />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input
            autoCapitalize="none"
            required
            placeholder="something stronger than coffee"
            type="password"
            name="password"
          />
        </div>

        <button type="submit">{loading ? 'Doing somethings.....' : 'Login'}</button>
        <div className="footnote" onClick={() => setType('signup')}>
          No account? Signup
        </div>
      </form>
    ),

    signup: (
      <form onSubmit={signup}>
        <div className="form-control">
          <label htmlFor="Name">Name</label>
          <input
            autoCapitalize="none"
            required
            type="text"
            placeholder="Jon Appleseed"
            name="name"
          />
        </div>

        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input
            autoCapitalize="none"
            required
            type="email"
            placeholder="jon@appleseed.com"
            name="email"
          />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input
            required
            placeholder="something stronger than black"
            type="password"
            name="password"
          />
        </div>

        <button type="submit">{loading ? 'Doing somethings.....' : 'Create an account'}</button>
        <div className="footnote" onClick={() => setType('login')}>
          Have an account? Login
        </div>
      </form>
    ),
    onboarding: <Onboarding />,
  };

  return (
    <div className="page-container auth-page">
      <div className="form-wrapper">
        <div className="form-wrapper-header">
          <h2>Opps</h2>
          <p>Ditch all your productivity apps for me.</p>
        </div>
        {viewToRender?.[type]}
      </div>
    </div>
  );
};

export default AuthPage;
