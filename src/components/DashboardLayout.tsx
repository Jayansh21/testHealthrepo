
import { ReactNode, useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isDoctor, setIsDoctor] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkIfDoctor = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        const { data: user } = await supabase.auth.getUser();
        
        // For demo purposes, we'll check if the email contains "neha" or "sharma"
        // In production, you'd have a proper doctor role system
        const isDrNeha = 
          user?.user?.email?.toLowerCase().includes('neha') || 
          user?.user?.email?.toLowerCase().includes('sharma');
        
        setIsDoctor(isDrNeha);
      }
    };
    
    checkIfDoctor();
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        {isDoctor && (
          <div className="bg-blue-50 p-3 border-b border-blue-200">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <p className="text-sm text-blue-700">
                You are logged in as Dr. Neha Sharma
              </p>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-blue-700 border-blue-200 hover:bg-blue-100"
                onClick={() => navigate('/doctor-dashboard')}
              >
                Go to Doctor Dashboard
              </Button>
            </div>
          </div>
        )}
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
