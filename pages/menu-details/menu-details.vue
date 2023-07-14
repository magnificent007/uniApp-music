<template>
	<view class="commonStyle">
		<view class="title">
			<u-row
				justify="space-between"
				gutter="50"
				align="center"
				class="commonStyle">
				<u-col span="2">
					<view class="title__image">
						<u-image
							:src="this.coverImgUrl ? this.coverImgUrl : '/static/avatar01.jpg'"
							mode=""
							shape="circle"
							width="160rpx"
							height="160rpx"
						></u-image>
					</view>
				</u-col>
				<u-col span="1"></u-col>
				<u-col
					span="9"
					justify="around"
					>
					<u-row>
						<u-col span="12">
							<view class="title__name font_ellipsis">{{name}}</view>
						</u-col>
					</u-row>
					<u-row>
						<u-col span="12">
							<view class="title__description font_ellipsis">{{description}}</view>
						</u-col>
					</u-row>
					<u-row>
						<u-col span="12">
							<view class="title__updateFrequency font_ellipsis">{{updateFrequency}}</view>
						</u-col>
					</u-row>
				</u-col>
			</u-row>
		</view>
		<view class="playAll">
			<u-row
				justify="space-between"
				gutter="10"
				align="center"
				class="commonStyle"
				@click="playAll">
				<u-col span="1"></u-col>
				<u-col span="1">
					<u-icon name="play-circle" size="20px" color="white"></u-icon>
				</u-col>
				<u-col span="3">
					<text class="playAll__textColor">播放全部</text>
				</u-col>
				<u-col span="5">
					
				</u-col>
				<u-col span="1">
					<text class="playAll__textColor">{{songs.length || 0}}</text>
				</u-col>
				<u-col span="1"></u-col>
			</u-row>
		</view>
		<u-loadmore
			:status="status" 
			:loading-text="loadingText"
			v-if="songs.length === 0"
		></u-loadmore>
		<block
			v-for="(item, index) in songs"
			:key="index"
			v-else>
			<u-cell
				:title="item.name"
				:label="item.ar[0].name"
				class="commonStyle"
			>
				<u-icon name="play-circle" size="20px" slot="right-icon" @click="addPlayList(item)"></u-icon>
				<u-image v-if="item.mv !== 0" src="/static/MV.png" width="16" height="16" slot="value" @click="playMv(item.mv)"></u-image>
			</u-cell>
		</block>
		<u-empty
			class="commonStyle"
			mode="data"
			icon="http://cdn.uviewui.com/uview/empty/data.png"
			text="我是有底线的>'⌒'<∣∣∣"
			v-if="base"
		>
		</u-empty>
		<view style="width: 100%; height: 40rpx;"></view>
		<!-- 加载页 -->
		<u-loading-page
			:loadingText="loadingPageData.loadingText"
			:loadingMode="loadingPageData.loadingMode"
			:bgColor="loadingPageData.bgColor"
			:color="loadingPageData.color"
			:loading="loading2"
			:loadingColor="loadingPageData.loadingColor"
			style="z-index: 999;"></u-loading-page>
		</u-button>
	</view>
</template>

<script>
	import { getMenuSongs, checkSongUrl, getSong } from '@/http/http.api.js';
	import Vue from 'vue';
	export default {
		data() {
			return {
				loading: false,
				
				id: 0,
				name: '',
				coverImgUrl: '',
				description: '',
				updateFrequency: '',
				
				songs: [],
				
				status: 'loading',
				loadingText: '努力加载中...',
				
				base: false,
				
				// 加载页
				loading2: false,
				loadingPageData: {
					loadingText: '正在搜索',
					loadingMode: 'semicircle',
					bgColor: 'rgba(0, 0, 0, 0.3)',
					color: '#ffffff',
					loadingColor: '#ffffff'
				},
			}
		},
		methods: {
			// 播放全部
			playAll(){
				this.loading2 = true;
				this.$u.vuex('vuex_addPlayList', this.songs);
				this.$u.vuex('vuex_playIndex', 0);
				this.$u.vuex('vuex_lyric', []);
				this.$u.vuex('vuex_currentTime', 0);
				this.innerAudioContext.pause();
				this.loading2 = false;
				this.$u.toast('添加成功');
			},
			// 添加到播放列表
			addPlayList(song){
				console.log(song);
				this.loading2 = true;
				this.$u.vuex('vuex_addPlayList', [song]);
				this.$u.vuex('vuex_playIndex', 0);
				this.$u.vuex('vuex_lyric', []);
				this.$u.vuex('vuex_currentTime', 0);
				this.innerAudioContext.pause();
				this.loading2 = false;
				this.$u.toast('添加成功');
				// 设置对象存键值
				// let obj = {};
				// this.$zaudio.audiolist = this.$zaudio.audiolist.reduce((item, next) => {
				// 	// 判断下一个对象中的src路径是否在obj对象中是真值，是真值存在则为空并不给item数组 push对象
				// 	// 为假不存在则设置该对象的src为obj的键值并设为真值，追加该对象到item中
				// 	obj[next.src] ? '' : obj[next.src] = true && item.push(next);
				// 	return item;
				// }, []);
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
		async onLoad(option) {
			this.loading = true;
			this.base = false;
			
			this.id = option.id;
			this.name = option.name;
			this.coverImgUrl = option.coverImgUrl;
			this.description = option.description;
			this.updateFrequency = option.updateFrequency;
			
			let res = await getMenuSongs({ params: { id: this.id } });
			this.songs = res.songs;
			this.loading = false;
			this.base = true;
		}
	}
</script>

<style lang="scss" scoped>
	.font_ellipsis{
		overflow:hidden;
		white-space:nowrap; 
		text-overflow:ellipsis;
	}
	
	.title{
		background-color: #3399ff;
		width: 100%;
		
		&__image{
			padding: 20rpx;
		}
		
		&__name{
			height: 50rpx;
			line-height: 50rpx; 
			color: #FFFDEF;
		}
		
		&__description{
			font-size: 14px;
			height: 50rpx; 
			line-height: 50rpx; 
			color: #FFFDEF;
		}
		
		&__updateFrequency{
			font-size: 12px;
			height: 50rpx; 
			line-height: 50rpx; 
			color: #FFFDEF
		}
	}
	
	.playAll{
		width: 100%;
		height: 40px; 
		background-color: #8cd3ff;
		
		&__textColor{
			color: #FFFDEF;
		}
	}
	
	.commonStyle{
		width: 100%;
		height: 100%;
	}
</style>
