import { Routes, Route } from 'react-router';
import { DashboardLayout } from '../components/DashboardLayout';

const Home = () => {
  return <div>Home</div>;
};

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  );
};
