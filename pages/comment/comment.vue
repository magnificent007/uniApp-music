<template>
	<view>
		<view v-if="playListLen">
			<bing-lyric :lyrics="vlyric" :curTime="vcurrentTime"></bing-lyric>
			<u-button text="播放"  @click="play"></u-button>
			<u-button text="暂停"  @click="pause"></u-button>
			<u-textarea 
				class="u-page2" 
				v-model="comment" 
				placeholder="请输入评论内容" 
				:count="true" 
				confirmType="发送"
				@blur="blur">
			</u-textarea>
			<view class="u-page" v-if="vcomments.length || vhotComments.length">
				<u-divider text="热评" :hairline="true"></u-divider>
				<!-- HotComment -->
				<view class="album" v-for="(item, index) in vhotComments" :key="item.time">
					<view class="album__avatar">
						<u-image
								:src="item.user.avatarUrl"
								mode=""
								width=32
								height=32
						></u-image>
					</view>
					<view class="album__content">
						<u--text
								:text="item.user.nickname"
								type="primary"
								bold
								size="16"
						></u--text>
						<u--text
								margin="0 0 16rpx 0"
								:text="item.timeStr"
								size="12"
						></u--text>
						<u--text
								margin="0 0 16rpx 0"
								:text="item.content"
						></u--text>
						<u-album :urls="urls1" keyName="src2"></u-album>
						<u--text
							prefixIcon="heart"
							:text="item.likedCount"
							size=12
							margin="16rpx 0 32rpx 0"
							color="#bfbfbf" 
							iconStyle="color: #bfbfbf;"
							>
						</u--text>
					</view>
				</view>
				<u-divider :hairline="true"></u-divider>
				<!-- Comment -->
				<view class="album" v-for="(item, index) in vcomments" :key="item.time">
					<view class="album__avatar">
						<image
								:src="item.user.avatarUrl"
								mode=""
								style="width: 32px;height: 32px;"
						></image>
					</view>
					<view class="album__content">
						<u--text
								:text="item.user.nickname"
								type="primary"
								bold
								size="16"
						></u--text>
						<u--text
								margin="0 0 16rpx 0"
								:text="item.timeStr"
								size="12"
						></u--text>
						<u--text
								margin="0 0 16rpx 0"
								:text="item.content"
						></u--text>
						<u-album :urls="urls1" keyName="src2"></u-album>
						<u--text
							prefixIcon="heart"
							:text="item.likedCount"
							size=12
							margin="0 0 32rpx 0"
							color="#bfbfbf" 
							iconStyle="color: #bfbfbf;"
							>
						</u--text>
					</view>
				</view>
				<view style="width: 100%;" v-if="loadmore">
					<u-loadmore status="loading" color="#BFBFBF" :line="true" />
				</view>
				<view style="width: 100%;" v-else>
					<u-loadmore status="nomore" nomoreText="没有更多了" color="#BFBFBF" :line="true" />
				</view>
			</view>
		</view>
		<u-empty
			mode="data"
			icon="http://cdn.uviewui.com/uview/empty/data.png"
			v-else
		>
		</u-empty>
	</view>
</template>

<script>
	import { getSongComment, sendDelComment, checkSongUrl, getSong } from '@/http/http.api.js';
	// import zaudio from '@/components/uniapp-zaudio/zaudio';
	export default {
		// components: {zaudio},
		data() {
			return {
				urls1: [],
				
				offset: 1,
				limit: 10,
				
				songId: 0,
				
				
				// comment加载到底了
				loadmore: true,
				
				// 待发送评论
				comment: '',
				t: 1,
				type: 0,
			}
		},
		methods: {
			
			getComments(){
				if(this.playListLen.length){
					this.songId = this.playList[this.vplayIndex].id;
					console.log(this.songId);
					getSongComment({ params: { id: this.songId, limit: this.limit, offset: (this.offset - 1) * this.limit } }).then(res => {
						this.$u.vuex('vuex_comments', res.comments);
						this.$u.vuex('vuex_hotComments', res.hotComments);
					}).catch(e => {
						console.log(e);
					});
				}
			},
			blur(e){
				console.log(e.target.value);
				if(this.comment === '')
					return;
				if(Object.keys(this.vuex_loginMsg).length !== 0){
					sendDelComment({ params: { t: this.t, type: this.type, id: this.songId, content: this.comment } }).then(res => {
						this.comment = '';
						this.$u.toast('评论发送成功');
					}).catch(e => {
						console.log(e);
					});
				}else{
					this.$u.toast('请先登录');
				}
			},
			pause(){
				this.innerAudioContext.pause();
			},
			play(){
				this.innerAudioContext.play();
			}
		},
		async onReachBottom() {
			this.offset = this.offset + 1;
			let res = await getSongComment({ params: { id: this.songId, limit: this.limit, offset: (this.offset - 1) * this.limit } })
			if(res.comments.length === 0){
				this.loadmore = false;
				return;
			}
			let comments = this.vuex_comments;
			comments = comments.concat(res.comments);
			this.$u.vuex('vuex_comments', comments);
		},
		computed: {
			playListLen() {
				return this.vuex_addPlayList.length;
			},
			playList() {
				return this.vuex_addPlayList;
			},
			vplayIndex() {
				return this.vuex_playIndex;
			},
			vlyric() {
				// console.log(this.vuex_lyric);
				return this.vuex_lyric;
			},
			vcurrentTime() {
				return this.vuex_currentTime;
			},
			vcomments() {
				this.songId = this.playList[this.vplayIndex].id;
				return this.vuex_comments;
			},
			vhotComments() {
				return this.vuex_hotComments;
			}
		},
		watch: {
			vplayIndex() {
				this.getComments();
			}
		},
		onLoad(){
			this.base = false;
			this.offset = 1;
		},
		onShow(){
			this.innerAudioContext.onCanplay(() => {
				console.log('可以播放');
			});
		}
	}
</script>

<style lang="scss" scoped>
	.u-page{
		padding: 40rpx;
	}
	
	.u-page2{
		margin: 40rpx;
	}
	
	.album {
		@include flex;
		align-items: flex-start;
		width: 100%;
	
		&__avatar {
			 background-color: $u-bg-color;
			 padding: 10rpx;
			 border-radius: 6rpx;
		 }
	
		&__content {
			 margin-left: 20rpx;
			 flex: 1;
		 }
	}
</style>
