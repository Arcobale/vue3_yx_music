import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    routes: [
        {
            path: '/',
            redirect: {
                name: '个性推荐'
            },
            hidden: true
        },
        {
            path: '/home',
            redirect: {
                name:'个性推荐'
            },
            name: '发现音乐',
            iconClass: 'Headset',
            children: [
                {
                    path: 'recommend',
                    name: '个性推荐',
                    component: () => import('@/views/Home/Recommend')
                },
                {
                    path: 'songlist',
                    name: '歌单',
                    component: () => import('@/views/Home/SongList')
                },
                {
                    path: 'rank',
                    name: '排行榜',
                    component: () => import('@/views/Home/Rank')
                },
                {
                    path: 'artist',
                    name: '歌手',
                    component: () => import('@/views/Home/Artist')
                },
                {
                    path: 'newmusic',
                    name: '最新音乐',
                    component: () => import('@/views/Home/NewMusic')
                }
            ]
        },
        {
            path: '/podcast',
            name: '播客',
            iconClass: 'Mic',
            component: () => import('@/views/Podcast')
        },
        {
            path: '/fm',
            name: '私人漫游',
            iconClass: 'Service',
            component: () => import('@/views/PrivateFM')
        },
        {
            path: '/video',
            redirect: {
                name: '视频列表'
            },
            name: '视频',
            iconClass: 'VideoCamera',
            children: [
                {
                    path: 'videolist',
                    name: '视频列表',
                    component: () => import('@/views/Video/VideoList')
                },
                {
                    path: 'mv',
                    name: 'MV列表',
                    component: () => import('@/views/Video/MV')
                }
            ]
        },
        {
            path: '/follow',
            name: '关注',
            iconClass: 'User',
            component: () => import('@/views/Follow')
        },
        {
            path: '/mylike',
            name: '我喜欢',
            iconClass: 'Apple',
            component: () => import('@/views/Like')
        },
        {
            path: '/downloadmusic',
            name: '下载管理',
            iconClass: 'Download',
            component: () => import('@/views/Download')
        },
        {
            path: '/recentsong',
            name: '最近播放',
            iconClass: 'PieChart',
            component: () => import('@/views/RecentSong')
        },
        {
            path: '/collection',
            redirect: {
                name: '收藏专辑'
            },
            name: '我的收藏',
            iconClass: 'Star',
            children: [
                {
                    path: 'album',
                    name: '收藏专辑',
                    component: () => import('@/views/Collection/Album'),
                },
                {
                    path: 'singer',
                    name: '收藏歌手',
                    component: () => import('@/views/Collection/Singer'),
                },
                {
                    path: 'video',
                    name: '收藏视频',
                    component: () => import('@/views/Collection/Video'),
                }
            ]
        },
        {
            path: '/playlist/:id',
            name: 'playlist',
            component: () => import('@/views/PlayList'),
            hidden: true
        },
        {
            path: '/albumlist/:id',
            name: 'albumlist',
            component: () => import('@/views/AlbumList'),
            hidden: true
        },
        {
            path: '/artisthome/:id',
            redirect: {
                name: 'artistalbum'
            },
            name: 'artisthome',
            component: () => import('@/views/ArtistHome'),
            hidden: true,
            children: [
                {
                    path: 'album',
                    name: 'artistalbum',
                    component: () => import('@/views/ArtistHome/ArtistAlbum')
                },
                {
                    path: 'mv',
                    component: () => import('@/views/ArtistHome/ArtistMV')
                },
                {
                    path: 'detail',
                    component: () => import('@/views/ArtistHome/ArtistDetail')
                },
                {
                    path: 'simi',
                    component: () => import('@/views/ArtistHome/SimiArtist')
                },
            ]
        }
    ],
    history: createWebHistory()
});

export default router;