<template>
	<view>
		<view class="personal">
			<view>
			    <u-row
					justify="space-between"
					gutter="10"
					align="center"
					>
			        <u-col span="2">
			            <view>
							<u-avatar :src="avatarUrl"></u-avatar>
						</view>
			        </u-col>
			        <u-col span="7">
			            <view>
							<text class="font_ellipsis login">{{nickName ? nickName : "未登录"}}</text>
						</view>
			        </u-col>
			        <u-col span="3" textAlign="right">
			            <u-button
							size="small"
							shape="circle"
							text="立即登录"
							:plain="true"
							@click="login"
							v-if="nickName === ''">
						</u-button>
						<u-button
							size="small"
							shape="circle"
							text="立即退出"
							:plain="true"
							@click="loginOut"
							v-else>
						</u-button>
			        </u-col>
			    </u-row>
			</view>
		</view>
		<!-- 登录 -->
		<u-overlay :show="show">
			<u-transition :show="show">
				<view class="content">
					<view class="u-demo-block">
						<text class="u-demo-block__title">请输入手机号</text>
						<view class="u-demo-block__content">
							<u-input
								placeholder="请输入手机号"
								clearable
								v-model="phoneNums"
								style="border: 1px solid #000000;"
							></u-input>
						</view>
					</view>
					<view class="u-demo-block">
						<text class="u-demo-block__title">请输入验证码</text>
						<view class="u-demo-block__content">
							<u-input placeholder="请输入验证码" v-model="identifyCodes">
								<template slot="suffix">
									<u-code
										ref="uCode"
										@change="codeChange"
										seconds="30"
										changeText="x秒重新获取"
									></u-code>
									<u-button
										@tap="getCode"
										:text="tips"
										type="success"
										size="mini"
									></u-button>
								</template>
							</u-input>
						</view>
					</view>
					<u-row
						justify="space-between"
						gutter="10"
						align="center">
					    <u-col span="5">
					        <view>
								<u-button type="success" size="small" @click="certain">确定</u-button>
							</view>
					    </u-col>
					    <u-col span="2"></u-col>
					    <u-col span="5" textAlign="right">
					        <view>
								<u-button size="small" @click="login">取消</u-button>
							</view>
					    </u-col>
					</u-row>
				</view>
			</u-transition>
		</u-overlay>
		<!-- 加载页 -->
		<u-loading-page
			:loadingText="loadingPageData.loadingText"
			:loadingMode="loadingPageData.loadingMode"
			:bgColor="loadingPageData.bgColor"
			:color="loadingPageData.color"
			:loading="loading"
			:loadingColor="loadingPageData.loadingColor"
			style="z-index: 999;"></u-loading-page>
		<!-- 登录成功消息通知 -->
		<u-notify ref="uNotify"></u-notify>
		
		<view class="setting">
			<u-cell-group>
				<u-cell icon="list" title="最近播放" :isLink='true'></u-cell>
				<u-cell icon="file-text" title="本地下载" :isLink='true'></u-cell>
				<u-cell icon="man-add" title="我的好友" :isLink='true'></u-cell>
				<u-cell icon="eye" title="我的关注" :isLink='true'></u-cell>
				<u-cell icon="gift" title="我的收藏" :isLink='true'></u-cell>
				<u-cell icon="setting" title="个人设置" :isLink='true'></u-cell>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	import { existenceCheck, getIdentifyCodes, verifyCodes, codeLogin, logout } from '@/http/http.api.js';
	export default {
		data() {
			return {
				show: false,
				
				tips: '',
				phoneNums: '',
				identifyCodes: '',
				
				nickName: '',
				avatarUrl: '/static/avatar01.jpg',
				
				sth: true,
				
				// 加载页
				loading: false,
				loadingPageData: {
					loadingText: '正在登录...',
					loadingMode: 'spinner',
					bgColor: 'rgba(0, 0, 0, 0.3)',
					color: '#ffffff',
					loadingColor: '#ffffff'
				},
				
				// 消息通知
				notifyData: {
					message: '登录成功！',
					type: 'success',
					color: '#FFFFFF',
					bgColor: '',
					fontSize: 15,
					duration: 3000,
				}
			};
		},
		methods: {
			login(){
				if(this.vuex_loginMsg.data){
					return;
				}
				this.show = !this.show;
			},
			codeChange(text) {
				this.tips = text;
			},
			async getCode() {
				if(!this.phoneNums){
					this.$u.toast('手机号为空！');
					return;
				}
				if(!this.$u.test.mobile(this.phoneNums)){
					this.$u.toast('手机号不符合规范！');
					return;
				}
				if (this.$refs.uCode.canGetCode) {
					uni.showLoading({
						title: '正在获取验证码'
					})
					let exist = await existenceCheck({ params: {phone: this.phoneNums} })
					let { data: existNum } = exist;
					if(existNum != -1){
						// 模拟向后端请求验证码
						setTimeout(() => {
							uni.hideLoading();
							// 这里此提示会被this.start()方法中的提示覆盖
							uni.$u.toast('验证码已发送');
							// 通知验证码组件内部开始倒计时
							this.$refs.uCode.start();
						}, 2000);
						await getIdentifyCodes({ params: {phone: this.phoneNums} });
					}else{
						uni.$u.toast('该手机号未注册！暂不提供注册功能！');
					}
				} else {
					uni.$u.toast('倒计时结束后再发送');
				}
			},
			// 确定登录，发送请求
			async certain(){
				if(this.$u.test.mobile(this.phoneNums) && this.identifyCodes){
					this.login();
					this.loading = true;
					let { data: bool } = await verifyCodes({ params: {phone: this.phoneNums, captcha: this.identifyCodes} });
					if(bool){
						let loginMsg = await codeLogin({ params: {phone: this.phoneNums, captcha: this.identifyCodes} });
						this.$u.vuex('vuex_loginMsg', loginMsg);
						this.loading = false;
						this.openNotify(this.notifyData);
						this.nickName = this.vuex_loginMsg.profile.nickname;
						this.avatarUrl = this.vuex_loginMsg.profile.avatarUrl;
					}else{
						this.loading = false;
						this.login();
						this.$u.toast('验证码不正确！');
					}
				}else{
					this.$u.toast('手机号不正确或验证码缺失！');
				}
			 },
			 // 退出登录
			 loginOut(){
				 if(this.vuex_loginMsg){
					 this.phoneNums = '';
					 this.identifyCodes = '';
					 this.nickName = '';
					 this.avatarUrl = '/static/avatar01.jpg';
					 this.$u.vuex('vuex_loginMsg', {});
					 console.log('退出')
					 logout();
				 }else{
					 return;
				 }
			 },
			 openNotify(params) {
			 	this.$refs.uNotify.show({
			 		...params
			 	})
			 }
		},
		async onLoad() {
			this.nickName = (Object.keys(this.vuex_loginMsg).length !== 0 ? this.vuex_loginMsg.profile.nickname : '');
			this.avatarUrl = (Object.keys(this.vuex_loginMsg).length !== 0 ? this.vuex_loginMsg.profile.avatarUrl : '/static/avatar01.jpg');
		}
	}
</script>

<style lang="scss" scoped>
	.u-page{
		padding: 40rpx 40rpx 0 40rpx;
	}
	
	.personal {
		padding: 20rpx 40rpx;
		background-color: #FFFFFF;
		&__grid_item_1{
			width: 50% !important;
			&__grid{
				width: 100% !important;
				&_item_1{
					width: 20% !important;
				}
				&_item_2{
					width: 60% !important;
				}
				&_item_3{
					width: 20% !important;
				}
			}
		}
		&__grid_item_2{
			width: 35% !important;
		}
		&__grid_item_3{
			width: 15% !important;
		}
	}
	
	.login{
		color: #adb1b8;
	}
	
	.content{
		position: absolute;
		z-index: 10077;
		margin-top: 50%;
		margin-left: 50%;
		transform: translateX(-50%);
		border: 1px solid #FFFFFF;
		border-radius: 30rpx;
		background-color: #FFFFFF;
		width: 250px;
		height: 240px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	
	.u-demo-block {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		margin-bottom: 13px;
		// width: 230px;
		
		&__content {
			@include flex(column);
			width: 220px;
		}
		
		&__title {
			font-size: 14px;
			color: rgb(143, 156, 162);
			margin-bottom: 8px;
			@include flex;
		}
	}
	
	// 文字超出省略
	.font_ellipsis{
		font-size: 14px;
		overflow:hidden;
		white-space:nowrap; 
		text-overflow:ellipsis;
	}
	
	.setting{
		margin-top: 40rpx;
	}
</style>
