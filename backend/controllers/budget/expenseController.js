const Expense = require('../../models/budget/expenseModel');
const mongoose = require('mongoose');


const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({}).sort({date: -1}); // -1 bc descending order
        res.status(200).json(expenses);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

const getExpense = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) { // checks if id is a valid mongo id (24 characters)
        return res.status(404).json({message: 'invalid expense id!'});
    }

    try {
        const expense = await Expense.findById(id);
        if (!expense) {
            return res.status(404).json({message: 'no such expense!'}); // return to stop the function
        }
    
        res.status(200).json(expense);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

const createExpense = async (req, res) => {
    const {title, amount, date, category} = req.body;

    let emptyFields = []; // this is to detect empty fields

    if (!title) {
        emptyFields.push('title');
    }
    if (!amount) {
        emptyFields.push('amount');
    }
    if (!date) {
        emptyFields.push('date');
    }
    if (!category) {
        emptyFields.push('category');
    }
    if (emptyFields.length > 0) {
        return res.status(400).json({message: `please fill in all the fields`, emptyFields});
    }

    try {
        const expense = await Expense.create({title, amount, date, category});
        res.status(200).json(expense);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

const deleteExpense = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({message: 'invalid expense id!'});
    }

    try {
        const expense = await Expense.findOneAndDelete({_id: id});
        if (!expense) {
            return res.status(404).json({message: 'no such expense!'});
        }
        res.status(200).json(expense);    
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};


module.exports = {
    getExpenses,
    getExpense,
    createExpense,
    deleteExpense
};