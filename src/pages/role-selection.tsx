import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useRole } from '../context/RoleContext';
import { Button } from '../components/ui/button';

const RoleSelectionPage = () => {
  const { setRole, clearRole } = useRole();
  const [, setLocation] = useLocation();

  useEffect(() => {
    clearRole();
  }, [clearRole]);

  const handleRoleSelection = (role: 'chef' | 'user') => {
    setRole(role);
    setLocation('/');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-8">Welcome to TastyEats</h1>
      <p className="text-lg mb-8">Please select your role:</p>
      <div className="flex space-x-4">
        <Button onClick={() => handleRoleSelection('chef')}>I'm a Chef</Button>
        <Button onClick={() => handleRoleSelection('user')}>I'm a Customer</Button>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
