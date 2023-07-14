<template>
	<view>
		
	</view>
</template>

<script>
	import { checkSongUrl, getSong, getLyric, getSongComment } from '@/http/http.api.js';
	export default {
		name:"my-audio",
		data() {
			return {
				playIndex: 0,
				offset: 1,
				limit: 10,
			};
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
			}
		},
		watch: {
			playListLen: {
				async handler(newV, oldV){
					if(newV !== 0){
						console.log(newV);
						let res = await checkSongUrl({ params: { id: this.playList[this.playIndex].id } });
						if(!res.success){
							this.playIndex = this.vplayIndex;
							this.playIndex += 1;
							this.$u.vuex('vuex_playIndex', this.playIndex);
						}else{
							let res2 = await getSong({ params: { id: this.playList[this.playIndex].id } });
							let res3 = await getLyric({ params: { id: this.playList[this.playIndex].id } });
							let res4 = await getSongComment({ params: { id: this.playList[this.playIndex].id, limit: this.limit, offset: (this.offset - 1) * this.limit } });
							
							this.innerAudioContext.src = res2.data[0].url;
							this.$u.vuex('vuex_lyric', res3.lrc.lyric.split('\n'));
							console.log(res4.comments);
							this.$u.vuex('vuex_comments', res4.comments);
							this.$u.vuex('vuex_hotComments', res4.hotComments);
						}
					}
				},
				deep: true,
				// immediate: true
			},
			vplayIndex: {
				async handler(newV, oldV){
					if(this.playListLen !== 0){
						this.innerAudioContext.pause();
						let res = await checkSongUrl({ params: { id: this.playList[newV].id, br: 320000 } });
						if(!res.success){
							this.playIndex = this.vplayIndex;
							this.playIndex += 1;
							this.$u.vuex('vuex_playIndex', this.playIndex);
						}else{
							let res2 = await getSong({ params: { id: this.playList[newV].id, br: 320000 } });
							let res3 = await getLyric({ params: { id: this.playList[newV].id } });
							let res4 = await getSongComment({ params: { id: this.playList[newV].id, limit: this.limit, offset: (this.offset - 1) * this.limit } });
							this.innerAudioContext.src = res2.data[0].url;
							this.$u.vuex('vuex_lyric', res3.lrc.lyric.split('\n'));
							this.$u.vuex('vuex_comments', res4.comments);
							this.$u.vuex('vuex_hotComments', res4.hotComments);
							this.innerAudioContext.play();
						}
					}
				}
			}
		},
		created() {
			console.log('innerAudio');
			this.innerAudioContext.onPlay(() => {
			  console.log('开始播放');
			});
			this.innerAudioContext.onTimeUpdate(() => {
				this.$u.vuex('vuex_currentTime', this.innerAudioContext.currentTime);
			});
			this.innerAudioContext.onEnded(async () => {
				if(this.vuex_addPlayList.length !== 0 && this.playIndex < this.vuex_addPlayList.length){
					this.playIndex = this.vplayIndex;
					this.playIndex += 1;
					this.$u.vuex('vuex_playIndex', this.playIndex);
				}else{
					this.playIndex = 0;
					this.$u.vuex('vuex_playIndex', this.playIndex);
				}
			})
			this.innerAudioContext.onError((res) => {
			  console.log(res.errMsg);
			  console.log(res.errCode);
			});
		}
	}
</script>

<style lang="scss">

</style>
