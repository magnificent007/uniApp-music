<template>
	<view>
		<u-cell 
			v-for="(item, index) in indexList"
			:key="index"
			:border="false" 
			@click="hotWord(item.searchWord)">
			<text slot='icon' :class="[((index === 0) || (index === 1) || (index === 2)) && 'iconNum' ]">{{index+1}}</text>
			<u-image slot="icon" width="18" height="18" mode="" :src="item.iconUrl" v-if="item.iconUrl"></u-image>
			<text slot='title'>{{item.searchWord}}</text>
			<text slot='right-icon' class="rightIcon">{{item.score}}</text>
		</u-cell>
	</view>
</template>

<script>
	export default {
		name:"hot-search",
		props: [ 'indexList' ],
		data() {
			return {
				
			};
		},
		methods:{
			hotWord(keyword){
				// console.log('hotword');
				this.$emit('item-click', keyword);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.iconNum{
		color: #ff0000;
	}
	
	.rightIcon{
		color: #BFBFBF;
	}
</style>
