import React, { useState, useEffect } from 'react'; 
import { Table, Button } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ManagerDashboard = () => {
  const [inventory, setInventory] = useState([]);
  const token = localStorage.getItem('jwt');
  const navigate = useNavigate();
  const { logout } = useAuth(); 

  useEffect(() => {
    if (!token) {
      navigate('/');
    } else {
      axios.get('http://localhost:5000/inventory', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(response => {
        setInventory(response.data);
      }).catch(err => {
        console.error(err);
      });
    }
  }, [token, navigate]);

  const handleLogout = () => {
    logout(); 
    navigate('/'); 
  };

  return (
    <div>
      <h2>Restaurant Manager Dashboard</h2>
      <Button type="primary" onClick={handleLogout} style={{ marginBottom: '20px' }}>
        Logout
      </Button>
      <Table 
        dataSource={inventory} 
        columns={[
          { title: 'Food Item', dataIndex: 'name' },
          { title: 'Quantity', dataIndex: 'quantity' },
          { title: 'Unit', dataIndex: 'unit' }
        ]} 
        rowKey="id" 
      />
    </div>
  );
};

export default ManagerDashboard;

