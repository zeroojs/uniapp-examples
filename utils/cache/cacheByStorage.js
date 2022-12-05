import Bigjs from 'big.js';
import md5 from '../md5';
import { uniApiPromisify } from '../promise';

export async function downloadImage(src = '') {
	const params = { url: src };
	// 缓存名称
	const fileUuid = getUuidByFilename(src);
	console.log('fileUuid', fileUuid);
	try {
		// 查询图片
		const image = await uni.getStorageSync(fileUuid);
		console.log('查询图片 image', image);
		if (image) {
			return image;
		}
		// 下载图片
		console.log('图片下载中', src);
		const downloadResult = await uniApiPromisify(uni.downloadFile, params);
		if (!downloadResult || downloadResult.statusCode !== 200) {
			throw Error('下载失败'); // 下载失败
		}
		const { statusCode, tempFilePath, errMsg } = downloadResult;
		if (statusCode !== 200) throw Error(errMsg); // 下载失败
		console.log('图片下载完成', downloadResult);

		// 保存图片
		const saveResult = await uniApiPromisify(uni.saveFile, { tempFilePath });
		if (!saveResult || saveResult.errMsg !== 'saveFile:ok') throw Error(saveResult.errMsg); // 保存失败
		// console.log('saveResult', saveResult.savedFilePath);

		// 获取文件信息
		const fileInfoResult = await uniApiPromisify(uni.getSavedFileInfo, { filePath: saveResult.savedFilePath });
		if (!fileInfoResult || fileInfoResult.errMsg !== 'getSavedFileInfo:ok') throw Error(fileInfoResult.errMsg);
		console.log('fileInfoResult', fileInfoResult);
		uni.setStorageSync(fileUuid, saveResult.savedFilePath);
		// 存储文件大小信息
		setCacheImagesSize(fileInfoResult.size);
		console.log('信息入库成功', newImage);
		return saveResult.savedFilePath;
	} catch (e) {
		console.log('保存图片错误', e);
		return src;
	}
}

// 根据文件名称生成文件uuid
function getUuidByFilename(src = '') {
	return md5.hex_md5_16(src);
}

// 格式化文件大小
function formatFileSize(size = 0) {
	const byte = 1024;
	if (size < byte) {
		return size + 'B';
	}
	if (size / Math.pow(byte, 2) < 1) {
		return Math.floor(size / byte * 100) / 100 + 'KB';
	}
	if (size / Math.pow(byte, 3) < 1) {
		return Math.floor(size / Math.pow(byte, 2) * 100) / 100 + 'M';
	}
	if (size / Math.pow(byte, 4) < 1) {
		return Math.floor(size / Math.pow(byte, 3) * 100) / 100 + 'G';
	}
	return size;
}

/**
 * 获取缓存图片地址 -> 没有获取到 -> 缓存
 * @param {string} src
 * @return {string} 本地图片地址
 */
export function getCacheImage(src = '') {
	const cacheImageKey = getUuidByFilename(src);
	const savedFilePath = uni.getStorageSync(cacheImageKey);
	if (!savedFilePath) {
		downloadImage(src);
	}
	return savedFilePath || src;
}

/**
 * 单一转换存储
 * @param {Array<string> | string} srcs
 * @return {Array<string> | string}
 */
export function rebuildImages(srcs = []) {
	if (typeof srcs === 'string') {
		return getCacheImage(srcs);
	}
	return srcs.map(item => getCacheImage(item));
}

/**
 * 重新构建包含图片的数据
 * @param {object | Array<object>} data 原始数据
 * @param {string | Array<string>} keys 需要重新构建的字段
 */
export function rebuildImageData(data = [], key = '') {
	// 对象单一存储
	if (!Array.isArray(data) && typeof data === 'object') {
		return getCacheImage(data[k]);
	}
	// 批量存储
	return data.map(item => {
		if (!item[key]) return item;
		return getCacheImage(item[key]);
	});
}
// 获取缓存图片占用空间
export function getCacheImagesSize() {
	const size = uni.getStorageSync('CACHE_IMAGE_SIZE');
	const sizeText = uni.getStorageSync('CACHE_IMAGE_SIZE_TEXT');
	return {
		size: size || 0,
		sizeText: sizeText || '0 B',
	}
}

// 存储图片缓存大小
export function setCacheImagesSize(size = 0) {
	let savedSize = uni.getStorageSync('CACHE_IMAGE_SIZE');
	if (!savedSize) {
		savedSize = 0;
	}
	savedSize = (new Bigjs(savedSize)).plus(size);
	// 数值存储
	uni.setStorageSync('CACHE_IMAGE_SIZE', savedSize);
	// 带单位的存储 -> 
	uni.setStorageSync('CACHE_IMAGE_SIZE_TEXT', formatFileSize(savedSize));
}
