const Budget = require('../../models/budget/budgetModel');
const Expense = require('../../models/budget/expenseModel');

class ExpenseHelper {

    static getLastBudget = async () => {
        try {

            // check if there's a budget created for the current month
            const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"
            let currentBudget = await Budget.findOne({month: currentMonth});

            // if no budget created for current month, create one
            if (!currentBudget) {
                const lastBudget = await Budget.findOne({}).sort({createdAt: -1});
                currentBudget = ExpenseHelper.createCurrentBudget(currentMonth, lastBudget); // using last budget amounts to create current budget
               
            }

            return currentBudget;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static createCurrentBudget = async (month, lastBudget) => {

        const newBudget = new Budget({
            month,
            categories: lastBudget 
            ? lastBudget.categories.map((category) => ({ // create new budget with same categories as last budget
                name: category.name,
                limit: category.limit,
                spent: 0
            }))
            : [
                { name: 'Shopping', limit: 0, spent: 0 }, // if no last budget, create new budget with default categories
                { name: 'Leisure', limit: 0, spent: 0 },
                { name: 'Groceries', limit: 0, spent: 0 },
                { name: 'Food/Drinks', limit: 0, spent: 0 }
            ]
        });

        try {
            await Budget.create(newBudget);
            return newBudget;
        } catch (error) {
            throw new Error(error.message);
        }

    }

    static populateBudgets = async () => {
        const expenses = await Expense.find({}).sort({date: -1});

        for (const expense of expenses) {
            console.log(`updating budget for expense: ${expense.title}, amount: ${expense.amount}, category: ${expense.category}, date: ${expense.date}`);
            await ExpenseHelper.updateCorrespondingBudget(expense, '+');
        }

    }

    static updateCorrespondingBudget = async (expense, operation) => {
        try {

            // retrieve expense month
            const expenseDate = new Date(expense.date);
            const expenseMonth = expenseDate.toISOString().slice(0, 7); // "YYYY-MM"

            // find budget for the expense month
            const budget = await Budget.findOne({ month: expenseMonth });
            if (!budget) {
                console.log(`no budget found for the month: ${expenseMonth}`);
                return null;
            }

            // update the budget
            const updatedCategories = budget.categories.map((category) => {
                if (category.name === expense.category) {
                    if (operation === '+') {
                        category.spent += expense.amount;
                    } else if (operation === '-') {
                        category.spent -= expense.amount;
                    }
                }
                return category;
            });

            budget.categories = updatedCategories;

            const updatedBudget = await Budget.findOneAndUpdate({_id: budget.id}, {
                        ... budget
                    });

            return updatedBudget;

        } catch (error) {
            throw new Error(error.message);
        }

    }

    static getDashboardInfo = async () => {

        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const startOfLast3Months = new Date(new Date().setMonth(new Date().getMonth() - 3));
        const startOfLast6Months = new Date(new Date().setMonth(new Date().getMonth() - 6));
        const startOfLast7Days = new Date(new Date().setDate(new Date().getDate() - 7));

        const aggregateExpenses = async (startDate) => {
            return await Expense.aggregate([
                { $match: { date: { $gte: startDate } } }, //filter by date greater than or equal to startDate
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$amount" },
                        totalShopping: { $sum: { $cond: [{ $eq: ["$category", "Shopping"] }, "$amount", 0] } }, // $cond checks if category is Shopping, if true add amount, else add 0
                        totalLeisure: { $sum: { $cond: [{ $eq: ["$category", "Leisure"] }, "$amount", 0] } },
                        totalGroceries: { $sum: { $cond: [{ $eq: ["$category", "Groceries"] }, "$amount", 0] } },
                        totalFoodDrinks: { $sum: { $cond: [{ $eq: ["$category", "Food/Drinks"] }, "$amount", 0] } }
                    }
                }
            ]);
        };

        const last7Days = await aggregateExpenses(startOfLast7Days);
        const thisMonth = await aggregateExpenses(startOfMonth);
        const last3Months = await aggregateExpenses(startOfLast3Months);
        const last6Months = await aggregateExpenses(startOfLast6Months);

        const dashboardInfo = {
            last7Days: last7Days[0] || { total: 0, totalShopping: 0, totalLeisure: 0, totalGroceries: 0, totalFoodDrinks: 0 },
            thisMonth: thisMonth[0] || { total: 0, totalShopping: 0, totalLeisure: 0, totalGroceries: 0, totalFoodDrinks: 0 },
            last3Months: last3Months[0] || { total: 0, totalShopping: 0, totalLeisure: 0, totalGroceries: 0, totalFoodDrinks: 0 },
            last6Months: last6Months[0] || { total: 0, totalShopping: 0, totalLeisure: 0, totalGroceries: 0, totalFoodDrinks: 0 }
        };

        return dashboardInfo;
    }

    static checkEmptyExpenseFields = (reqBody) => {
        const {title, amount, date, category} = reqBody;

        // error handling
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
        return emptyFields;
    }

}

module.exports = ExpenseHelper;
