<template>
	<view>
		<u-sticky>
			<u-tabs :list="list" :current="0" @change="changeTab"></u-tabs>
		</u-sticky>
		<!-- search -->
		<view class="search">
			<u-search
				placeholder="搜索歌曲"
				v-model="keywords"
				:showAction="false"
				@search="search"
				@clear="clear">
			</u-search>
		</view>
		<!-- hotSearch -->
		<view v-if="keywords === ''">
			<u-divider text="热搜榜" class="search"></u-divider>
			<hot-search :indexList="hotSearch" @item-click='hotWordSearch'></hot-search>
		</view>
		<view v-else>
			<u-cell-group
				v-for="item in searchList"
				:key="item.id"
				>
				<u-cell
					:border="false"
					:title="item.name"
					:label="item.ar[0].name"
					:titleStyle="font_ellipsis"
					>
					<u-icon
						name="play-circle"
						size="20"
						slot="right-icon"
						@click="addPlayList(item)">
					</u-icon>
					<u-image
						v-if="item.mv !== 0" 
						src="/static/MV.png" 
						width="16" height="16" 
						slot="value" 
						@click="playMv(item.mv)">
					</u-image>
				</u-cell>
			</u-cell-group>
			<view style="width: 100%;" v-if="loadmore && searchList.length">
				<u-loadmore status="loading" color="#BFBFBF" :line="true" />
			</view>
			<view style="width: 100%;" v-else>
				<u-loadmore status="nomore" nomoreText="没有更多了" color="#BFBFBF" :line="true" />
			</view>
		</view>
		<!-- 加载页 -->
		<u-loading-page
			:loadingText="loadingPageData.loadingText"
			:loadingMode="loadingPageData.loadingMode"
			:bgColor="loadingPageData.bgColor"
			:color="loadingPageData.color"
			:loading="loading"
			:loadingColor="loadingPageData.loadingColor"
			style="z-index: 999;"></u-loading-page>
		</u-button>
	</view>
</template>

<script>
	
	import { cloudSearch, getSong, getLyric, checkSongUrl, hotSearch } from '@/http/http.api.js';
	export default {
		data() {
			return {
				curt: 0,
				// list: ['搜索', '歌词'],
				list: [{
						name: '控制&评论',
					}, {
						name: '播放列表',
					}],
				
				keywords: '',
				limit: 30,
				offset: 1,
				
				searchList: [],
				
				// 加载页
				loading: false,
				loadingPageData: {
					loadingText: '正在搜索',
					loadingMode: 'semicircle',
					bgColor: 'rgba(0, 0, 0, 0.3)',
					color: '#ffffff',
					loadingColor: '#ffffff'
				},
				
				font_ellipsis: {
					'width': '80vw',
					'overflow': 'hidden',
					'white-space': 'nowrap',
					'text-overflow': 'ellipsis'
				},
				
				// 搜索到底
				loadmore: true,
				
				// 热搜列表20条
				hotSearch: []
			}
		},
		methods: {
			changeTab(i) {
				this.curt = i.index;
				if(i.index === 0){
					this.$u.route('pages/comment/comment');
				}else{
					// this.$u.route('pages/comment/comment', {
					// 	songId: 
					// });
					this.$u.route('pages/play-list/play-list')
				}
			},
			// 歌曲搜索
			async search(){
				this.loading = true;
				this.offset = 1;
				this.searchList.splice(0, this.searchList.length);
				let res = await cloudSearch({ params: { keywords: this.keywords, limit: this.limit, offset: (this.offset - 1) * this.limit } });
				this.loading = false;
				if(res.result.songs.length !== 0){
					res.result.songs.forEach((item, index) => {
						this.searchList.push(item);
					});
				}
			},
			clear(){
				this.offset = 1;
				this.searchList.splice(0, this.searchList.length);
			},
			// 添加到播放列表
			addPlayList(song){
				this.loading = true;
				this.$u.vuex('vuex_addPlayList', [song]);
				this.$u.vuex('vuex_playIndex', 0);
				this.$u.vuex('vuex_lyric', []);
				this.$u.vuex('vuex_currentTime', 0);
				this.innerAudioContext.pause();
				this.loading = false;
				this.$u.toast('添加成功');
			},
			hotWordSearch(keyword){
				console.log(keyword);
				this.keywords = keyword;
				this.search();
			},
			playMv(mvid){
				this.$u.route({
					url: 'pages/mvideo/mvideo',
					params: {
						mvid: mvid
					}
				});;
			}
		},
		async onReachBottom(){
			if(this.keywords === '')
				return;
			this.loading = true;
			this.offset = this.offset + 1;
			let res = await cloudSearch({ params: { keywords: this.keywords, limit: this.limit, offset: (this.offset - 1) * this.limit } })
			this.loading = false;
			if(!res.result.songCount){
				this.loadmore = true;
				this.loading = false;
				this.$u.toast('到底了');
				return;
			}
			if(res.result.songs){
				this.loading = false;
				res.result.songs.forEach((item, index) => {
					this.searchList.push(item);
				});
			}
			// console.log(res.result.songs);
		},
		async onLoad() {
			let res = await hotSearch();
			this.hotSearch = res.data;
		},
		onUnload() {
			this.$off('item-click');
		}
	}
</script>

<style lang="scss" scoped>
	
	.search{
		padding: 20rpx 40rpx 20rpx;
	}
	
	// 文字超出省略
	.font_ellipsis{
		overflow:hidden;
		white-space:nowrap; 
		text-overflow:ellipsis;
	}
	
</style>
