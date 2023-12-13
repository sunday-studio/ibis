import { useState } from 'react';

import { generateNewDirectory } from '@/lib/auth/auth-helpers';
import { SAFE_LOCATION_KEY } from '@/lib/constants';
import { loadDirectoryContent } from '@/lib/data-engine/syncing-helpers';
import { setData } from '@/lib/storage';
import { open } from '@tauri-apps/api/dialog';
import { useNavigate } from 'react-router-dom';

export const Onboarding = () => {
  const [location, setLocation] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');

  const navigate = useNavigate();

  const openPicker = async () => {
    const selected = await open({
      directory: true,
      recursive: true,
    });

    setLocation(selected as unknown as string);
  };

  const createDirectoryAndStartService = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);

    const directoryName = `${location}${name ? `/${name}` : ''}`;

    try {
      await generateNewDirectory(directoryName);
      setData(SAFE_LOCATION_KEY, directoryName);
      loadDirectoryContent(directoryName);
      navigate('/today');
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container auth-page" data-tauri-drag-region>
      <div className="form-wrapper">
        <div className="form-wrapper-header">
          <h2 className="satoshi-font">Ibis</h2>
          <p>Ditch all your productivity apps for me.</p>
        </div>
        <form action="">
          <div className="form-control">
            <label htmlFor="safe-name">Safe name</label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Apple-store"
              autoCapitalize="none"
            />
          </div>

          <div className="form-control">
            <label htmlFor="safe-name">Location</label>
            <div className="location-picker" onClick={() => openPicker()}>
              <p className="geist-mono-font">{location ?? 'Pick location'}</p>
            </div>
            <span className="description">Pick a place on your workspace to put your safe</span>
          </div>

          <button
            type="submit"
            disabled={!Boolean(location)}
            onClick={createDirectoryAndStartService}
          >
            {loading ? 'Setting up for you.....' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};
