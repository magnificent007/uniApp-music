<template>
	<view class="u-page">
		<view class="tab">
			<u-tabs scrollable :list="list" :current="curt" @change="tabChange"></u-tabs>
		</view>
		<view v-for="(item, index) in mvList" :key="item.id">
			<view class="mv" @click="mvideo(item)">
				<u-image :src="item.cover" width="150" height="100" radius="10" mode=""></u-image>
				<view class="mv_description u-line-2">
					{{item.name}}
				</view>
				<view class="mv_playCount">
					<u-icon name="play-circle" :label="item.playCount" size="15" labelSize="12" color="#9a9a9a" labelColor="#9a9a9a"></u-icon>
					<text class="mv_playCount_author u-line-1">{{item.artistName}}</text>
				</view>
			</view>
		</view>
		<view style="width: 100%; margin-bottom: 10rpx;" v-if="loadmore">
			<u-loadmore status="loading" color="#BFBFBF" :line="true" />
		</view>
		<view style="width: 100%; margin-bottom: 10rpx;" v-else>
			<u-loadmore status="nomore" nomoreText="没有更多了" color="#BFBFBF" :line="true" />
		</view>
		
		<!-- 加载页 -->
		<u-loading-page
			:loadingText="loadingPageData.loadingText"
			:loadingMode="loadingPageData.loadingMode"
			:bgColor="loadingPageData.bgColor"
			:color="loadingPageData.color"
			:loading="loading"
			:loadingColor="loadingPageData.loadingColor"
			style="z-index: 999;">
		</u-loading-page>
	</view>
</template>

<script>
	import { getFirstMv, getRecommendMv, getCloudMv, getAllMv } from '@/http/http.api.js';
	export default {
		data() {
			return {
				list: [{
					name: '最新'
				},{
					name: '音悦台推荐'
				},{
					name: '全部'
				},{
					name: '内地'
				},{
					name: '港台'
				},{
					name: '欧美'
				},{
					name: '日本'
				},{
					name: '韩国'
				}],
				curt: 0,
				tabName: '最新',
				
				limit: 30,
				
				mvList: [],
				
				loadmore: true,
				
				// 加载页
				loading: false,
				loadingPageData: {
					loadingText: '正在搜索',
					loadingMode: 'semicircle',
					bgColor: 'rgba(0, 0, 0, 0.3)',
					color: '#ffffff',
					loadingColor: '#ffffff'
				}
			};
		},
		methods: {
			async tabChange(item) {
				
				if(this.curt === item.index)
					return;
				this.curt = item.index;
				this.tabName = item.name;
				if(this.curt === 0){
					this.loadmore = true;
					this.loading = true;
					if(this.vuex_firstMv.length !== 0){
						this.mvList = this.vuex_firstMv;
						return;
					}
					let res = await getFirstMv({ params: { limit: this.limit } });
					this.$u.vuex('vuex_firstMv', res.data);
					this.mvList = res.data;
					this.loading = false;
				}else if(this.curt === 1){
					this.loadmore = true;
					this.loading = true;
					if(this.vuex_cloudMv.length !== 0){
						this.mvList = this.vuex_cloudMv;
						return;
					}
					let res = await getCloudMv({ params: { limit: this.limit } });
					this.$u.vuex('vuex_cloudMv', res.data);
					this.mvList = res.data;
					this.loading = false;
				}else{
					this.loadmore = true;
					this.loading = true;
					if(this.curt === 2 && this.vuex_allMv.length !== 0){
						this.mvList = this.vuex_allMv;
						return;
					}else if(this.curt === 3 && this.vuex_CMv.length !== 0){
						this.mvList = this.vuex_CMv;
						return;
					}else if(this.curt === 4 && this.vuex_GTMv.length !== 0){
						this.mvList = this.vuex_GTMv;
						return;
					}else if(this.curt === 5 && this.vuex_EAMv.length !== 0){
						this.mvList = this.vuex_EAMv;
						return;
					}else if(this.curt === 6 && this.vuex_JPMv.length !== 0){
						console.log('7')
						this.mvList = this.vuex_JPMv;
						return;
					}else if(this.curt === 7 && this.vuex_KMv.length !== 0){
						this.mvList = this.vuex_KMv;
						return;
					}	
					let res = await getAllMv({ params: { area: this.tabName, limit: this.limit } });
					if(this.curt === 2)
						this.$u.vuex('vuex_allMv', res.data);
					else if(this.curt === 3)
						this.$u.vuex('vuex_CMv', res.data);
					else if(this.curt === 4)
						this.$u.vuex('vuex_GTMv', res.data);
					else if(this.curt === 5)
						this.$u.vuex('vuex_EAMv', res.data);
					else if(this.curt === 6)
						this.$u.vuex('vuex_JPMv', res.data);
					else if(this.curt === 7)
						this.$u.vuex('vuex_KMv', res.data);
					this.mvList = res.data;
					this.loading = false;
				}
			},
			mvideo(item){
				console.log(item);
				let mv = item;
				this.$u.route({
					url: 'pages/mvideo/mvideo',
					params: {
						mvid: item.id
					}
				});
			}
		},
		async onLoad() {
			if(this.vuex_firstMv.length !== 0){
				this.mvList = this.vuex_firstMv;
				return;
			}
			let res = await getFirstMv({ params: { limit: this.limit } });
			this.$u.vuex('vuex_firstMv', res.data);
			this.mvList = res.data;
		},
		async onReachBottom(){
			if(this.curt === 0){
				this.loadmore = false;
				return;
			}
			if(this.curt === 1){
				let offset = Math.ceil(this.vuex_cloudMv.length / this.limit) + 1;
				let res = await getCloudMv({ params: { limit: this.limit, offset: (offset - 1) * this.limit } });
				if(!res.data.length){
					this.loadmore = false;
					return;
				};
				let arr = this.vuex_cloudMv;
				res.data.forEach(item => {
					arr.push(item);
				});
				this.$u.vuex('vuex_cloudMv', arr);
				this.mvList = this.vuex_cloudMv;
			}else{
				let offset = 1;
				let arr = [];
				if(this.curt === 2){
					offset = Math.ceil(this.vuex_allMv.length / this.limit) + 1;
					arr = this.vuex_allMv;
				}else if(this.curt === 3){
					offset = Math.ceil(this.vuex_CMv.length / this.limit) + 1;
					arr = this.vuex_CMv;
				}else if(this.curt === 4){
					offset = Math.ceil(this.vuex_GTMv.length / this.limit) + 1;
					arr = this.vuex_GTMv;
				}else if(this.curt === 5){
					offset = Math.ceil(this.vuex_EAMv.length / this.limit) + 1;
					arr = this.vuex_EAMv;
				}else if(this.curt === 6){
					offset = Math.ceil(this.vuex_JPMv.length / this.limit) + 1;
					arr = this.vuex_JPMv;
				}else if(this.curt === 7){
					offset = Math.ceil(this.vuex_KMv.length / this.limit) + 1;
					arr = this.vuex_KMv;
				}
				
				let res = await getAllMv({ params: { area: this.tabName, limit: this.limit, offset: (offset - 1) * this.limit } });
				if(!res.data.length){
					this.loadmore = false;
					return;
				};
				res.data.forEach(item => {
					arr.push(item);
				});
				
				if(this.curt === 2){
					this.$u.vuex('vuex_allMv', arr);
					this.mvList = this.vuex_allMv;
				}else if(this.curt === 3){
					this.$u.vuex('vuex_CMv', arr);
					this.mvList = this.vuex_CMv;
				}else if(this.curt === 4){
					this.$u.vuex('vuex_GTMv', arr);
					this.mvList = this.vuex_GTMv;
				}else if(this.curt === 5){
					this.$u.vuex('vuex_EAMv', arr);
					this.mvList = this.vuex_EAMv;
				}else if(this.curt === 6){
					this.$u.vuex('vuex_JPMv', arr);
					this.mvList = this.vuex_JPMv;
				}else if(this.curt === 7){
					this.$u.vuex('vuex_KMv', arr);
					this.mvList = this.vuex_KMv;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-page{
		padding: 0 40rpx;
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		justify-content: space-between;
	}
	.tab{
		width: 100%;
	}
	
	.mv{
		width: 300rpx;
		margin: 30rpx 0;
		
		&_description{
			width: 100%;
			padding-top: 6rpx;
			font-size: 14px;
		}
		
		&_playCount{
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 6rpx;
			
			&_author{
				font-size: 14px;
				padding: 0 0 0 10rpx;
				color: #9a9a9a;
			}
		}
	}
</style>
