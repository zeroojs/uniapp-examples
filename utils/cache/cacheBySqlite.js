import md5 from '../md5';
import { uniApiPromisify } from '../promise';
import { insertImage, findImage, selectImages } from '../db/images';

export async function downloadImage(src = '') {
	const params = { url: src };
	// 缓存名称
	const fileUuid = getUuidByFilename(src);
	try {
		// 查询图片
		const image = await findImage(src);
		// console.log('查询图片 image', image);
		if (image) {
			return image;
		}
		// 下载图片
		console.log('图片下载中', src);
		const downloadResult = await uniApiPromisify(uni.downloadFile, params);
		if (!downloadResult || downloadResult.statusCode !== 200) return;
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
		// console.log('fileInfoResult', fileInfoResult);

		// 信息入库 -> fileInfoResult: { "createTime":1668877025000,"size":185687 }
		// 包含信息
		// filename | savedFilePath | src| size | sizeText | createTime
		// 文件名称 | 保存路径 | 网络地址 | 文件大小（字节） | 文件大小格式化之后的显示文字（例如：3.1 M）| 创建时间
		const extname = src.substring(src.lastIndexOf('.') + 1);
		const insertImageParams = {
			filename: `${fileUuid}.${extname}`,
			savedFilePath: saveResult.savedFilePath,
			src,
			size: fileInfoResult.size,
			sizeText: formatFileSize(fileInfoResult.size),
			createTime: fileInfoResult.createTime
		};
		const newImage = await insertImage(insertImageParams);
		console.log('信息入库成功', newImage);
		return insertImageParams;
	} catch (e) {
		console.log('保存图片错误', e);
		return src;
	}
}

// 根据文件名称生成文件uuid
function getUuidByFilename(src = '') {
	const filename = src.substring(src.lastIndexOf('/'));
	return md5.hex_md5_16(filename);
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
 * 单一转换存储
 * @param {Array<string> | string} srcs
 * @return {Array<string> | string}
 */
export async function rebuildImages(srcs = []) {
	if (typeof srcs === 'string') {
		const currentImg = await downloadImage(srcs);
		return currentImg.savedFilePath || srcs;
	}
	const images = await Promise.all(srcs.map(item => {
		if (!item) return item;
		return downloadImage(item);
	}));
	return images.map(item => item.savedFilePath || item.src);
}

/**
 * 重新构建包含图片的数据
 * @param {object | Array<object>} data 原始数据
 * @param {string | Array<string>} keys 需要重新构建的字段
 */
export async function rebuildImageData(data = [], key = '') {
	// 对象单一存储
	if (!Array.isArray(data) && typeof data === 'object') {
		const currentUrl = data[key];
		const currentImg = await downloadImage(currentUrl);
		data[key] = currentImg.savedFilePath || currentUrl;
		return data;
	}
	// 批量存储
	const images = await Promise.all(data.map(item => {
		if (!item[key]) return item;
		return downloadImage(item[key]);
	}));
	return data.map(item => {
		const currentUrl = item[key];
		const currentImg = images.find(img => img.src === currentUrl);
		if (currentImg) {
			item[key] = currentImg.savedFilePath || currentUrl;
		}
		return item;
	});
}
// 获取缓存图片占用空间
export async function getCacheImagesSize() {
	try {
		// 查询全部图片
		const allImages = await selectImages();
		console.log('allImages', allImages);
		const size = allImages.reduce((lastVal, currentVal) => {
			return parseInt(currentVal.size) + lastVal;
		}, 0);
		// console.log('size', size, formatFileSize(size));
		return { size, sizeText: formatFileSize(size) };
		// 计算全部图片的大小
	} catch (e) {
		console.log('计算失败', e);
	}
}