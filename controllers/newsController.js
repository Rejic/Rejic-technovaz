const News = require('../models/news');
const Service = require('../models/service');

exports.createNewsGet = async (req, res, next) => {
    try {
        const allServices = await Service.find({ available: {$eq: true}});
        res.render('add_news', { title: 'Add news',allServices  });
    }catch(error) {
        next(error);
    }  
}

exports.createNewsPost = async (req, res, next) => {
    try {
       const news = new News(req.body);
       await news.save();
       res.redirect('/');

    } catch (error) {
        next(error);
    }
}

exports.newsPage = async (req, res, next) => {
    try {
        const allNews = await News.find({ available: { $eq: true } });
        const allServices = await Service.find({ available: {$eq: true}});
        res.render('all_news', {title: 'Lates news', allNews, allServices});
    }
    catch(error) {
        next(error);
    }
}

exports.EditRemoveNewsGet = async (req, res, next) => {
    try {
        const allServices = await Service.find({ available: {$eq: true}});
        res.render('edit_remove_news', { title: 'Edit or remove news', allServices });
    } catch(error) {
        next(error);
    }
}

exports.EditRemoveNewsPost = async (req, res ,next) => {
    try {
        const newsId = req.body.news_id || null;
        const newsName = req.body.news_name || null;
        const allServices = await Service.find({ available: {$eq: true}});
    
        const newsData = await News.find({$or: [
           {_id: newsId},
           {news_name: newsName}
        ]}).collation({
            locale: 'en',
            strength: 2
        });
    
        if(newsData.length > 0) {
            res.render('news_description', { title: 'Edit / Remove News', newsData, allServices });
            return
        }
        else {
            res.redirect('/edit_remove_news');
        }
    }catch(error) {
        next(error);
    }
}

exports.updateNewsGet = async (req, res, next) => {
    try {
        const allServices = await Service.find({ available: {$eq: true}});
        const news = await News.findOne({_id: req.params.newsId});
        res.render('add_news', { title: 'Update News', news,allServices  });
    }catch(next) {
        next(error);
    }
}

exports.updateNewsPost = async (req, res, next) => {
    try {
       const newsId = req.params.newsId
       const news = await News.findByIdAndUpdate( newsId, req.body, {new: true} );
       res.redirect('/lates-news');
    }catch(error) {
        next(error);
    }
}

  