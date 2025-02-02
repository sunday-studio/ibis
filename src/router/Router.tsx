import { Routes, Route } from 'react-router';
import { AppLayout } from '../components/AppLayout';

const Home = () => {
  return <div>Home</div>;
};

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  );
};
