const express = require('express');
const router = express.Router();
const { 
    getExpenses,
    getDashboardInfo,
    downloadExpenses,
    getExpense,
    createExpense,
    deleteExpense,
} = require('../../controllers/budget/expenseController');

router.get('/', getExpenses);
router.get('/dashboard/', getDashboardInfo);
router.get('/download/', downloadExpenses);
router.get('/:id', getExpense);
router.post('/', createExpense);
router.delete('/:id', deleteExpense);


//export router
module.exports = router;