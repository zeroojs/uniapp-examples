export const checkUpdate = () => {
	// #ifdef APP-PLUS
	plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
		const baseURL = 'http://192.168.124.8:10086';
		console.log('widgetInfo', widgetInfo);
		uni.request({
			url: `${baseURL}/check-update`,
			data: {
				version: widgetInfo.version,
				name: widgetInfo.name
			},
			success(res) {
				const { data } = res;
				if (!data.haveUpdate) return;
				const PACKAGE_INFO_KEY = '__package_info__';
				const packageInfo = {
					type: 'wgt',
					...data,
				}
				uni.setStorageSync(PACKAGE_INFO_KEY, packageInfo);
				uni.navigateTo({
					url: `/pages/upgrade-center-app/upgrade-center-app?local_storage_key=${PACKAGE_INFO_KEY}`,
					fail: (err) => {
						console.error('更新弹框跳转失败', err)
						uni.removeStorageSync(PACKAGE_INFO_KEY)
					}
				});
			},
			fail(err) {
				console.error('下载失败', err);
			}
		});
	});
	// #endif
};

// 下载安装wgt 更包
export const downloadUpgradePckage = (downloadUrl = '') => {
	uni.downloadFile({
		url: downloadUrl,
		success(res) {
			console.log('开始安装', res);
			if (res.statusCode !== 200) return;
			plus.runtime.install(res.tempFilePath, {
				force: false
			}, function() {
				console.log('install success...');
				plus.runtime.restart();
			}, function(e) {
				console.error('install fail...', e);
			});
		},
		fail(err) {
			console.log('下载失败', err);
		}
	});
}
