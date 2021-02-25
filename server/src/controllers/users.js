import {instagramFetch, convertPathParams, FEED_PATH} from "../utils/fetcher.js";
import delay from "delay";
import { transformMediaData } from "./posts.js";

export const userContent = async (req, res) => {
    const username1 = req.params.username;
    // const page = getPage()
    // const {page} = await startBrowser();
    //
    // console.log("*\tOpen user in browser\t*")
    // await page.goto(`https://www.instagram.com/${username1}`, { waitUntil: 'networkidle0' });
    //
    // const userExists = await validationUserExist(page);
    // if(!userExists) {
    //     console.log("*\tUsername doesn't exist\t*")
    //     return res.status(200).json({hasError: true, message: 'Account not exists!'});
    // }
    //
    // let sharedData = await page.evaluate(() => {
    //     return window._sharedData.entry_data.ProfilePage[0].graphql.user;
    // });

    const sharedData = await instagramFetch.get(`/${username1}`)
        .then(function (response) {
            // handle success
            let jsonObject = response.data.match(/<script type="text\/javascript">window\._sharedData = (.*)<\/script>/);
            if (jsonObject) {
                jsonObject = jsonObject[1].slice(0, -1);
                const userInfo = JSON.parse(jsonObject)
                return userInfo.entry_data.ProfilePage[0].graphql.user
            }
            console.log(jsonObject)
            return null
        })

    if (sharedData == null) {
        return res.status(200).json(null);
    }
    // const cleanData = oldFetchUserData(page);
    const cleanData = convertUserData(sharedData);

    if (!cleanData.isPrivate) {
        // cleanData.storiesArray = fetchUserStories(page);
        cleanData.timelineMedia = transformMediaData(sharedData.edge_owner_to_timeline_media);
    }

    return res.status(200).json(cleanData);
}

export const nextPageContent = async (req, res) => {
    const { userId, first, endCursor} = req.query;
    const params = `{"id":"${userId}","first":${first},"after":"${endCursor}"}`
    const data = await instagramFetch.get(FEED_PATH + convertPathParams(params))
        .then(function (response) {
            // handle success
            return response.data;
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })

    console.log(data)
    console.log("FINISH FETCH POSTS")
    if (data?.data?.user?.edge_owner_to_timeline_media) {
        console.log("TRANSFORM POSTS")
        const result = transformMediaData(data.data.user.edge_owner_to_timeline_media);
        return res.status(200).json(result);
    }
    console.log("EMPTY POSTS")
    return res.status(200).json();
}

const validationUserExist = async (page) => {
    // check username exists or not exists
    const isUsernameNotFound = await page.evaluate(() => {
        // check selector exists
        if(document.getElementsByTagName('h2')[0]) {
            // check selector text content
            if(document.getElementsByTagName('h2')[0].textContent == "Sorry, this page isn't available.") {
                return false;
            }
            return true;
        }
    });
    return isUsernameNotFound
}

const fetchUserStories = async (page) => {
    // check if will contain stories
    let hasStories = await page.evaluate(async () => {
        // return document.querySelectorAll('header > section > div > h2')[0].innerHTML;
        if(document.querySelector('div[role="presentation"]')) {
            return  true;
        }
        return false;
    });

    // wait and get stories
    let storiesArray = [];
    if (hasStories) {
        await delay(1500);
        // get username picture URL
        storiesArray = await page.evaluate(async () => {
            return [...document
                .querySelector('div[role="presentation"]')
                .querySelectorAll('ul > li')]
                .filter(el => el.querySelector('img'))
                .map(el => {
                    return {
                        src: el.querySelector('img').getAttribute('src'),
                        title: el.querySelector('img').parentNode.parentNode.nextSibling.innerHTML
                    }
                })
        });
    }

    return storiesArray;
}

const convertUserData = (fetchData) => {

    const userData = {
        id: fetchData.id,
        username: fetchData.username,
        name: fetchData.full_name,
        userImageUrl: fetchData.profile_pic_url,

        bio: fetchData.biography,
        bioUrl: fetchData.external_url_linkshimmed,
        bioUrlName: fetchData.external_url,

        postCount: fetchData.edge_owner_to_timeline_media.count,
        followersCount: fetchData.edge_followed_by.count,
        followingsCount: fetchData.edge_follow.count,

        isVerified: fetchData.is_verified,
        isPrivate: fetchData.is_private,
        hasClips: fetchData.has_clips,

        mutualFollow: {
            count: fetchData.edge_mutual_followed_by.count,
            usernameArray: fetchData.edge_mutual_followed_by.edges.map(element => element.node.username)
        }
    };

    return userData;
}

const oldFetchUserData = async (page) => {

    // get username
    let username = await page.evaluate(() => {
        return document.querySelectorAll('header > section > div > h2')[0].textContent;
    });

    // check the account is verified or not
    let isVerifiedAccount = await page.evaluate(() => {
        // check selector exists
        if(document.getElementsByClassName('coreSpriteVerifiedBadge')[0]) {
            return true;
        } else {
            return false;
        }
    });

    // get username picture URL
    let usernamePictureUrl = await page.evaluate(() => {
        return document.querySelectorAll('header img')[0].getAttribute('src');
    });

    // get number of total posts
    let postsCount = await page.evaluate(() => {
        return document.querySelectorAll('header > section > ul > li span')[0].textContent.replaceAll(/\,/g, '');
    });

    // get number of total followers
    let followersCount = await page.evaluate(() => {
        return document.querySelectorAll('header > section > ul > li a span')[0].getAttribute('title').replaceAll(/\,/g, '');
    });

    // get number of total followings
    let followingsCount = await page.evaluate(() => {
        return document.querySelectorAll('header > section > ul > li a span')[1].textContent.replaceAll(/\,/g, '');
    });

    // get bio name
    let name = await page.evaluate(() => {
        // check selector exists
        if(document.querySelectorAll('header > section h1')[0]) {
            return document.querySelectorAll('header > section h1')[0].textContent;
        } else {
            return '';
        }
    });

    // get bio description
    let bio = await page.evaluate(() => {
        if(document.querySelectorAll('header > section > div')[1].querySelectorAll('span')[0]) {
            return document.querySelectorAll('header > section > div')[1].querySelectorAll('span')[0].textContent;
        } else {
            return '';
        }
    });

    // get bio URL
    let bioUrl = await page.evaluate(() => {
        // check selector exists
        if(document.querySelectorAll('header > section > div')[1].querySelectorAll('a')[0]) {
            return document.querySelectorAll('header > section > div')[1].querySelectorAll('a')[0].getAttribute('href');
        } else {
            return '';
        }
    });

    // get bio display
    let bioUrlDisplay = await page.evaluate(() => {
        // check selector exists
        if(document.querySelectorAll('header > section > div')[1].querySelectorAll('a')[0]) {
            return document.querySelectorAll('header > section > div')[1].querySelectorAll('a')[0].textContent;
        } else {
            return '';
        }
    });

    // check if account is private or not
    let isPrivateAccount = await page.evaluate(() => {
        // check selector exists
        if(document.getElementsByTagName('h2')[0]) {
            // check selector text content
            if(document.getElementsByTagName('h2')[0].textContent == 'This Account is Private') {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    });

    // get recent posts (array of url and photo)
    let recentPosts = await page.evaluate(() => {
        let results = [];

        // loop on recent posts selector
        document.querySelectorAll('div[style*="flex-direction"] div > a').forEach((el) => {
            // init the post object (for recent posts)
            let post = {};

            // fill the post object with URL and photo data
            post.url = 'https://www.instagram.com' + el.getAttribute('href');
            post.photo = el.querySelector('img').getAttribute('src');

            // add the object to results array (by push operation)
            results.push(post);
        });

        // recentPosts will contains data from results
        return results;
    });

    return {
        username: username,
        name: name,
        userImageUrl: usernamePictureUrl,

        bio: bio,
        bioUrl: bioUrl,
        bioUrlName: bioUrlDisplay,

        postCount: postsCount,
        followersCount: followersCount,
        followingsCount: followingsCount,

        isVerified: isVerifiedAccount,
        isPrivate: isPrivateAccount,

        recentPosts: recentPosts
    }
}