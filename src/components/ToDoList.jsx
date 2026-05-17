import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
} from "../Api_Routes/routes";

const ToDoList = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const { data, isLoading, error, mutate } = useSWR(
    "todos",
    () => getTodos().then((res) => res.data.todos),
    { revalidateOnFocus: false, revalidateOnReconnect: false },
  );

  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [todoText, setTodoText] = useState("");
  const [deleteItem, setDeleteItem] = useState(null);

  const handleOpen = (todo = null) => {
    setEditItem(todo);
    setTodoText(todo ? todo.todo : "");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditItem(null);
    setTodoText("");
  };

  const handleSave = async () => {
    if (!todoText.trim()) return;
    if (editItem) {
      await updateTodo(editItem.id, { todo: todoText });
      mutate(
        data.map((t) => (t.id === editItem.id ? { ...t, todo: todoText } : t)),
        false,
      );
    } else {
      const res = await addTodo({
        todo: todoText,
        completed: false,
        userId: 1,
      });
      mutate([...data, res.data], false);
    }
    handleClose();
  };

  const handleDelete = async () => {
    await deleteTodo(deleteItem.id);
    mutate(
      data.filter((t) => t.id !== deleteItem.id),
      false,
    );
    setDeleteItem(null);
  };

  const INPUT_HEIGHT = 46;
  const INPUT_RADIUS = 10;

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      height: INPUT_HEIGHT,
      borderRadius: `${INPUT_RADIUS}px`,
      fontSize: 14,
      fontFamily: "'Poppins', sans-serif",
      "& fieldset": {
        border: `1px solid "#5c5c5c"`,
      },
      "&.Mui-focused": {
        boxShadow: "none",
        outline: "none",
      },
      "& input:focus-visible": {
        outline: "none",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#5c5c5c",
        borderWidth: "2px",
      },
      "&:hover fieldset": {
        borderColor: "#5c5c5c",
      },
    },

    "& .MuiOutlinedInput-input": {
      padding: "0 14px",
      height: "100%",
      display: "flex",
      alignItems: "center",
      boxSizing: "border-box",
    },

    "& .MuiInputAdornment-root": {
      marginRight: 0,
      outline: "none !important",
    },
  };

  return (
    <Container maxWidth="md" sx={{ pt: "10px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight={700}>
          ToDo List
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="contained" sx={{ textTransform: "capitalize" }}>
            Add ToDo
          </Button>

          <Button
            variant="outlined"
            color="error"
            onClick={handleLogout}
            sx={{ textTransform: "capitalize" }}
          >
            Logout
          </Button>
        </Box>
      </Box>

      <Box>
        {isLoading && (
          <Typography textAlign="center" sx={{ m: 20 }}>
            Loading...
          </Typography>
        )}
        {error && (
          <Typography textAlign="center" color="error">
            Failed to load todos
          </Typography>
        )}
        <List>
          {data?.map((todo) => (
            <ListItem
              key={todo.id}
              disablePadding
              sx={{ textWrap: "wrap" }}
              secondaryAction={
                <Box>
                  <IconButton onClick={() => handleOpen(todo)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => setDeleteItem(todo)}>
                    <Delete />
                  </IconButton>
                </Box>
              }
            >
              <Checkbox checked={todo.completed} disabled />
              <ListItemText
                primary={todo.todo}
                sx={{
                  "& .MuiListItemText-primary": {
                    fontSize: { xs: 10, sm: 16 },
                  },
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* delete confirmation dialog */}
      <Dialog
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "10px",
            width: { xs: "auto", sm: 400 },
          },
        }}
      >
        <DialogTitle sx={{ fontSize: { xs: 16, sm: 20 }, fontWeight: 600 }}>
          Delete Todo
        </DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this todo?</Typography>
        </DialogContent>
        <DialogActions sx={{ p: "0px 24px 20px 24px" }}>
          <Button
            variant="outlined"
            onClick={() => setDeleteItem(null)}
            sx={{
              textTransform: "capitalize",
              width: "100%",
              borderRadius: "8px",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            sx={{
              textTransform: "capitalize",
              width: "100%",
              borderRadius: "8px",
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* add todo dialog  */}
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "10px",
            width: { xs: "auto", sm: 400 },
          },
        }}
      >
        <DialogTitle sx={{ fontSize: { xs: 16, sm: 20 }, fontWeight: 600 }}>
          {editItem ? "Edit Todo" : "Add Todo"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            value={todoText}
            onChange={(e) => setTodoText(e.target.value)}
            placeholder="Enter todo"
            sx={textFieldSx}
          />
        </DialogContent>
        <DialogActions sx={{ p: "0px 24px 20px 24px" }}>
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{
              textTransform: "capitalize",
              width: "100%",
              borderRadius: "8px",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              textTransform: "capitalize",
              width: "100%",
              borderRadius: "8px",
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ToDoList;
