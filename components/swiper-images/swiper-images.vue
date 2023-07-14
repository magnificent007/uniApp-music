<template>
	<view class="u-page">
		<u-swiper
			:list="images"
			keyName="image"
			showTitle
			:autoplay="true"
			:height="150"
			indicatorStyle="right: 40rpx"
			circular
			@change="e => current = e.current"
		>
			<view
				slot="indicator"
				class="indicator"
			>
				<view
					class="indicator__dot"
					v-for="(item, index) in images"
					:key="index"
					:class="[index === current && 'indicator__dot--active']"
				>
				</view>
			</view>
		</u-swiper>
	</view>
</template>

<script>
	export default {
		name:"swiper-images",
		data() {
			return {
				current: 0,
				images: [{
						image: 'https://cdn.uviewui.com/uview/swiper/swiper2.png',
						title: '与INTO1共赴周年之约',
					},
					{
						image: 'https://cdn.uviewui.com/uview/swiper/swiper1.png',
						title: '金志文燃情诠释「我的骄傲」'
					},
					{
						image: 'https://cdn.uviewui.com/uview/swiper/swiper3.png',
						title: '说唱人格EP2正式上线'
					}
				]
			};
		}
	}
</script>

<style lang="scss" scoped>
	.u-page{
		padding: 40rpx 40rpx 0 40rpx;
	}
	
	.indicator {
		@include flex(row);
		justify-content: center;
	
		&__dot {
			height: 6px;
			width: 6px;
			border-radius: 100px;
			background-color: rgba(255, 255, 255, 0.35);
			margin: 0 5px;
			transition: background-color 0.3s;
	
			&--active {
				background-color: #ffffff;
			}
		}
	}
	
	.indicator-num {
		padding: 2px 0;
		background-color: rgba(0, 0, 0, 0.35);
		border-radius: 100px;
		width: 35px;
		@include flex;
		justify-content: center;
	
		&__text {
			color: #FFFFFF;
			font-size: 12px;
		}
	}
</style>
