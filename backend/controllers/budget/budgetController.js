const Budget = require('../../models/budget/budgetModel');
const mongoose = require('mongoose');


const getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({}).sort({createdAt: -1}); // -1 bc descending order
        res.status(200).json(budgets);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

const getLastBudget = async (req, res) => {
    try {
        const lastBudget = await Budget.findOne({}).sort({createdAt: -1});

        if (!lastBudget) {
            return res.status(404).json({message: 'no budget items!'});
        }

        res.status(200).json(lastBudget);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

const getBudget = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) { // checks if id is a valid mongo id (24 characters)
        return res.status(404).json({message: 'invalid budget id!'});
    }

    try {
        const budget = await Budget.findById(id);
        if (!budget) {
            return res.status(404).json({message: 'no such budget item!'}); // return to stop the function
        }
    
        res.status(200).json(budget);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

const createBudget = async (req, res) => {
    const {categories} = req.body;

    try {
        const budget = await Budget.create({categories});
        res.status(200).json(budget);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

const updateBudget = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) { // checks if id is a valid mongo id (24 characters)
        return res.status(404).json({message: 'invalid budget item id!'});
    }

    try {
        const budget = await Budget.findOneAndUpdate({_id: id}, {
            ... req.body
        });
        
        if (!budget) {
            return res.status(404).json({message: 'no such budget!'}); // return to stop the function
        }
    
        res.status(200).json(budget);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

module.exports = {
    getBudgets,
    getBudget,
    getLastBudget,
    createBudget,
    updateBudget
};