<template>
	<view class="fixed-header">
		<u-tabs
			:list="tabList"
			line-width="20"
			line-color="#54D375"
			:scrollable="false"
			:current="current"
			:active-style="xiaomiActive"
			:inactive-style="xiaomiInactive"
			item-style="padding-left: 15px; padding-right: 15px; height: 34px;"
			@change="tabChange"
		/>
	</view>
</template>

<script>
export default {
	name: "HomeFixedHeader",
	props: {},
	data() {
		return {
			current: 0,
			tabList: [{ name: '推荐' }, { name: '最新' }, { name: '关注' }, { name: '附近' }, { name: '活动' }],
			xiaomiActive: {
				color: '#303133',
				fontWeight: 'bold',
				transform: 'scale(1)'
			},
			xiaomiInactive: {
				color: '#606266',
				transform: 'scale(1)'
			}
		}
	},
	methods: {
		tabChange() {}
	}
}
</script>

<style>
</style>