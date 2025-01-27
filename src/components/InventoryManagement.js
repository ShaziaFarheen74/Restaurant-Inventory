import React, { useState } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const InventoryManagement = () => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async () => {
    const newFoodItem = { name, quantity, unit };
    const token = localStorage.getItem('jwt'); 

    try {
      await axios.post('http://localhost:5000/inventory', newFoodItem, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      message.success('Food item added successfully');
      navigate('/owner-dashboard');
    } catch (error) {
      if (error.response && error.response.status === 403) {
        message.error('You are not authorized to perform this action');
      } else {
        message.error('Error adding food item');
      }
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Add Food Item</h2>
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Food Name" required>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter food name"
          />
        </Form.Item>
        <Form.Item label="Quantity" required>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter quantity"
          />
        </Form.Item>
        <Form.Item label="Unit" required>
          <Select
            value={unit}
            onChange={(value) => setUnit(value)}
            placeholder="Select unit of measurement"
          >
            <Option value="kg">kg</Option>
            <Option value="liters">liters</Option>
            <Option value="pieces">pieces</Option>
          </Select>
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Add Item
        </Button>
      </Form>
    </div>
  );
};

export default InventoryManagement;
