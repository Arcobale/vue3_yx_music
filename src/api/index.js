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
export function reqPlayListAll(params) {
    return requests({
        method: 'get',
        url: `/playlist/track/all`,
        params
    })
}

export function reqSongDetail(params) {
    return requests({
        method: 'get',
        url: `/song/detail`,
        params
    })
}

export function reqSongUrl(params) {
    return requests({
        method: 'get',
        url: `/song/url/v1`,
        params
    })
}