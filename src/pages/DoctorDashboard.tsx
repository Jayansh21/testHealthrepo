
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

// Doctor Dashboard specific to Dr. Neha Sharma
const DoctorDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctorUser, setDoctorUser] = useState(null);

  // Check if the logged in user is Dr. Neha Sharma
  useEffect(() => {
    const checkDoctor = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        const { data: user } = await supabase.auth.getUser();
        
        // For demo purposes, we'll check if the email contains "neha" or "sharma"
        // In production, you'd have a proper doctor role system
        const isDrNeha = 
          user?.user?.email?.toLowerCase().includes('neha') || 
          user?.user?.email?.toLowerCase().includes('sharma');
        
        if (!isDrNeha) {
          toast({
            title: "Access Denied",
            description: "This dashboard is only for Dr. Neha Sharma",
            variant: "destructive"
          });
          navigate('/dashboard');
          return;
        }
        
        setDoctorUser(user?.user);
        fetchAppointments();
      } else {
        toast({
          title: "Authentication Required",
          description: "Please sign in to access the doctor dashboard",
          variant: "destructive"
        });
        navigate('/');
      }
    };
    
    checkDoctor();
  }, [navigate, toast]);

  const fetchAppointments = async () => {
    setLoading(true);
    
    try {
      // Get pending and scheduled appointments
      const { data: currentAppts, error: currentError } = await supabase
        .from('appointments')
        .select('*')
        .eq('doctor_name', 'Dr. Neha Sharma')
        .in('status', ['pending', 'scheduled'])
        .order('appointment_date', { ascending: true });
      
      if (currentError) throw currentError;
      
      // Get past (completed or rejected) appointments
      const { data: pastAppts, error: pastError } = await supabase
        .from('appointments')
        .select('*')
        .eq('doctor_name', 'Dr. Neha Sharma')
        .in('status', ['completed', 'rejected'])
        .order('appointment_date', { ascending: false });
      
      if (pastError) throw pastError;
      
      setAppointments(currentAppts || []);
      setPastAppointments(pastAppts || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({
        title: "Failed to load appointments",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: `Appointment ${newStatus}`,
        description: `You have ${newStatus} the appointment`
      });
      
      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast({
        title: "Failed to update appointment",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getConsultationTypeLabel = (type) => {
    switch (type) {
      case 'in-person':
        return <Badge className="bg-blue-500">In-Person</Badge>;
      case 'video':
        return <Badge className="bg-purple-500">Video</Badge>;
      case 'chat':
        return <Badge className="bg-green-500">Chat</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>;
      case 'scheduled':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Scheduled</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Completed</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDateTime = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy - h:mm a');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Doctor Dashboard</h1>
            <p className="text-gray-500">Welcome, Dr. Neha Sharma</p>
          </div>
          <Button 
            onClick={() => fetchAppointments()}
            variant="outline"
            className="flex items-center gap-2 self-start"
          >
            <Calendar className="h-4 w-4" />
            Refresh Appointments
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {appointments.filter(a => a.status === 'pending').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Scheduled Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {appointments.filter(a => {
                  const today = new Date().toISOString().split('T')[0];
                  return a.status === 'scheduled' && 
                    a.appointment_date.includes(today);
                }).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {appointments.length + pastAppointments.length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming Appointments</TabsTrigger>
            <TabsTrigger value="past">Past Appointments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                {loading ? (
                  <div className="flex justify-center py-6">Loading appointments...</div>
                ) : appointments.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    No upcoming appointments
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {appointments.map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell className="font-medium">
                            {appointment.patient_name || 'Patient #' + appointment.user_id.substring(0, 6)}
                          </TableCell>
                          <TableCell>
                            {formatDateTime(appointment.appointment_date)}
                          </TableCell>
                          <TableCell>
                            {getConsultationTypeLabel(appointment.consultation_type)}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(appointment.status)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {appointment.status === 'pending' && (
                                <>
                                  <Button 
                                    onClick={() => handleStatusChange(appointment.id, 'scheduled')}
                                    size="sm" 
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <Check className="mr-1 h-4 w-4" />
                                    Accept
                                  </Button>
                                  <Button 
                                    onClick={() => handleStatusChange(appointment.id, 'rejected')}
                                    size="sm"
                                    variant="destructive"
                                  >
                                    <X className="mr-1 h-4 w-4" />
                                    Reject
                                  </Button>
                                </>
                              )}
                              {appointment.status === 'scheduled' && (
                                <Button 
                                  onClick={() => handleStatusChange(appointment.id, 'completed')}
                                  size="sm"
                                >
                                  Mark Complete
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="past" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                {loading ? (
                  <div className="flex justify-center py-6">Loading appointments...</div>
                ) : pastAppointments.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    No past appointments
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pastAppointments.map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell className="font-medium">
                            {appointment.patient_name || 'Patient #' + appointment.user_id.substring(0, 6)}
                          </TableCell>
                          <TableCell>
                            {formatDateTime(appointment.appointment_date)}
                          </TableCell>
                          <TableCell>
                            {getConsultationTypeLabel(appointment.consultation_type)}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(appointment.status)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
