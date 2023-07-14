const http = uni.$u.http

// post请求，获取菜单
// export const postMenu = (params, config = {}) => http.post('/ebapi/public_api/index', params, config)


// 检测手机是否已经注册
export const existenceCheck = (data) => http.get('/cellphone/existence/check', data)

// 获取验证码
export const getIdentifyCodes = (data) => http.get('/captcha/sent', data)

// 验证验证码
export const verifyCodes = (data) => http.get('/captcha/verify', data)

// 手机验证码登录
export const codeLogin = (data) => http.get('/login/cellphone', data)

// 退出登录
export const logout = () => http.get('/logout')

// 登陆状态
export const loginStatus = () => http.get('/login/status')

// 获取精选碟歌单
export const hotPlayList = (data) => http.get('/top/playlist', data)

// 获取歌单所有歌曲
export const getMenuSongs = (data) => http.get('/playlist/track/all', data)

// get请求，获取歌曲
export const getSong = (data) => http.get('/song/url', data)

// 关键字 搜索歌曲
export const cloudSearch = (data) => http.get('/cloudsearch', data)

// 获取歌词
export const getLyric = (data) => http.get('/lyric', data)

// 检查歌曲是否可用
export const checkSongUrl = (data) => http.get('/check/music', data)

// 获取歌曲评论
export const getSongComment = (data) => http.get('/comment/music', data)

// 发送/删除评论
export const sendDelComment = (data) => http.get('/comment', data)

// 热搜
export const hotSearch = () => http.get('/search/hot/detail')

// 所有榜单摘要
export const menusDetails = () => http.get('/toplist/detail')

// 最新mv
export const getFirstMv = () => http.get('/mv/first')

// 音悦台推荐mv
export const getCloudMv = (data) => http.get('/mv/exclusive/rcmd', data)

// 全部mv 可选 内地 港台 欧美 日本 韩国
export const getAllMv = (data) => http.get('/mv/all', data)

// mv评论
export const getMvComment = (data) => http.get('/comment/mv', data)

// mv地址
export const getMvUrl = (data) => http.get('/mv/url', data)

// mv数据信息 
export const getMvMsg = (data) => http.get('/mv/detail', data)

// 精选歌单
export const getTop = (data) => http.get('/top/playlist', data)
