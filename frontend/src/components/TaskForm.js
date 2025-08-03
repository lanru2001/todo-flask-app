import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { createTask, updateTask } from '../services/api';

const TaskForm = ({ open, setOpen, currentTask, setCurrentTask, fetchTasks }) => {
  const [task, setTask] = useState({
    task_name: '',
    task_description: '',
    start_date: '',
    end_date: '',
    initiator: '',
    status: 'Pending'
  });

  useEffect(() => {
    if (currentTask) {
      setTask({
        task_name: currentTask.task_name,
        task_description: currentTask.task_description,
        start_date: currentTask.start_date,
        end_date: currentTask.end_date,
        initiator: currentTask.initiator,
        status: currentTask.status
      });
    } else {
      setTask({
        task_name: '',
        task_description: '',
        start_date: '',
        end_date: '',
        initiator: '',
        status: 'Pending'
      });
    }
  }, [currentTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (currentTask) {
        await updateTask(currentTask.id, task);
      } else {
        await createTask(task);
      }
      fetchTasks();
      setOpen(false);
      setCurrentTask(null);
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>{currentTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="task_name"
          label="Task Name"
          type="text"
          fullWidth
          variant="standard"
          value={task.task_name}
          onChange={handleChange}
          required
        />
        <TextField
          margin="dense"
          name="task_description"
          label="Description"
          type="text"
          fullWidth
          variant="standard"
          multiline
          rows={3}
          value={task.task_description}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="start_date"
          label="Start Date"
          type="date"
          fullWidth
          variant="standard"
          InputLabelProps={{ shrink: true }}
          value={task.start_date}
          onChange={handleChange}
          required
        />
        <TextField
          margin="dense"
          name="end_date"
          label="End Date"
          type="date"
          fullWidth
          variant="standard"
          InputLabelProps={{ shrink: true }}
          value={task.end_date}
          onChange={handleChange}
          required
        />
        <TextField
          margin="dense"
          name="initiator"
          label="Initiator"
          type="text"
          fullWidth
          variant="standard"
          value={task.initiator}
          onChange={handleChange}
          required
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={task.status}
            label="Status"
            onChange={handleChange}
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button onClick={handleSubmit}>{currentTask ? 'Update' : 'Create'}</Button>
      </DialogActions>
    </Dialog>
  );
};
export default TaskForm;
