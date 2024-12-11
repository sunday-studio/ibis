import { motion } from 'framer-motion';

export const SplashScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-tauri-drag-region
      transition={{ type: 'tween', duration: 12, bounce: 0 }}
      className="splash-screen"
    >
      <p className="logo">Logo here</p>
      <p className="version">{APP_VERSION}</p>
    </motion.div>
  );
};
