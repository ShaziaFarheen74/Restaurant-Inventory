import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Input, Form, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const OwnerDashboard = () => {
  const { isAuthenticated, logout, inventory, setFetchedInventory } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', quantity: '', unit: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    } else {
      const token = localStorage.getItem('jwt');
      axios.get('http://localhost:5000/inventory', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(response => {
        setFetchedInventory(response.data); // Update the context inventory with the fetched data
      }).catch(err => {
        console.error("Error fetching inventory:", err);
        message.error('Error fetching inventory. Please try again later.');
      });
    }
  }, [isAuthenticated, navigate, setFetchedInventory]);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Show modal to add a new item
  const handleAddItem = () => {
    setIsModalVisible(true);
  };

  // Close the modal without submitting
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Handle form submission for adding new item
  const handleFormSubmit = () => {
    const token = localStorage.getItem('jwt');
    const role = localStorage.getItem('role');

    // Check if form fields are filled
    if (!newItem.name || !newItem.quantity || !newItem.unit) {
      message.error('Please fill out all fields');
      return;
    }

    // Send POST request to add the new item to the inventory
    axios.post('http://localhost:5000/inventory', newItem, {
      headers: {
        Authorization: `Bearer ${token}`,
        Role: role // Include the role to make sure it's authorized
      }
    })
      .then(response => {
        // Check for success based on status code (200 or 201)
        if (response.status === 200 || response.status === 201) {
          // Update the inventory context with the new item
          setFetchedInventory(prevInventory => [...prevInventory, response.data]);

          // Reset the form and close modal
          setNewItem({ name: '', quantity: '', unit: '' });
          setIsModalVisible(false); // Close the modal
          
          message.success('Item added successfully');
        } else {
          message.error('Unexpected response from the server. Please try again later.');
        }
      })
      .catch(err => {
        // Check the error response and log accordingly
        if (err.response) {
          // Backend responded with an error
          console.error('Error adding item:', err.response.data);
          message.error(err.response.data.msg || 'Error adding item. Please try again later.');
        } else if (err.request) {
          // No response was received from the backend
          console.error('Error adding item, no response from backend:', err.request);
          message.error('No response from server. Please check your connection.');
        } else {
          // Something else went wrong (e.g., issues with axios configuration)
          console.error('Error adding item:', err.message);
          message.error('An error occurred. Please try again later.');
        }
      });
  };

  return (
    <div>
      <h2>Restaurant Owner Dashboard</h2>
      <Button type="primary" onClick={handleLogout} style={{ marginBottom: '20px' }}>
        Logout
      </Button>
      <Button type="primary" onClick={handleAddItem} style={{ marginBottom: '20px' }}>
        Add Food Item
      </Button>

      <Table
        dataSource={inventory}  // Use the inventory from context
        columns={[
          { title: 'Food Item', dataIndex: 'name' },
          { title: 'Quantity', dataIndex: 'quantity' },
          { title: 'Unit', dataIndex: 'unit' }
        ]}
        rowKey="id"
      />

      {/* Modal for adding food item */}
      <Modal
        title="Add Food Item"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form onFinish={handleFormSubmit}>
          <Form.Item label="Food Item" required>
            <Input
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              placeholder="Enter food item"
            />
          </Form.Item>
          <Form.Item label="Quantity" required>
            <Input
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
              placeholder="Enter quantity"
              type="number"
            />
          </Form.Item>
          <Form.Item label="Unit" required>
            <Input
              value={newItem.unit}
              onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
              placeholder="Enter unit"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Item
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OwnerDashboard;

