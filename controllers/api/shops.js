const Shop = require('../../models/shop')
const Item = require('../../models/item')
const User = require('../../models/user')
const Category = require('../../models/category')
const cloudinary = require('../../config/cloudinary')
const category = require('../../models/category')
const shop = require('../../models/shop')
/* -----shop controllers-----*/

// Create a new shop
exports.createShop = async (req, res) => {
    try {
        const newShop = await Shop.create({
            seller: req.user._id,
            name: req.body.name,
            heroImage: req.body.heroImage,
            rating: null
        })
        const user = await User.findOneAndUpdate({ _id: req.user._id }, { shop: newShop._id }, { new: true })
        console.log(user)
        res.status(200).json({ user, newShop })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// Update a shop
exports.updateShop = async (req, res) => {
    try {
        const shop = await Shop.findByIdAndUpdate(req.params.id, req.body, { new: true })

        if (!shop) {
            return res.status(404).json({ error: 'Shop not found' })
        }

        res.status(200).json(shop)
    } catch (error) {
        res.status(400).json({ error: 'Could not update shop' })
    }
}

// Get a single shop by id
exports.getShop = async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id)
            .populate({
                path: 'products',
                populate: {
                    path: 'category'
                }
            })
            .exec()

        if (!shop) {
            return res.status(404).json({ error: 'Shop not found' })
        }

        res.status(200).json(shop)
    } catch (error) {
        res.status(400).json({ error: 'Could not find shop' })
    }
}


// Delete a shop
exports.deleteShop = async (req, res) => {
    try {
        const shop = await Shop.findByIdAndDelete(req.params.id)

        if (!shop) {
            return res.status(404).json({ error: 'Shop not found' })
        }

        res.json({ message: 'Shop Deleted' })
    } catch (error) {
        res.status(400).json({ error: 'Could not Delete Shop' })
    }
}


/* -----shop-item controllers-----*/
// Add an item to a shop
exports.addItem = async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id)

        if (!shop) {
            return res.status(404).json({ error: 'Shop not found' })
        }

        const category = await Category.findOne({ name: req.body.category })
        console.log('category = ' + category)
        const item = await Item.create({
            name: req.body.name,
            imageUrl: req.body.imageUrl,
            publicId: req.body.publicId,
            price: req.body.price,
            description: req.body.description,
            category: category._id,
            shop: shop._id
        })

        shop.products.addToSet(item)
        await shop.save()

        res.status(200).json(item)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// Update item to a shop
exports.updateItem = async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.ShopId)

        if (!shop) {
            return res.status(404).json({ error: 'Shop not found' })
        }

        const itemId = req.params.itemId
        const updatedItemIndex = shop.products.findIndex(item => item._id.toString() === itemId)

        if (updatedItemIndex === -1) {
            return res.status(404).json({ error: 'Item not found' })
        }

        const updatedItem = req.body
        shop.products[updatedItemIndex] = { ...shop.products[updatedItemIndex], ...updatedItem }
        await shop.save()

        res.json(shop)
    } catch (error) {
        res.status(400).json({ error: 'Could not update item' })
    }
}

// Delete item from shop
exports.deleteItem = async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id)

        if (!shop) {
            return res.status(404).json({ error: 'Shop not found' })
        }

        shop.products.pull({ _id: req.params.itemid })
        await shop.save()

        const item = await Item.findOne({ _id: req.params.itemid })
        await item.deleteOne()

        res.json({ message: 'Item deleted from shop' })
    } catch (error) {
        res.status(400).json({ error: 'Could not delete item' })
    }
}
