<template>
	<view>
		<swiper-images></swiper-images>
		<song-menu :menuList="menuList"></song-menu>
		<scroll-list-top :topList="topList"></scroll-list-top>
		<my-audio></my-audio>
	</view>
</template>

<script>
	import Vue from 'vue';
	import { menusDetails, getTop } from '@/http/http.api.js';
	export default {
		data() {
			return {
				menuList: [],
				topList: [],
				hotDjList: []
			}
		},
		methods: {
			
		},
		async onLoad() {
			if(this.vuex_menuList.length === 0){
				let res = await menusDetails();
				this.menuList = res.list.splice(0, 4);
				this.$u.vuex('vuex_menuList', this.menuList)
			}else{
				this.menuList = this.vuex_menuList;
			};
			if(this.vuex_topList.length === 0){
				let res = await getTop({ params: { limit: 10 } });
				this.topList = res.playlists;
				this.$u.vuex('vuex_topList', this.topList);
			}else{
				this.topList = this.vuex_topList;
			};
		}
	}
</script>

<style lang="scss" scoped>
	
</style>
