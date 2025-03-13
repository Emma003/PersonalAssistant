const express = require('express');
const router = express.Router();
const { 
    getExpenses,
    getExpense,
    createExpense,
    deleteExpense
} = require('../../controllers/budget/expenseController');

router.get('/', getExpenses);
router.get('/:id', getExpense);
router.post('/', createExpense);
router.delete('/:id', deleteExpense);

//export router
module.exports = router;