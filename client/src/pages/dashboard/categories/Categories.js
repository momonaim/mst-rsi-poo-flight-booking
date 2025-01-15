import React, { useEffect, useState } from 'react';
import MUIDataTable from "mui-datatables";
import { Box, Typography, Button, IconButton } from "@mui/material";
import ModeEdit from '@mui/icons-material/Edit';
import GridDeleteIcon from '@mui/icons-material/Delete';
import Visibility from '@mui/icons-material/Visibility';
import Swal from 'sweetalert2';
import axios from 'axios';
import CategoriesDialog from "./CategoriesDialog";
import CategorieViewDialog from './CategorieViewDialog';

const Categories = ({ setSelectedLink, link }) => {
  const [categories, setCategories] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);

  const handleViewOpen = (categorie) => {
    setCurrentCategory(categorie);
    setViewOpen(true);
  };

  const handleViewClose = () => {
    setViewOpen(false);
    setCurrentCategory(null);
  };

  useEffect(() => {
    setSelectedLink(link);
    axios.get("http://localhost:8080/categories")
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error("Error fetching categories", error);
      });
  }, [link, setSelectedLink]);

  const handleDialogOpen = (category) => {
    setCurrentCategory(category);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setCurrentCategory(null);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8080/categorie/${id}`);
          setCategories(categories.filter(category => category.id !== id));
          Swal.fire("Deleted!", "The category has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting category", error);
          Swal.fire("Error!", "Failed to delete the category.", "error");
        }
      }
    });
  };

  const updateCategories = (newCategory) => {
    setCategories((prevCategories) => {
      const index = prevCategories.findIndex(category => category.id === newCategory.id);
      if (index !== -1) {
        const updatedCategories = [...prevCategories];
        updatedCategories[index] = newCategory;
        return updatedCategories;
      }
      return [...prevCategories, newCategory];
    });
  };

  const columns = [
    { name: 'id', label: 'ID' },
    { name: 'nom', label: 'Category Name' },
    { name: 'reduction', label: 'Discount (%)' },
    { name: 'description', label: 'Description' },
    {
      name: "actions",
      label: "Actions",
      options: {
        customBodyRender: (value, tableMeta) => {
          const rowIndex = tableMeta.rowIndex;
          const category = categories[rowIndex];
          return (
            <Box>
              <IconButton
                color="primary"
                size="small"
                onClick={() => handleDialogOpen(category)}
                sx={{ mr: 1 }}
              >
                <ModeEdit />
              </IconButton>
              <IconButton
                color="error"
                size="small"
                onClick={() => handleDelete(category.id)}
                sx={{ mr: 1 }}
              >
                <GridDeleteIcon />
              </IconButton>
              <IconButton
                color="default"
                size="small"
                onClick={() => handleViewOpen(category)}
              >
                <Visibility />
              </IconButton>
            </Box>
          );
        },
        filter: false,
        sort: false,
      },
    }
  ];

  const options = {
    filterType: 'dropdown',
    selectableRows: 'none',
    responsive: 'standard',
    rowsPerPage: 5,
    rowsPerPageOptions: [5, 10, 20],
    download: true,
    print: false,
    search: true
  };

  return (
    <Box sx={{ width: '100%', mt: 3 }}>
      <Typography
        variant="h4"
        component="h4"
        sx={{ textAlign: 'center', mb: 3 }}
      >
        Manage Categories
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleDialogOpen(null)}
        >
          Add Category
        </Button>
      </Box>
      <MUIDataTable
        title="List of Categories"
        data={categories}
        columns={columns}
        options={options}
      />
      <CategoriesDialog
        open={openDialog}
        onClose={handleDialogClose}
        category={currentCategory}
        updateCategories={updateCategories}
      />
      <CategorieViewDialog
        open={viewOpen}
        onClose={handleViewClose}
        categorie={currentCategory}
      />
    </Box>
  );
};

export default Categories;
