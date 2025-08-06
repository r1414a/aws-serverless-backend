import express from 'express';
const router = express.Router();
import RestoreDataController from "../controllers/restoredata.controller.js"

router.route('/get-restore-data').get(RestoreDataController.getRestoreData);
router.route('/restore-to-main').post(
    // parseRequestBody,
    RestoreDataController.setRestoreData
)

export default router;