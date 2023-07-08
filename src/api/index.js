import requests from './requests.js'

// Home
// 获取推荐歌单
export function reqPersonalizedList(params) {
    return requests({
        method: 'get',
        url: `/personalized`,
        params
    })
}

// 获取独家放送-入口列表
export function reqPrivateContent() {
    return requests({
        method: 'get',
        url: `/personalized/privatecontent`
    })
}

// 获取推荐新音乐
export function reqNewSong() {
    return requests({
        method: 'get',
        url: `/personalized/newsong`
    })
}

// 获取推荐MV
export function reqPersonalizedMV() {
    return requests({
        method: 'get',
        url: `/personalized/mv`
    })
}

// 获取首页banner
export function reqBanner() {
    return requests({
        method: 'get',
        url: `/banner`
    })
}

// 获取歌单（网友精选碟）
export function reqPlayListHQ(params) {
    return requests({
        method: 'get',
        url: `/top/playlist`,
        params
    })
}

// 获取歌单分类
export function reqPlayListTag() {
    return requests({
        method: 'get',
        url: `/playlist/catlist`
    })
}

// 获取热门歌单分类
export function reqPlayListHotTag() {
    return requests({
        method: 'get',
        url: `/playlist/hot`
    })
}

// 获取所有榜单
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

// 获取歌手分类列表
export function reqArtistList(params) {
    return requests({
        method: 'get',
        url: `/artist/list`,
        params
    })
}

// 获取新歌速递
export function reqNewSongList(params) {
    return requests({
        method: 'get',
        url: `/top/song`,
        params
    })
}

// PrivateFM
// 获取私人FM，需登录
export function reqPersonalFM() {
    return requests({
        method: 'get',
        url: `/personal_fm`
    })
}

// RecentSong
// 获取最近播放-歌曲
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

// 获取歌手描述
export function reqArtistDesc(params) {
    return requests({
        method: 'get',
        url: `/artist/desc`,
        params
    })
}

// 获取歌手详情
export function reqArtistDetail(params) {
    return requests({
        method: 'get',
        url: `/artist/detail`,
        params
    })
}

// 获取歌手热门50首歌曲
export function reqArtistTopSong(params) {
    return requests({
        method: 'get',
        url: `/artist/top/song`,
        params
    })
}

// 获取相似歌手
export function reqSimiArtist(params) {
    return requests({
        method: 'get',
        url: `/simi/artist`,
        params
    })
}

// 获取歌手专辑
export function reqArtistAlbum(params) {
    return requests({
        method: 'get',
        url: `/artist/album`,
        params
    })
}

// 获取歌手MV
export function reqArtistMV(params) {
    return requests({
        method: 'get',
        url: `/artist/mv`,
        params
    })
}

// 获取MV播放地址
export function reqMV(params) {
    return requests({
        method: 'get',
        url: `/mv`,
        params
    })
}