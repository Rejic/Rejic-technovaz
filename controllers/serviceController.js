const Service = require('../models/service');
const Message = require('../models/message');
const Contact = require('../models/contact');



exports.homePage = async (req, res, next) => {
  try {
    try {
      const allServices = await Service.find({ available: {$eq: true}});
      res.render('index', { title: 'Rejic Technovaz',allServices });
    }
    catch(error) {
      next(error);
    }
  } catch (error) {
    next(error);
  }
}

exports.aboutUsPage = async (req, res, next) => {
  try {
    const allServices = await Service.find({ available: {$eq: true}});
    res.render('about-us', { title: 'About us',allServices });
  }catch(error) {
    next(error);
  }
}

exports.listAllservices = async (req, res, next) => {
  try {
    const allServices = await Service.find({ available: {$eq: true}});
    res.render('all_services', { title: 'Rejic Technovaz',allServices });
  }
  catch(error) {
    next(error);
  }
}



exports.servicePage = async (req, res, next) => {
  try {
    const serviceParam = req.params.service;
    const serviceData = await Service.find({_id: serviceParam});
    const allServices = await Service.find({ available: {$eq: true}});
    res.render('service_detail', { title: 'Service details', serviceData, allServices});
  }
  catch(error) {
    next(error);
  }
}

exports.message = (req, res) => {
  res.render('index', {title: 'Rejic Technovaz'})
}
//Message
exports.messagePost = async (req, res, next) => {
  try{
     const message = new Message(req.body);
     await message.save();
     res.redirect('/');
  } catch (error) {
    next(error);
  }
}



exports.adminPage = async  (req, res, next) => {
    try{
      const allServices = await Service.find({ available: {$eq: true}});
    res.render('admin', { title: 'Admin', allServices });
    }catch(error) {
      next(error);
    }
  
}

exports.createServiceGet = async (req, res, next) => {
  try {
    const allServices = await Service.find({ available: {$eq: true}});
    res.render('add_service', { title: 'Add new service', allServices});
  }
  catch(error) {
  next(error);
}
}

exports.createServicePost = async (req, res, next) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.redirect(`/all/${service._id}`);
  }
  catch (error) {
      next(error);
  }
//res.json(req.body);
}

exports.EditRemoveServiceGet = async (req, res, next) => {
  try {
    const allServices = await Service.find({ available: {$eq: true}});
    res.render('edit_remove_service', { title: 'Find a service to edit or remove', allServices});
    
  }catch(error) {
    next(error);
  }
}

exports.EditRemoveServicePost = async (req, res, next) => {
  try{
    const serviceId = req.body.service_id || null;
    const serviceName = req.body.service_name || null;

    const allServices = await Service.find({ available: {$eq: true}});
    const serviceData = await Service.find({ $or: [
      {_id: serviceId },
      {service_name: serviceName }
    ]}).collation({
      locale: 'en',
      strength: 2
    });
    
    // console.log(serviceData);
    if(serviceData.length > 0) {
      // res.json(serviceData);
      res.render('service_description', { title: 'Edit / Remove Service' ,serviceData ,allServices });
      return
    }else {
      res.redirect('/Edit-remove-service');
    }

  }catch(error) {
    next(error);
  }
}


exports.updateServiceGet = async (req, res, next) => {
  try {
    const allServices = await Service.find({ available: {$eq: true}});
    const service = await Service.findOne({ _id: req.params.serviceId })
    res.render('add_service', { title: 'Update service', service, allServices } )
  }catch(error) {
    next(error);
  }
}

exports.updateServicePost = async (req, res, next) => {
  try {
    const serviceId = req.params.serviceId;
  const service = await Service.findByIdAndUpdate(serviceId, req.body, {new:true});
  res.redirect(`/all/${service._id}`);
  }catch(error) {
    next(error);
  }
}

exports.deleteServiceGet = async (req, res, next) => {
  try {
    const allServices = await Service.find({ available: {$eq: true}});
    const service = await Service.findOne({ _id: req.params.serviceId })
    res.render('add_service', { title: 'Delete service', service, allServices } )
  }catch(error) {
    next(error);
  }
}

exports.deleteServicePost = async (req, res, next) => {
  const serviceId = req.params.serviceId;
  const service = await Service.findByIdAndRemove({ _id: serviceId });
  res.redirect('/admin')
}

// CONTACT
exports.contactUsPage = async (req, res, next) => {
  try {
     const allServices = await Service.find({ available: {$eq: true}});
     res.render('contact', { title: 'Contact us', allServices });
  }catch(error) {
    next(error);
  }
}


exports.contactUsPost = async (req, res, next) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.redirect('/');
  }catch(error) {
    next(error);
  }
}