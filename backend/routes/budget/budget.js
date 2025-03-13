const express = require('express');
const router = express.Router();
const { 
    getBudgets,
    getLastBudget,
    getBudget,
    createBudget,
    updateBudget
} = require('../../controllers/budget/budgetController');

router.get('/', getBudgets);
router.get('/last/', getLastBudget);
router.get('/:id', getBudget);
router.post('/', createBudget);
router.patch('/:id', updateBudget);

//export router
module.exports = router;