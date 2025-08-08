import React, { useState } from "react";
import {
  Container,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";

const employees = [
  "Raghav Loya",
  "Krishna Kumar",
  "Madhav Sharma",
  "Gunjan Singh",
  "Ananya Gupta",
  "Rohan Mehta",
  "Priya Verma",
  "Amit Patel",
  "Neha Sharma",
  "Vikram Rao",
];

export default function AttendancePage() {
  const [selectedEmployee, setSelectedEmployee] = useState(employees[0]);
  const [punchedInTimings, setPunchedInTimings] = useState({});

  const handlePunchIn = () => {
    if (selectedEmployee && !(selectedEmployee in punchedInTimings)) {
      const punchTime = new Date().toLocaleTimeString();
      setPunchedInTimings((prev) => ({
        ...prev,
        [selectedEmployee]: punchTime,
      }));

      // Auto-select next employee
      const nextIndex = employees.indexOf(selectedEmployee) + 1;
      if (nextIndex < employees.length) {
        setSelectedEmployee(employees[nextIndex]);
      } else {
        setSelectedEmployee("");
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      {/* Punch In Form */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <FormControl fullWidth>
            <InputLabel id="employee-label">Employee</InputLabel>
            <Select
              labelId="employee-label"
              id="employee-select"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              {employees.map((name) => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            onClick={handlePunchIn}
            disabled={!selectedEmployee}
          >
            Punch In
          </Button>
        </Box>
      </Paper>

      {/* Punch In List */}
      <h3>Punched In Today (Staff: {Object.keys(punchedInTimings).length} / { employees.length })</h3>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Employee Name</TableCell>
            <TableCell>Punch In Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(punchedInTimings).length > 0 ? (
            Object.keys(punchedInTimings).map((name) => (
              <TableRow key={name}>
                <TableCell>{name}</TableCell>
                <TableCell>{punchedInTimings[name]}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} style={{ textAlign: "center" }}>
                No one has punched in yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Container>
  );
}
