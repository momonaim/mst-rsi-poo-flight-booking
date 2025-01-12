import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
import Swal from "sweetalert2";
import axios from "axios";

const CategoriesDialog = ({ open, onClose, category, updateCategories }) => {
  const [formData, setFormData] = useState({
    nom: "",
    reduction: "",
    description: "",
  });

  useEffect(() => {
    if (category) {
      setFormData({
        nom: category.nom || "",
        reduction: category.reduction || "",
        description: category.description || "",
      });
    } else {
      setFormData({
        nom: "",
        reduction: "",
        description: "",
      });
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const url = category
      ? `http://localhost:8080/categorie/${category.id}`
      : "http://localhost:8080/categorie";
    const method = category ? "put" : "post";

    try {
      const response = await axios[method](url, formData);
      updateCategories(response.data);
      Swal.fire({
        title: "Success!",
        text: category
          ? "Category updated successfully!"
          : "Category added successfully!",
        icon: "success",
      });
      onClose();
    } catch (error) {
      console.error("Error saving category", error);
      Swal.fire({
        title: "Error!",
        text: "An error occurred while saving the category.",
        icon: "error",
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{category ? "Edit Category" : "Add Category"}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Category Name"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Discount (%)"
            name="reduction"
            value={formData.reduction}
            onChange={handleChange}
            type="number"
            fullWidth
            required
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
        >
          {category ? "Save Changes" : "Add Category"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoriesDialog;
