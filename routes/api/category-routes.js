// Import necessary modules
const router = require("express").Router();
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint

// Route to find all categories
// Includes associated Products
router.get("/", (req, res) => {
  Category.findAll({
    params: ["id", "category_name"],
    include: [
      {
        model: Product,
        params: ["id", "product_name", "price", "stock"],
      },
    ],
  })
    .then((categoryData) => res.json(categoryData))
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

// Route to find one category by its `id` value
// Includes associated Products
router.get("/:id", (req, res) => {
  Category.findOne({
    where: {
      id: req.params.id,
    },
    params: ["id", "category_name"],
    include: [
      {
        model: Product,
        params: ["id", "product_name", "price", "stock"],
      },
    ],
  })
    .then((categoryData) => {
      if (!categoryData) {
        res.status(404).json({ message: "No Category found with this id! " });
        return;
      }
      res.json(categoryData);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

// Route to create a new category
router.post("/", (req, res) => {
  Category.create({
    category_name: req.body.category_name,
  })
    .then((Data) => res.json(Data))
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

// Route to update a category by its `id` value
router.put("/:id", (req, res) => {
  Category.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((Data) => res.json(Data))
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

// Route to delete a category by its `id` value
router.delete("/:id", (req, res) => {
  Category.destroy(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((Data) => res.json(Data))
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

module.exports = router;
