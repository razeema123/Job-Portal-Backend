const express = require('express');
const router = express.Router();
const appCtrl = require('../controllers/applicationController');


router.post('/:jobId/apply', appCtrl.applyJob);

router.get('/', appCtrl.getAllApplications);

router.get('/job/:jobId', appCtrl.getApplicationsByJob);

router.get('/:id', appCtrl.getApplicationById);

router.put('/:id', appCtrl.updateStatus);

router.delete('/:id', appCtrl.deleteApplication);

module.exports = router;
