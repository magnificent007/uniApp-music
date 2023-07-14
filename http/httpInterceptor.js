// 此vm参数为页面的实例，可以通过它引用vuex中的变量
module.exports = (vm) => {
    // 初始化请求配置
    uni.$u.http.setConfig((config) => {
        /* config 为默认全局配置*/
        config.baseURL = 'https://netease-cloud-music-api-tan-sigma.vercel.app'; /* 根域名 */
        return config
    })
	
	// // 请求拦截
	// uni.$u.http.interceptors.request.use((config) => { // 可使用async await 做异步操作
	//     // 初始化请求拦截器时，会执行此方法，此时data为undefined，赋予默认{}
	//     config.data = config.data || {}
	// 	// 根据custom参数中配置的是否需要token，添加对应的请求头
	// 	if(config?.custom?.auth) {
	// 		// 可以在此通过vm引用vuex中的变量，具体值在vm.$store.state中
	// 		config.header.token = vm.$store.state.userInfo.token
	// 	}
	//     return config 
	// }, config => { // 可使用async await 做异步操作
	//     return Promise.reject(config)
	// })
	
	// 响应拦截
	uni.$u.http.interceptors.response.use((response) => { /* 对响应成功做点什么 可使用async await 做异步操作*/
		// const data = response.data

		// 自定义参数
		// const custom = response.config?.custom
		const {statusCode, data} = response
		if(statusCode < 400){
			return data
		}
	}, (response) => { 
		const {statusCode, data} = response
		if(statusCode === 410){
			vm.$u.toast('该账号未注册，暂不提供注册功能')
		}else if(statusCode === 503){
			vm.$u.toast('验证码错误')
		}else if(statusCode === 404){
			if(data.message === '亲爱的,暂无版权'){
				vm.$u.toast('亲爱的,暂无版权')
				return data
			}
			// return Promise.reject(response)
		}
		// 对响应错误做点什么 （statusCode !== 200）
		// return Promise.reject(response)
	})
}