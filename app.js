// 
import {
    dispatch,
} from './store/index.js'
// 
import { login, getWxUserInfo } from './utils/Admin.js'
import { getCartInfo, getProductsInfo } from './utils/Purchase.js'
import { wxerrorlog } from './utils/Error.js'
// 小程序发布版本号
const version = '0.0.0' + 'a' + 1 // Major.Minor.Patch(功能：主版本号、次版本及修订号) + a/b/c（阶段：开发/测试/上线） + 次数


App({
    globalData: {
    },

    onLaunch() {
        dispatch('set', { key: 'version', value: version })
        login().then(cookies => {
            getCartInfo()
        })
        getWxUserInfo()
        getProductsInfo()
    },

    onShow(options) {
        if (options.path == 'pages/history/history' && options.scene == '1014') {
            dispatch('switch', {
                key: 'isOtherHistory',
                value: true
            })
        }
    },

    // 监听程序运行错误
    onError(error = {}) {
        wxerrorlog(error)
    }
})