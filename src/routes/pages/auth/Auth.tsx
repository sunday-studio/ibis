import { FormEvent, useState } from 'react';

import { supabase } from '@/lib/auth/supabase';
import { ACCESS_TOKEN, USER_DATA } from '@/lib/constants';
import { setData } from '@/lib/storage';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AuthPage = () => {
  const [type, setType] = useState<'login' | 'signup'>('login');
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

    console.log({ data, error });

    setLoading(false);

    if (error) {
      toast.error(error.message);
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

  return (
    <div className="page-container auth-page">
      <div className="form-wrapper">
        <div className="form-wrapper-header">
          <h2>Opps</h2>
          <p>Ditch all your productivity apps for me.</p>
        </div>

        {type === 'login' && (
          <form onSubmit={login}>
            <div className="form-control">
              <label htmlFor="email">Email</label>
              <input required type="email" placeholder="jon@appleseed.com" name="email" />
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

            <button type="submit">{loading ? 'Doing somethings.....' : 'Login'}</button>

            <div className="footnote" onClick={() => setType('signup')}>
              No account? Signup
            </div>
          </form>
        )}

        {type === 'signup' && (
          <form onSubmit={signup}>
            <div className="form-control">
              <label htmlFor="Name">Name</label>
              <input required type="text" placeholder="Jon Appleseed" name="name" />
            </div>

            <div className="form-control">
              <label htmlFor="email">Email</label>
              <input required type="email" placeholder="jon@appleseed.com" name="email" />
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

            <button type="submit">{loading ? 'Doing somethings.....' : 'Signup'}</button>

            <div className="footnote" onClick={() => setType('login')}>
              Have an account? Login
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
