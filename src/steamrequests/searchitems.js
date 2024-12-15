const request = require("./axiosrequest");

export function call(config, callback) {
    request.get('https://steamcommunity.com/market/search/render',true , convertOptions(config),
        (response) => {
            if(response.data.length == 0) {
                call(config, callback);
            }   
            else callback(response.data)
        }
    );
}

function convertOptions(config) 
{
    var types = {};
    if(config.use_weapons) {
        types['category_730_Type[0]'] = 'tag_CSGO_Type_Pistol';
        types['category_730_Type[1]'] = 'tag_CSGO_Type_SMG','tag_CSGO_Type_Rifle';
        types['category_730_Type[2]'] = 'tag_CSGO_Type_Rifle';
        types['category_730_Type[3]'] = 'tag_CSGO_Type_SniperRifle';
        types['category_730_Type[4]'] = 'tag_CSGO_Type_Shotgun';
        types['category_730_Type[5]'] = 'tag_CSGO_Type_Machinegun';
    }
    if(config.use_stickers_graffities_and_pathces) {
        types['category_730_Type[6]'] = 'tag_CSGO_Tool_Sticker';
        types['category_730_Type[7]'] = 'tag_CSGO_Type_Spray';
        types['category_730_Type[8]'] = 'tag_CSGO_Tool_Patch';
    }
    if(config.use_knifes_and_gloves) {
        types['category_730_Type[9]'] = 'tag_CSGO_Type_Knife';
        types['category_730_Type[10]'] = 'tag_Type_Hands';
    }
    if(config.use_agents) {
        types['category_730_Type[11]'] = 'tag_Type_CustomPlayer';
    }
    if(config.use_containers_and_keys) {
        types['category_730_Type[12]'] = 'tag_CSGO_Type_WeaponCase';
        types['category_730_Type[13]'] = 'tag_CSGO_Tool_WeaponCase_KeyTag';
    }

    var quality = [];
    if(config.use_normal)  {
        types['category_730_Quality[0]'] = 'tag_normal';
    }
    if(config.use_souvenir) {
        types['category_730_Quality[1]'] = 'tag_tournamental';
    }
    if(config.use_stattrak) {
        types['category_730_Quality[2]'] = 'tag_strange';
        types['category_730_Quality[3]'] = 'tag_unusual';
        types['category_730_Quality[4]'] = 'tag_unusual_strange';
    }
    if(quality == []) quality = 'any';

    var options = {
        query: '',
        start: config.start_at,
        sort_column: 'price',
        sort_dir: 'asc', //desc
        count: 5,
        currency: 5,
        language: 'english',
        norender: 1,
    }
    Object.assign(options, types);

    return options;
}