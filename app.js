// 
import {
    store,
    dispatch,
} from './store/index.js'
// 
import { login, authorize, getWxUserInfo } from './utils/Admin.js'
import { getCartInfo, getProductsInfo } from './utils/Purchase.js'
import { wxerrorlog } from './utils/Error.js'
// 
const version = '0.0.0' + 'a' //小程序发布版本号


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