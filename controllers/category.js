const Category = require("../models/category");

// Custom Middlewares

// Get Category by ID - Parameter Extractor
exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((error, category) => {
    if (error) {
      return res.status(400).json({ err: "Category not found!" });
    }

    req.category = category;
    next();
  });
};

// Controller Methods

// Create Category
exports.createCategory = (req, res) => {
  const category = new Category(req.body);

  category.save((error, category) => {
    if (error) {
      return res.status(400).json({ err: "Unable to save category!" });
    }

    return res.json(category);
  });
};

// Get A Category from Id
exports.getCategory = (req, res) => {
  return res.json(req.category);
};

// Get All Categories
exports.getAllCategory = (req, res) => {
  Category.find((error, categories) => {
    if (error) {
      return res.status(400).json({ err: "No Categories Found!" });
    }

    return res.json(categories);
  });
};

// Update a Category
exports.updateCategory = (req, res) => {
  const category = req.category;
  category.name = req.body.name;

  category.save((error, updatedCategory) => {
    if (error) {
      return res.status(400).json({ err: "Failed to Update Category!" });
    }

    return res.json(updatedCategory);
  });
};

// Delete Category
exports.deleteCategory = (req, res) => {
  const category = req.category;

  category.remove((error, category) => {
    if (error) {
      return res.status(400).json({ err: "Failed to Delete Category!" });
    }

    return res.json({ message: `${category.name} was Deleted Successfully!` });
  });
};
