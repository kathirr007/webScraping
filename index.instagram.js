const request = require('request');
const requestPromise = require('request-promise');
const cheerio = require('cheerio');

(async () => {
    const USERNAME = 'willsmith';
    const BASE_URL = `https://www.instagram.com/${USERNAME}`;
    let response = await requestPromise(BASE_URL).catch(err => {
        console.log(err)
    })

    let $ = cheerio.load(response)

    let script = $('script[type="text/javascript"]').eq(3).html();
    let script_regex = /window._sharedData = (.+);/g.exec(script);

    let instagram_data = JSON.parse(script_regex[1])

    let { entry_data : {ProfilePage : { [0]: {graphql: {user}} }} } = instagram_data;

    // object.entry_data.ProfilePage[0].graphql.user

    // console.log(instagram_userdata)

    let { entry_data : {ProfilePage : { [0]: {graphql: {user : {edge_owner_to_timeline_media : {edges}}}} }} } = instagram_data;

    // console.log(edges);
    let posts = []
    for(let edge of edges) {
        let { node } = edge;

        let captionText = typeof node.edge_media_to_caption.edges[0] === 'undefined' ? '' : node.edge_media_to_caption.edges[0].node.text;
        /* const tempObject = { node };
        const captionText = 'tempObject.edge_media_to_caption.edges[0].node' in tempObject ? 'n/a' : tempObject.edge_media_to_caption.edges[0].node.text; */
        // prop; // => 'default' 

        posts.push({
            id: node.id,
            shortcode: node.shortcode,
            timestamp: node.taken_at_timestamp,
            likes: node.edge_liked_by.count,
            comment: node.edge_media_to_comment.count,
            video_views: node.video_view_count,
            caption: captionText,
            image_url: node.display_url,
        })
    }

    let instagram_userdata = {
        followers: user.edge_followed_by.count,
        following: user.edge_follow.count,
        uploads: user.edge_owner_to_timeline_media.count,
        fullname: user.full_name,
        profile_pic: user.profile_pic_url_hd,
        posts
    }
    
    console.log(instagram_userdata)

})();