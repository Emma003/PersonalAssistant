const Expense = require('../../models/budget/expenseModel');
const ExpenseHelper = require('./helpers');
const mongoose = require('mongoose');


const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({}).sort({date: -1}); // -1 bc descending order
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getDashboardInfo = async (req, res) => {
    try {
        // get latest budget
        const lastBudget = await ExpenseHelper.getLastBudget();
        
        // get last 5 expenses
        const expenses = await Expense.find({}).sort({date: -1}).limit(5); // -1 bc descending order

        // get total expenses for last 7 days, this month, last 3 months, last 6 months
        const dashboardInfo = await ExpenseHelper.getDashboardInfo();

        res.status(200).json({ lastBudget, expenses, dashboardInfo });

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const downloadExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({}).sort({date: -1}); // -1 bc descending order
        let csv = 'title,amount,date,category\n';
        expenses.forEach(expense => {
            csv += `${expense.title},${expense.amount},${expense.date},${expense.category}\n`;
        });
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=expenses.csv');
        res.status(200).send(csv);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

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
        res.status(500).json({message: error.message});
    }
};

const createExpense = async (req, res) => {
    //TODO: when making the expenses/reports page, make sure that a current budget is created before ever adding an expense

    const {title, amount, date, category} = req.body;

    //update corresponding budget
    ExpenseHelper.updateCorrespondingBudget({date, category, amount}, '+');

    // error handling
    const emptyFields = ExpenseHelper.checkEmptyExpenseFields(req.body);
    if (emptyFields.length > 0) {
        return res.status(400).json({message: `please fill in all the fields`, emptyFields});
    }

    try {
        const expense = await Expense.create({title, amount, date, category});
        res.status(200).json(expense);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const deleteExpense = async (req, res) => {
    //TODO: when making the expesnses/reports page, make sure that a current budget is created before ever deleting an expense

    const {id} = req.params;

    //update latest budget
    const {date, category, amount} = await Expense.findById(id);
    ExpenseHelper.updateCorrespondingBudget({date, category, amount}, '-');

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
        res.status(500).json({message: error.message});
    }
};


module.exports = {
    getExpenses,
    getDashboardInfo,
    downloadExpenses,
    getExpense,
    createExpense,
    deleteExpense
};