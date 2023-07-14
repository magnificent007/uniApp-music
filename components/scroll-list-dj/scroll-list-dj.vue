<template>
	<view class="u-page">
		<view style="margin-bottom: 20rpx;">热门电台</view>
		<u-scroll-list
			indicatorColor="#eeeeee"
			indicatorActiveColor="#7dc5eb"
			@right="right"
			@left="left"
		>
			<view
				class="scroll-list"
				style="flex-direction: row;"
			>
				<view
					class="scroll-list__menus-item"
					v-for="(item, index) in hotDjList"
					:key="index"
					:class="[(index === 9) && 'scroll-list__menus-item--no-margin-right']"
					@click="menu(item)"
				>
					<image
						class="scroll-list__menus-item__image"
						:src="item.picUrl"
						mode=""
					></image>
					<view class="scroll-list__menus-item__text">{{ item.name }}</view>
				</view>
				<view
					class="scroll-list__show-more"
					@tap="showMore"
				>
					<text class="scroll-list__show-more__text">查看更多</text>
					<u-icon
						name="arrow-rightward"
						color="#ffffff"
						size="12"
					></u-icon>
				</view>
			</view>
		</u-scroll-list>
	</view>
</template>

<script>
	export default {
		name:"scroll-list-dj",
		props: ['hotDjList'],
		data() {
			return {
				
			};
		},
		methods: {
			showMore() {
				uni.$u.toast('查看更多')
			},
			left() {
				console.log('left');
			},
			right() {
				console.log('right');
			},
			menu(dj){
				console.log(dj);
				this.$u.route({
					url: 'pages/menu-details/menu-details',
					params: {
						id: dj.id,
						name: dj.name,
						coverImgUrl: dj.picUrl,
						description: dj.rcmdtext,
						updateFrequency: dj.category,
						type: 4
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-page{
		padding: 40rpx 40rpx 0 40rpx;
	}
	
	.scroll-list {
		@include flex(column);
	
		&__menus-item {
			margin-right: 20px;
	
			&__image {
				width: 90px;
				height: 90px;
				border-radius: 4px;
			}
	
			&__text {
				height: 68rpx;
				width: 180rpx;
				color: #7dc5eb;
				text-align: center;
				font-size: 12px;
				margin-top: 5px;
				overflow:hidden;
				text-overflow:ellipsis;
			}
		}
	
		&__show-more {
			background-color: #7dc5eb;
			border-radius: 3px;
			padding: 3px 6px;
			@include flex(column);
			align-items: center;
			justify-content: center;
	
			&__text {
				font-size: 12px;
				width: 12px;
				color: #ffffff;
				line-height: 16px;
			}
		}
	
		&__line {
			@include flex;
			margin-top: 10px;
	
			&__item {
				margin-right: 15px;
	
				&__image {
					width: 61px;
					height: 48px;
				}
	
				&__text {
					margin-top: 5px;
					color: $u-content-color;
					font-size: 12px;
					text-align: center;
				}
	
				&--no-margin-right {
					margin-right: 0;
				}
			}
		}
	}
</style>
