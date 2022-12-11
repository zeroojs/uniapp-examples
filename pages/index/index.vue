<template>
	<view class='app-container'>
		<FixedHeader />
		<view>1</view>
		<view>1</view>
		<view>1</view>
		<view>1</view>
		<view>1</view>
		<view>1</view>
		<view>1</view>
		<view>1</view>
		<view>1</view>
		<view>1</view>
		<view class='menu'>
			<view class='menu-item'>
				<u-button
					type='primary'
					@tap='checkUpdate()'
				>
					检查更新
				</u-button>
			</view>
			<view class='menu-item'>
				<u-button
					type='primary'
					@tap='upgradeApp()'
				>
					更新 APP
				</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import FixedHeader from '@/components/FixedHeader'
	import { checkUpdate } from '@/utils/check-update';
	export default {
		name: 'homePage',
		components: {
			FixedHeader,
		},
		data() {
			return {
				
			}
		},
		methods: {
			checkUpdate,
			upgradeApp() {
				const PACKAGE_INFO_KEY = '__package_info__';
				const packageInfo = {
					type: 'wgt',
					'latestVersion': '1.0.1',
					'name': 'common-examples',
					'wgtUrl': '/wgt/common-examples_1.0.1.wgt'
				}
				uni.setStorageSync(PACKAGE_INFO_KEY, packageInfo);
				uni.navigateTo({
					url: `/pages/upgrade-center-app/upgrade-center-app?local_storage_key=${PACKAGE_INFO_KEY}`,
					fail: (err) => {
						console.error('更新弹框跳转失败', err)
						uni.removeStorageSync(PACKAGE_INFO_KEY)
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
.app-container {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100vh;
	padding-bottom: 83px;
	box-sizing: border-box;
	padding: 0 40upx;
}
.menu-item {
	margin-bottom: 20upx;
}
</style>
