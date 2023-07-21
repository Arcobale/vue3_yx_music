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
export function reqPersonalFM(params) {
    return requests({
        method: 'get',
        url: `/personal_fm`,
        params
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

// 获取专辑内容
export function reqAlbumDetail(params) {
    return requests({
        method: 'get',
        url: `/album`,
        params
    })
}

// 获取专辑动态信息
export function reqAlbumDetailDynamic(params) {
    return requests({
        method: 'get',
        url: `/album/detail/dynamic`,
        params
    })
}

// 搜索
export function reqSearch(params) {
    return requests({
        method: 'get',
        url: `/search`,
        params
    })
}

// 默认搜索关键词
export function reqSearchDefault() {
    return requests({
        method: 'get',
        url: `/search/default`
    })
}

// 热搜列表-简略
export function reqSearchHot() {
    return requests({
        method: 'get',
        url: `/search/hot`
    })
}

// 热搜列表-详细
export function reqSearchHotDetail() {
    return requests({
        method: 'get',
        url: `/search/hot/detail`
    })
}

// 搜索建议
export function reqSearchSuggest(params) {
    return requests({
        method: 'get',
        url: `/search/suggest`,
        params
    })
}

// 搜索多重匹配
export function reqSearchMultiMatch(params) {
    return requests({
        method: 'get',
        url: `/search/multimatch`,
        params
    })
}

// 获取歌词
export function reqLyric(params) {
    return requests({
        method: 'get',
        url: `/lyric`,
        params
    })
}

// 获取逐字歌词
export function reqLyricWordByWord(params) {
    return requests({
        method: 'get',
        url: `/lyric/new`,
        params
    })
}

// 获取歌曲评论
export function reqCommentMusic(params) {
    return requests({
        method: 'get',
        url: `/comment/music`,
        params
    })
}

// 获取楼层评论
export function reqCommentFloor(params) {
    return requests({
        method: 'get',
        url: `/comment/floor`,
        params
    })
}

// 二维码登录
// 生成key
export function reqQRKey() {
    return requests({
        method: 'get',
        url: `/login/qr/key`
    })
}

// 生成二维码
export function reqQRCodeLink(params) {
    return requests({
        method: 'get',
        url: `/login/qr/create`,
        params
    })
}

// 检测扫码状态
export function reqQRCheck(params) {
    return requests({
        method: 'get',
        url: `/login/qr/check`,
        params
    })
}

// 注册
export function reqRegister(params) {
    return requests({
        method: 'get',
        url: `/register/cellphone`,
        params
    })
}

// 检测手机号码是否已注册
export function reqPhoneExistence(params) {
    return requests({
        method: 'get',
        url: `/cellphone/existence/check`,
        params
    })
}

// 重复昵称检测
export function reqCheckNickname(params) {
    return requests({
        method: 'get',
        url: `/nickname/check`,
        params
    })
}

// 初始化昵称
export function reqInitNickname(params) {
    return requests({
        method: 'get',
        url: `/activate/init/profile`,
        params
    })
}

// 手机登录
export function reqLoginPhone(params) {
    return requests({
        method: 'get',
        url: `/login/cellphone`,
        params
    })
}

// 发送验证码
export function reqSentCaptcha(params) {
    return requests({
        method: 'get',
        url: `/captcha/sent`,
        params
    })
}

// 验证验证码
export function reqVerifyCaptcha(params) {
    return requests({
        method: 'get',
        url: `/captcha/verify`,
        params
    })
}

// 退出登录
export function reqLogout() {
    return requests({
        method: 'get',
        url: `/logout`
    })
}

// 获取登录状态
export function reqLoginStatus() {
    return requests({
        method: 'get',
        url: `/login/status`
    })
}

// 获取用户详情
export function reqUserDetail(params) {
    return requests({
        method: 'get',
        url: `/user/detail`,
        params
    })
}

// 获取账号信息
export function reqUserAccount(params) {
    return requests({
        method: 'get',
        url: `/user/account`,
        params
    })
}

// 获取用户信息，歌单，收藏，mv数量
export function reqUserSubcount() {
    return requests({
        method: 'get',
        url: `/user/subcount`
    })
}

// 获取用户歌单
export function reqUserPlaylist(params) {
    return requests({
        method: 'get',
        url: `/user/playlist`,
        params
    })
}

// 新建歌单
export function reqCreatePlaylist(params) {
    return requests({
        method: 'put',
        url: `/playlist/create`,
        params
    })
}

// 删除歌单
export function reqDeletePlaylist(params) {
    return requests({
        method: 'put',
        url: `/playlist/delete`,
        params
    })
}

// 更新歌单
export function reqUpdatePlaylist(params) {
    return requests({
        method: 'put',
        url: `/update/playlist`,
        params
    })
}

// 对歌单添加或删除歌曲
export function reqUpdatePlaylistTrack(params) {
    return requests({
        method: 'put',
        url: `/playlist/tracks`,
        params
    })
}

// 歌单封面上传
export function reqUploadPlaylistCover(params) {
    return requests({
        method: 'post',
        url: `/playlist/cover`,
        params
    })
}

// 收藏/取消歌手
export function reqSubArtist(params) {
    return requests({
        method: 'get',
        url: `/artist/sub`,
        params
    })
}

// 收藏/取消视频
export function reqSubVideo(params) {
    return requests({
        method: 'get',
        url: `/video/sub`,
        params
    })
}

// 收藏/取消MV
export function reqSubMV(params) {
    return requests({
        method: 'get',
        url: `/mv/sub`,
        params
    })
}

// 收藏/取消歌单
export function reqSubPlaylist(params) {
    return requests({
        method: 'get',
        url: `/playlist/subscribe`,
        params
    })
}

// 收藏/取消专辑
export function reqSubAlbum(params) {
    return requests({
        method: 'get',
        url: `/album/sub`,
        params
    })
}

// 喜欢音乐
export function reqLike(params) {
    return requests({
        method: 'put',
        url: `/like`,
        params
    })
}

// 获取收藏的歌手列表
export function reqArtistSublist() {
    return requests({
        method: 'get',
        url: `/artist/sublist`
    })
}

// 获取收藏的MV列表
export function reqMVSublist() {
    return requests({
        method: 'get',
        url: `/mv/sublist`
    })
}

// 获取收藏的专辑列表
export function reqAlbumSublist(params) {
    return requests({
        method: 'get',
        url: `/album/sublist`,
        params
    })
}

// 获取喜欢的音乐列表
export function reqLikeList(params) {
    return requests({
        method: 'get',
        url: `/likelist`,
        params
    })
}

// 发送/删除评论
export function reqUpdateComment(params) {
    return requests({
        method: 'put',
        url: `/comment`,
        params
    })
}

// 给评论点赞
export function reqLikeComment(params) {
    return requests({
        method: 'put',
        url: `/comment/like`,
        params
    })
}

// 获取视频标签列表
export function reqVideoGroupList() {
    return requests({
        method: 'get',
        url: `/video/group/list`
    })
}

// 获取视频热门分类列表
export function reqVideoCategoryList() {
    return requests({
        method: 'get',
        url: `/video/category/list`
    })
}

// 获取指定标签/热门分类id下的视频列表
export function reqVideoGroup(params) {
    return requests({
        method: 'get',
        url: `/video/group`,
        params
    })
}

// 获取全部视频列表
export function reqVideoAll(params) {
    return requests({
        method: 'get',
        url: `/video/timeline/all`,
        params
    })
}

// 获取全部mv
export function reqMVAll(params) {
    return requests({
        method: 'get',
        url: `/mv/all`,
        params
    })
}

// 获取最新mv
export function reqMVFist(params) {
    return requests({
        method: 'get',
        url: `/mv/first`,
        params
    })
}

// 获取网易出品mv
export function reqMVExclusive(params) {
    return requests({
        method: 'get',
        url: `/mv/exclusive/rcmd`,
        params
    })
}

// 获取mv排行榜
export function reqMVTop(params) {
    return requests({
        method: 'get',
        url: `/top/mv`,
        params
    })
}

// 获取mv详情数据
export function reqMVDetail(params) {
    return requests({
        method: 'get',
        url: `/mv/detail`,
        params
    })
}

// 获取mv播放地址
export function reqMVUrl(params) {
    return requests({
        method: 'get',
        url: `/mv/url`,
        params
    })
}