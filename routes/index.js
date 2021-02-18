var express = require('express');
var router = express.Router();



router.all('/*', (req, res, next) => {
  req.app.locals.layout = 'layout',

  next();
});

 



// require serviceController
var serviceController = require('../controllers/serviceController'); 
const newsController = require('../controllers/newsController');
const { request } = require('../app');


/* GET home page. */
router.get('/', serviceController.homePage);

router.get('/about-Us', serviceController.aboutUsPage);
router.get('/all', serviceController.listAllservices);
router.get('/all/:service', serviceController.servicePage);
router.post('/', serviceController.messagePost);
router.get('/admin/edit-remove-service', serviceController.EditRemoveServiceGet);
router.post('/admin/edit-remove-service', serviceController.EditRemoveServicePost);
router.get('/Contact-Us', serviceController.contactUsPage);


//News controller
router.get('/lates-news', newsController.newsPage);
router.get('/admin/edit-remove-news', newsController.EditRemoveNewsGet);
router.post('/admin/edit-remove-news', newsController.EditRemoveNewsPost);
// router.get('/admin/:newsId/update', newsController.updateNewsGet);
// router.post('/admin/:newsId/update', newsController.updateNewsPost);

//Contact
router.post('/Contact-Us',serviceController.contactUsPost);




// Admin routes
router.get('/admin', serviceController.adminPage);
router.get('/admin/add', serviceController.createServiceGet);
router.post('/admin/add', serviceController.createServicePost);
router.get('/admin/add-news', newsController.createNewsGet);
router.post('/admin/add-news', newsController.createNewsPost);
router.get('/admin/:serviceId/update', serviceController.updateServiceGet);
router.post('/admin/:serviceId/update', serviceController.updateServicePost);
router.get('/admin/:serviceId/delete', serviceController.deleteServiceGet);
router.post('/admin/:serviceId/delete', serviceController.deleteServicePost);




module.exports = router;
