const BaseTransformer = require('./BaseTransformer');
const { Ads } = require('../../../models');

class AdsTransformer extends BaseTransformer {
  constructor(req, data, transformOptions = null) {
    super(req, data, transformOptions);
    this.model = Ads;
  }

  async transform(ads) {
    ads = await ads;
    let returnVal = {
      id: App.lodash.get(ads, 'id'),
      uuid: App.lodash.get(ads, 'uuid'),
      text: App.lodash.get(ads, 'text'),
      video: App.helpers.getVideoUrl(ads.getData('video')),
      image: App.helpers.getImageUrl(ads.getData('image')),
      owner_id : App.lodash.get(ads,'owner_id'),
      start_date : App.lodash.get(ads,'start_date'),
      end_date : App.lodash.get(ads,'end_date'),
      isSponsor : App.lodash.get(ads,'isSponsor')
    };
    return returnVal;
  }
 
}

module.exports = AdsTransformer;
