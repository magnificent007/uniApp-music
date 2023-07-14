<template>
	<view class="u-page">
		<view style="margin-bottom: 20rpx;">榜单摘要</view>
		<view v-for="(item, index) in menuList" :key="index" class="songMenu">
			<u-row
				gutter="20"
				align="center"
				@click="menu(item)">
				<u-col
					span="4"
					align="center">
					<u-image :src="item.coverImgUrl" radius=10 width="192rpx" height="192rpx"></u-image>
				</u-col>
				<u-col
					span="8"
					align="center">
					<u-grid
						col="1"
						align="left"
						>
						<u-grid-item class="grid_item font_ellipsis"><text class="title">1.{{item.tracks[0].first}}-{{item.tracks[0].second}}</text></u-grid-item>
						<u-grid-item class="grid_item font_ellipsis"><text class="title">2.{{item.tracks[1].first}}-{{item.tracks[1].second}}</text></u-grid-item>
						<u-grid-item class="grid_item font_ellipsis"><text class="title">3.{{item.tracks[2].first}}-{{item.tracks[2].second}}</text></u-grid-item>
					</u-grid>	
				</u-col>
			</u-row>
		</view>
	</view>
</template>

<script>
	import { getMenuSongs } from '@/http/http.api.js';
	export default {
		name:"song-menu",
		props: [ 'menuList' ],
		data() {
			return {
				
			};
		},
		methods: {
			menu(menu){
				console.log(menu);
				this.$u.route({
					url: 'pages/menu-details/menu-details',
					params: {
						id: menu.id,
						name: menu.name,
						coverImgUrl: menu.coverImgUrl,
						description: menu.description,
						updateFrequency: menu.updateFrequency
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
	
	.songMenu{
		margin-bottom: 40rpx;
	}
	
	.grid_item{
		align-items: flex-start;
		padding-top: 10rpx;
		padding-bottom: 10rpx;
	}
	
	.font_ellipsis{
		overflow:hidden;
		white-space:nowrap; 
		text-overflow:ellipsis;
	}
	
	.title{
		font-size: 14px;
		width: 400rpx;
	}
</style>
