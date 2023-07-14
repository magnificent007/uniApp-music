<template>
	<view>
		<view>
			<video class="myVideo" :src="mvUrl"></video>
		</view>
		<view class="u-page">
			<view style="display: flex; align-items: center; justify-content:flex-start; padding-bottom: 20rpx;">
				<u-image src="/static/avatar01.jpg" width="48" height="48" shape="circle"></u-image>
				<view style="padding-left: 20rpx;">{{mvMsg ? mvMsg.data.artistName : 'xxx'}}</view>
			</view>
			<view style="font-size: 14px; padding-bottom: 20rpx;">{{mvMsg ? mvMsg.data.name : 'xxx'}}</view>
			<view style="font-size: 12px; color: #BFBFBF;">{{mvMsg ? mvMsg.data.playCount : 0}}次观看·{{mvMsg ? mvMsg.data.publishTime : '0000-00-00'}}</view>
		</view>
		<u-divider></u-divider>
		<view class="u-page" v-if="hotComments.length || comments.length">
			<u-textarea
				v-model="comment" 
				placeholder="请输入评论内容" 
				:count="true" 
				confirmType="发送"
				@blur="blur">
			</u-textarea>
			<view style="padding-top: 20rpx; font-size: 14px;">评论（{{mvMsg.data.commentCount}}条）</view>
			<u-divider text="热评" :dashed="true"></u-divider>
			<view class="album" v-for="(item, index) in hotComments" :key="item.time">
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
					<u-album keyName="src2"></u-album>
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
			<u-divider text="最新" :dashed="true"></u-divider>
			<view class="album" v-for="(item, index) in comments" :key="item.time">
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
					<u-album keyName="src2"></u-album>
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
		</view>
		<view style="width: 100%;" v-if="loadmore">
			<u-loadmore status="loading" color="#BFBFBF" :line="true" />
		</view>
		<view style="width: 100%;" v-else>
			<u-loadmore status="nomore" nomoreText="没有更多了" color="#BFBFBF" :line="true" />
		</view>
	</view>
</template>

<script>
	import { getMvComment, getMvUrl, getMvMsg, sendDelComment } from '@/http/http.api.js';
	export default {
		data() {
			return {
				mvid: 0,
				mvUrl: '',
				
				comment: '',
				
				limit: 20,
				offset: 1,
				hotComments: [],
				comments: [],
				
				mvMsg: null,
				
				loadmore: true,
				
				t: 1,
				type: 1
			}
		},
		methods: {
			blur(e){
				console.log(e.target.value);
				if(this.comment === '')
					return;
				if(Object.keys(this.vuex_loginMsg).length !== 0){
					if(this.comment !== ''){
						sendDelComment({ params: { t: this.t, type: this.type, id: this.mvid, content: this.comment } }).then(res => {
							this.comment = '';
							this.$u.toast('评论发送成功');
						}).catch(e => {
							console.log(e);
						});
					}
				}else{
					this.$u.toast('请先登录');
				}
			}
		},
		async onLoad(option) {
			// console.log(option.mvid);
			this.innerAudioContext.pause();
			this.mvid = option.mvid;
			let mvUrl = await getMvUrl({ params: { id: this.mvid } });
			this.mvUrl = mvUrl.data.url;
			let mvMsg = await getMvMsg({ params: { mvid: this.mvid } });
			this.mvMsg = mvMsg;
			let { hotComments, comments } = await getMvComment({ params: { id: this.mvid, limit: this.limit, offset: (this.offset - 1) * this.limit } });
			this.hotComments = hotComments;
			this.comments = comments;
		},
		async onReachBottom() {
			this.offset += 1;
			let { comments } = await getMvComment({ params: { id: this.mvid, limit: this.limit, offset: (this.offset - 1) * this.limit } });
			if(comments.length === 0){
				this.loadmore = false;
				return;
			}
			this.comments = this.comments.concat(comments);
		}
	}
</script>

<style lang="scss" scoped>
	.myVideo{
		width: 100%;
	}
	
	.u-page{
		padding: 20rpx 40rpx 0 40rpx;
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
