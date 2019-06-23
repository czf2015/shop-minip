// store
import {
    dispatch,
} from './store/index.js'
// utils
import { wxerrorlog } from './utils/Error.js'
// services
import { login, getWxUserInfo } from './services/Admin.js'
import { getCartInfo, getProductsInfo } from './services/Purchase.js'
// 小程序发布版本号
const version = '0.0.0' + 'a' + 1 // Major.Minor.Patch(功能：主版本号、次版本及修订号) + a/b/c（阶段：开发/测试/上线） + 次数


App({
    globalData: {
    },

    onLaunch() {
        dispatch('set', { version })
        login().then(cookies => {
            getCartInfo()
        })
        getWxUserInfo()
        getProductsInfo()
    },

    onShow(options) {
        if (options.path == 'pages/history/history' && options.scene == '1014') {
            dispatch('set', { isOtherHistory: true })
        }
    },

    // 监听程序运行错误
    onError(error = {}) {
        wxerrorlog(error)
    }
})