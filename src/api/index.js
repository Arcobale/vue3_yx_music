import requests from './requests.js'

// Home
export function reqPersonalizedList(params) {
    return requests({
        method: 'get',
        url: `/personalized`,
        params
    })
}

export function reqPrivateContent() {
    return requests({
        method: 'get',
        url: `/personalized/privatecontent`
    })
}

export function reqNewSong() {
    return requests({
        method: 'get',
        url: `/personalized/newsong`
    })
}

export function reqPersonalizedMV() {
    return requests({
        method: 'get',
        url: `/personalized/mv`
    })
}

export function reqBanner() {
    return requests({
        method: 'get',
        url: `/banner`
    })
}

export function reqPlayListHQ(params) {
    return requests({
        method: 'get',
        url: `/top/playlist`,
        params
    })
}

export function reqPlayListTag() {
    return requests({
        method: 'get',
        url: `/playlist/catlist`
    })
}

export function reqPlayListHotTag() {
    return requests({
        method: 'get',
        url: `/playlist/hot`
    })
}

export function reqTopList() {
    return requests({
        method: 'get',
        url: `/toplist`
    })
}

// 获取歌单详情
export function reqTopListDetail(params) {
    return requests({
        method: 'get',
        url: `/playlist/detail`,
        params
    })
}

export function reqArtistList(params) {
    return requests({
        method: 'get',
        url: `/artist/list`,
        params
    })
}

export function reqNewSongList(params) {
    return requests({
        method: 'get',
        url: `/top/song`,
        params
    })
}

// PrivateFM
export function reqPersonalFM() {
    return requests({
        method: 'get',
        url: `/personal_fm`
    })
}

// RecentSong
export function reqRecentSong(params) {
    return requests({
        method: 'get',
        url: `/record/recent/song`,
        params
    })
}

// playlist
// 获取歌单所有歌曲
export function reqPlayListAll(params) {
    return requests({
        method: 'get',
        url: `/playlist/track/all`,
        params
    })
}

// 获取歌曲详情
export function reqSongDetail(params) {
    return requests({
        method: 'get',
        url: `/song/detail`,
        params
    })
}

// 获取音乐URL
export function reqSongUrl(params) {
    return requests({
        method: 'get',
        url: `/song/url/v1`,
        params
    })
}