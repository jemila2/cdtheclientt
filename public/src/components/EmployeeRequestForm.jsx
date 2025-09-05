import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const EmployeeRequestForm = () => {
  const { user, api } = useAuth();
  const [formData, setFormData] = useState({
    position: '',
    experience: '',
    skills: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare the request data
      const requestData = {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        ...formData,
        status: 'pending',
        requestedAt: new Date().toISOString()
      };

      // DEBUG: Log what we're sending
      console.log('Submitting employee request:', requestData);
      
      // Use the api instance but with the correct endpoint
      // If your api instance already adds /api, use '/employee-requests'
      // If it doesn't, use '/api/employee-requests'
      await api.post('/employee-requests', requestData);
      
      toast.success('Employee request submitted! An admin will review your application.');
      setHasRequested(true);
    } catch (error) {
      console.error('Request error:', error);
      
      // More detailed error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        
        if (error.response.status === 404) {
          toast.error('Server endpoint not found. Please contact support.');
        } else if (error.response.status === 500) {
          toast.error('Server error. Please try again later.');
        } else {
          toast.error(`Error: ${error.response.data.message || 'Failed to submit request'}`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        toast.error('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request
        console.error('Request setup error:', error.message);
        toast.error('Failed to submit employee request. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Test the API endpoint directly as a debug option
  const testEndpoint = async () => {
    try {
      console.log('Testing endpoint...');
      // Try different endpoint variations to see what works
      const response1 = await fetch('https://backend-21-2fu1.onrender.com/api/employee-requests', {
        method: 'OPTIONS' // Use OPTIONS to check if endpoint exists without sending data
      });
      console.log('Direct fetch test result:', response1.status, response1.statusText);
      
      // Also test what your api instance is doing
      try {
        const response2 = await api.get('/employee-requests');
        console.log('API instance test result:', response2.status);
      } catch (apiError) {
        console.error('API instance test failed:', apiError);
      }
    } catch (error) {
      console.error('Endpoint test failed:', error);
    }
  };

  if (hasRequested) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h3 className="text-xl font-bold text-green-600 mb-2">Request Submitted!</h3>
        <p className="text-gray-600">
          Your employee request has been sent for admin approval. 
          You'll be notified once it's reviewed.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Request Employee Status</h3>
      <p className="text-gray-600 mb-4">
        Fill out this form to request becoming an employee. An admin will review your request.
      </p>
      
      {/* Debug button - you can remove this in production */}
      <button 
        onClick={testEndpoint}
        className="mb-4 px-3 py-1 bg-gray-200 text-xs rounded"
        type="button"
      >
        Test Endpoint Connection
      </button>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="block text-sm font-medium text-gray-700">Desired Position</div>
          <select
            required
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          >
            <option value="">Select a position</option>
            <option value="Laundry Attendant">Laundry Attendant</option>
            <option value="Dry Cleaning Specialist">Dry Cleaning Specialist</option>
            <option value="Customer Service">Customer Service</option>
            <option value="Delivery Driver">Delivery Driver</option>
            <option value="Manager">Manager</option>
          </select>
        </div>
        
        <div>
          <div className="block text-sm font-medium text-gray-700">
            Experience (years)
          </div>
          <input
            type="number"
            min="0"
            required
            value={formData.experience}
            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>
        
        <div>
          <div className="block text-sm font-medium text-gray-700">
            Relevant Skills
          </div>
          <textarea
            value={formData.skills}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            rows="3"
            placeholder="List any relevant skills or qualifications..."
          />
        </div>
        
        <div>
          <div className="block text-sm font-medium text-gray-700">
            Why do you want to become an employee?
          </div>
          <textarea
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            rows="3"
            placeholder="Explain why you want to work with us..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400 font-medium transition-colors"
        >
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
};

export default EmployeeRequestForm;
