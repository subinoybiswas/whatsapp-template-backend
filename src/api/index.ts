import express from 'express';

import templateRoutes from './templateRoutes';

const router = express.Router();

router.use('/', templateRoutes);

export default router;
