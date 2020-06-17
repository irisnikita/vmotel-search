const Post = require('../model/post.model');

exports.createPost = function(req, res) {
    const post = new Post(req.body);

    post.save().then(result => {
        res.json({
            data: {
                post: result
            }
        });
    }).catch((err) => {
        res.json({
            message: err
        });
    });
};

exports.listPost = async function(req, res) {
    const {
        page = 0, 
        limit = 20, 
        areaStart = 0,
        areaEnd = 500,
        optionTypeId = 'all',
        provinceCode = 'ALL',
        districtName = 'all',
        streetId = 'all',
        priceStart = 0,
        priceEnd = 50000000,
        levelId = 'all'
    } = req.query;

    const count = await Post
        .find()
        .and([
            {area: {$lte: areaEnd, $gte: areaStart}},
            {price: {$lte: priceEnd, $gte: priceStart}},
            {'filter.optionType.id': optionTypeId !== 'all' ? optionTypeId : {$exists: true}},
            {'filter.province.code': provinceCode !== 'ALL' ? provinceCode : {$exists: true}},
            {'filter.district.name': districtName !== 'all' ? districtName : {$exists: true}},
            {'filter.street.id': streetId !== 'all' ? streetId : {$exists: true}},
            {'option.level.id': levelId !== 'all' ? levelId : {$exists: true}}
        ]).countDocuments();

    Post
        .find()
        .and([
            {area: {$lte: areaEnd, $gte: areaStart}},
            {price: {$lte: priceEnd, $gte: priceStart}},
            {'filter.optionType.id': optionTypeId !== 'all' ? optionTypeId : {$exists: true}},
            {'filter.province.code': provinceCode !== 'ALL' ? provinceCode : {$exists: true}},
            {'filter.district.name': districtName !== 'all' ? districtName : {$exists: true}},
            {'filter.street.id': streetId !== 'all' ? streetId : {$exists: true}},
            {'option.level.id': levelId !== 'all' ? levelId : {$exists: true}}
        ])
        .skip(page * +limit).limit(+limit)
        .sort('-startTime')
        .exec((err, results) => {
            if (!err) {
                res.json({
                    data: {
                        posts: results,
                        total: count
                    }
                });
            }
        });
};