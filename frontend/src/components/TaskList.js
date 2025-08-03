import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography
} from '@mui/material';
import { 
  Delete as DeleteIcon, 
  Edit as EditIcon,
  Search as SearchIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { 
  getTasks, 
  deleteTask, 
  searchTasks, 
  getTasksByStatus, 
  getUpcomingTasks 
} from '../services/api';

const TaskList = ({ setCurrentTask, setOpen }) => {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [days, setDays] = useState(7);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await searchTasks(searchQuery);
      setTasks(response.data);
    } catch (error) {
      console.error('Error searching tasks:', error);
    }
  };

  const handleFilterChange = async (e) => {
    const value = e.target.value;
    setFilter(value);
    
    try {
      let response;
      if (value === 'all') {
        response = await getTasks();
      } else if (value === 'upcoming') {
        response = await getUpcomingTasks(days);
      } else {
        response = await getTasksByStatus(value);
      }
      setTasks(response.data);
    } catch (error) {
      console.error('Error filtering tasks:', error);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Task List</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => {
            setCurrentTask(null);
            setOpen(true);
          }}
        >
          Add Task
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Search tasks"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            endAdornment: (
              <Button onClick={handleSearch}>
                <SearchIcon />
              </Button>
            ),
          }}
        />

        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel>Filter</InputLabel>
          <Select
            value={filter}
            label="Filter"
            onChange={handleFilterChange}
          >
            <MenuItem value="all">All Tasks</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="upcoming">Upcoming</MenuItem>
          </Select>
        </FormControl>

        {filter === 'upcoming' && (
          <TextField
            label="Days"
            type="number"
            variant="outlined"
            size="small"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            sx={{ width: 100 }}
          />
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Initiator</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.task_name}</TableCell>
                <TableCell>{task.task_description}</TableCell>
                <TableCell>{format(new Date(task.start_date), 'MM/dd/yyyy')}</TableCell>
                <TableCell>{format(new Date(task.end_date), 'MM/dd/yyyy')}</TableCell>
                <TableCell>{task.initiator}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>
                  <Button 
                    size="small" 
                    onClick={() => {
                      setCurrentTask(task);
                      setOpen(true);
                    }}
                  >
                    <EditIcon />
                  </Button>
                  <Button 
                    size="small" 
                    onClick={() => handleDelete(task.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
export default TaskList;
