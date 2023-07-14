<template>
	<view class="listbox">
		<u-row>
			<u-col span="11"><view style="padding:10px">音频列表:</view></u-col>
			<u-col span="1"><u-icon name="trash" size="22" @click="clear"></u-icon></u-col>
		</u-row>
		<view v-for="(i, k) in playList" :key="k" class="list font_ellipsis" :class="[i.id === playList[playIndex].id && 'list_item_bgColor']" @click="play(k)">
			{{ i.name }} - {{ i.ar[0].name }}
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			play(key) {
				this.$u.vuex('vuex_playIndex', key);
			},
			clear(){
				this.$u.toast('清空');
				setTimeout(() => {
					this.$u.vuex('vuex_addPlayList', []);
					this.$u.vuex('vuex_playIndex', 0);
					this.$u.vuex('vuex_lyric', []);
					this.$u.vuex('vuex_currentTime', 0);
					this.innerAudioContext.pause();
				}, 1500);
			},
		},
		computed: {
			playListLen() {
				return this.vuex_addPlayList.length;
			},
			playList() {
				return this.vuex_addPlayList;
			},
			playIndex() {
				return this.vuex_playIndex;
			}
		},
	}
</script>

<style lang="scss" scoped>
	.listbox {
		margin: 20px 10px 10px;
		border: 1px solid rgba(0, 0, 0, 0.2);
		.list {
			line-height: 40px;
			border-top: 1px solid #ccc;
			padding: 0 10px;
	
			button {
				float: right;
				margin-top: 5px;
				margin-left: 5px;
			}
		}
	}
	
	.font_ellipsis{
		overflow:hidden;
		white-space:nowrap; 
		text-overflow:ellipsis;
	}
	
	.list_item_bgColor{
		background-color: #ebebeb;
	}
</style>
