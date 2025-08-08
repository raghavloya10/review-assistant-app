// Payroll.js
import React, { useState } from 'react';
import {
  Card, CardContent, Typography, TextField, Button, Box
} from '@mui/material';

const Payroll = () => {
  const [employeeName, setEmployeeName] = useState('');
  const [amount, setAmount] = useState('');

  const handlePayment = () => {
    if (!employeeName || !amount) return alert("Please fill all fields");
    alert(`Payment of ₹${amount} made to ${employeeName}`);
    setEmployeeName('');
    setAmount('');
  };

  return (
    <div className="app-container">
      <Card sx={{ width: 400, margin: '1rem auto' }}>
        <CardContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Employee Name"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
            />
            <Button variant="contained" color="secondary" onClick={handlePayment}>
              Pay Employee
            </Button>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payroll;
