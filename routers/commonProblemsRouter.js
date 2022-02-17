const express = require('express');
const router = express.Router();
const {createProblem,getProblems,getProblemsByID,editProblem,deleteProblem} = require('../controllers/commonProblemsController')

router.post('/create',createProblem)
router.get('/getAll',getProblems)
router.get('/getOne/:id',getProblemsByID)
router.put('/update/:id',editProblem)
router.delete('/delete/:id',deleteProblem)

module.exports = router;