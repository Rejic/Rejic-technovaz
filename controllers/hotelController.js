const Hotel = require('../models/hotel');
const cloudinary = require('cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.diskStorage({});

const upload = multer({ storage });

exports.upload = upload.single('image');

exports.pushToCloudinary = async (req, res, next) => {
  if(req.file) {
    const toPush = await cloudinary.uploader.upload(req.file.path)
    .then((result)=> {
      req.body.image = result.public_id;
      next();
    })
    .catch(() => {
      req.flash('error', 'Sorry, there was a problem uploading your image, please try again');
      res.redirect('/admin/add');
    })
  } else {
    next();
  }
}

// exports.homePage = (req, res) => {
//   res.render('index', { title: 'Lets travel' });
// }

exports.listAllHotels = async (req, res,  next) => {
   try {
    const allHotels = await Hotel.find({ available: {$eq: true}});
    //res.json(allHotels);
    res.render('all_hotels', { title: 'All Hotels', allHotels});
   } catch(errors) {
     next(next);
   }
}

exports.listAllRegions = async (req, res, next) => {
   try {
      const allRegions = await Hotel.distinct('region');
      res.render('all_regions', { title: 'Browse by region', allRegions });
   } catch(error) {
     next(error);
   }
}                                                                           

exports.homePageFilters = async (req, res, next) => {
  try{
     const hotels = Hotel.aggregate([
       { $match:{ available: true }},
       { $sample: { size: 9}}
      ]);
     const regions = Hotel.aggregate([
       { $group: { _id: '$region' } },
       { $sample: { size: 9 } }
     ]); 

     const [filteredRegions, filteredHotels] = await Promise.all([regions, hotels]);
    // destructuring video 37//
    res.render('index', { filteredRegions, filteredHotels});

  } catch (error) {
    next(error);
  }
}

exports.adminPage = (req, res) => {
  res.render('admin', { title: 'Admin' });
}

exports.createHotelGet = (req, res) => {
  res.render('add_hotel', { title: 'Add new Hotel' });
}

exports.createHotelPost = async (req, res, next) => {
  try{
 const hotel = new Hotel(req.body);
 await hotel.save();
 req.flash('success', `${hotel.hotel_name} created successfully`)
 res.redirect(`/all/${hotel._id}`);
  } catch(error) {
    next(error);
  }
}


exports.editRemoveGet = (req, res) => {
  res.render('edit_remove', { title: 'Search for Hotel to edit or remove' });
}

exports.editRemovePost = async (req, res, next) => {
   try {
      const hotelId = req.body.hotel_id || null;
      const hotelName = req.body.hotel_name || null;

      const hotelData = await Hotel.find({ $or: [
        {_id: hotelId },
        { hotel_name: hotelName }
      ]}).collation({
        locale: 'en',
        strength: 2
      });
    if(hotelData.length > 0) {
      res.render('hotel_detail', { title: 'Add / Remove Hotel', hotelData });
      return
    } else {
      req.flash('info', 'No matches were found...');
      res.redirect('/admin/edit-remove');
    }  
   } catch(errors) {
     next(next);
   }
}

exports.updateHotelGet = async (req, res, next) => {
  try {
    const hotel = await Hotel.findOne({ _id: req.params.hotelId });
    res.render('add_hotel', { title: 'Update hotel', hotel});
  } catch(error) {
    next(error);
  }
}

exports.updateHotelPost = async (req, res, next) => {
  try {
    const hotelId = req.params.hotelId;
    const hotel = await Hotel.findByIdAndUpdate(hotelId, req.body, {new:true}); 
    req.flash('success', `${hotel.hotel_name} updated successfully`);
    res.redirect(`/all/${hotelId}`); 
  } catch(error) {
    next(error);
  }
}

exports.deleteHotelGet = async (req, res, next) => {
  try {
     const hotelId = req.params.hotelId;
     const hotel = await Hotel.findOne( { _id: hotelId } );  
     res.render('add_hotel', { title: 'delete hotel', hotel});
  } catch(error) {
    next(error); 
  }
}

exports.deleteHotelPost = async (req, res, next) => {
  try {
    const hotelId = req.params.hotelId;
    const hotel = await Hotel.findByIdAndRemove( { _id: hotelId } );  
    req.flash('info', `Hotel ID: ${hotelId} has been deleted`)
    res.redirect('/'); 
  } catch(error) {
    next(error);
  }
}

exports.hotelDetail = async (req, res, next) => {
  try {
    const hotelParam = req.params.hotel;
    const hotelData = await Hotel.find( {_id: hotelParam} );
    res.render('hotel_detail', { 
     title: 'Hotel details',
     hotelData, 
    });
  } catch (error) {
    next(error);
  }
}



exports.hotelsByRegion = async (req, res, next) => {
  try {
     const regionParam = req.params.region;
     const regionList = await Hotel.find( {region: regionParam} );
     res.render('hotels_by_region', { title: `Browse by region: ${regionParam}`, regionList });
  } catch (error) {
    next(error);
  }
}



exports.hotelResultPost = async (req, res, next) => {
  try {
     const hotelName = req.body.hotel_name || null;

     const hotelData = await Hotel.find({ hotel_name: hotelName }
     ).collation({
       locale: 'en',
       strength: 2
     });
   if(hotelData.length > 0) {
     res.render('hotel_detail', { title: 'Search Hotel by name', hotelData });
     return
   } else {
     res.redirect('/');
   }  
  } catch(errors) {
    next(next);
  }
}

exports.updateHotelGet = async (req, res, next) => {
 try {
   const hotel = await Hotel.findOne({ _id: req.params.hotelId });
   res.render('add_hotel', { title: 'Update hotel', hotel});
 } catch(error) {
   next(error);
 }
}

exports.updateHotelPost = async (req, res, next) => {
 try {
   const hotelId = req.params.hotelId;
   const hotel = await Hotel.findByIdAndUpdate(hotelId, req.body, {new:true}); 
   res.redirect(`/all/${hotelId}`); 
 } catch(error) {
   next(error);
 }
}

exports.searchResults = async (req, res, next) => {
  try {
    const searchQuery = req.body;
    const parsedStars = parseInt(searchQuery.stars) || 1
    const parsedSort = parseInt(searchQuery.sort) || 1
    const searchData = await Hotel.aggregate([
     { $match: { $text: {$search: `\"${searchQuery.destination}\"` } } },
     { $match: { available: true, star_rating: { $gte: parsedStars } }  },
     { $sort: { cost_per_night: parsedSort } }
    ])
    res.render('search_results', { title: 'search results', searchQuery, searchData });

    // res.json(searchData); 
    // res.send(typeof searchQuery.stars) to which type of that is sent either is string/number
  } catch(error) {
    next(error);
  }
}

// escape double increase specificity in search (\" \")