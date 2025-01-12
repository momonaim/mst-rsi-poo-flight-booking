import React from 'react';
import { IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";

const CategoriesActions = ({ categoryId, onEdit }) => {
  const handleDelete = () => {
    axios.delete(`http://localhost:8080/categorie/${categoryId}`)
      .then(response => {
        console.log("Category deleted successfully");
        // You may want to trigger a re-fetch or remove the category from the state
      })
      .catch(error => {
        console.error("Error deleting category", error);
      });
  };

  return (
    <div>
      <IconButton onClick={() => onEdit(categoryId)}>
        <EditIcon />
      </IconButton>
      <IconButton onClick={handleDelete}>
        <DeleteIcon />
      </IconButton>
    </div>
  );
};

export default CategoriesActions;
