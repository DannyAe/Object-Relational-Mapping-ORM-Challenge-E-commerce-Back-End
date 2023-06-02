const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// The `/api/products` endpoint

// Route to get all products
router.get("/", (req, res) => {
  Product.findAll({
    params: ["id", "product_name", "price", "stock"],
    include: [
      {
        model: Category,
        params: ["id", "category_name"],
      },
      {
        model: Tag,
        through: {
          model: ProductTag,
          attributes: [],
        },
      },
    ],
  })
    .then((productData) => {
      res.json(productData);
    })
    .catch((err) => {
      res.json(err);
    });
});

// Route to get one product by its `id` value
router.get("/:id", (req, res) => {
  Product.findOne({
    where: {
      id: req.params.id,
    },
    params: ["id", "product_name", "price", "stock"],
    include: [
      {
        model: Category,
        params: ["id", "category_name"],
      },
      {
        model: Tag,
        through: {
          model: ProductTag,
          attributes: [],
        },
      },
    ],
  })
    .then((productData) => {
      if (!productData) {
        res.status(404).json({ message: "No Product found with this id! " });
        return;
      }
      res.json(productData);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

// Route to create a new product
router.post("/", (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there are product tags, create pairings in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, respond with the product
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// Route to update a product by its `id` value
router.put("/:id", (req, res) => {
  // Update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // Find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // Get the list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // Create a filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // Figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // Run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

// Route to delete a product by its `id` value
router.delete("/:id", (req, res) => {
  Product.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((productData) => {
      if (!productData) {
        res.status(404).json({ message: "No Product found with this id" });
        return;
      }
      res.json(Data);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

module.exports = router;
