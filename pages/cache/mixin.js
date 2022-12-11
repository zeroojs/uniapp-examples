import {
	rebuildImages,
	getCacheImagesSize
} from '@/utils/cache/cacheByStorage.js';

const exampleUrls = [
	// 'https://images.unsplash.com/photo-1668863699009-1e3b4118675d',
	// 'https://images.unsplash.com/photo-1668863699009-1e3b4118675d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
	'https://upload-images.jianshu.io/upload_images/15158217-8a278405ccb2209f.jpg',
	'https://picd.zhimg.com/v2-03157390d2af094c735a8dd42a8ca5c8_r.jpg',
	'https://pica.zhimg.com/v2-6fde11d59d2ca90b54512d730b2ec335_r.jpg',
	'https://pic1.zhimg.com/v2-d908471c6634538304d806d72b83d5fb_r.jpg',
	'https://pic1.zhimg.com/v2-65c52013cab67758dfe03d88937a01f4_r.jpg',
	'https://picx.zhimg.com/v2-c5a63be4ee39bf3749e2077a5cc59c41_r.jpg',
	'https://picx.zhimg.com/v2-2bc9cf91af40351d99dc78e5fc6c0d42_r.jpg',
	'https://pica.zhimg.com/v2-9126d6675f6627d19dbe5a0232215078_r.jpg'
];
export const CacheMixin = {
	data() {
		return {
			sizeResult: null,
			exampleUrl: 'https://upload-images.jianshu.io/upload_images/15158217-8a278405ccb2209f.jpg', // 'http://oss.zeroojs.com/images/1623977740_412523.jpg',
			downloadResult: null, // 下载后的返回结果
			exampleUrls: [],
			exampleUrlsCpx: exampleUrls.map(item => ({ src: item })),
		}
	},
	methods: {
		// 下载图片
		downloadImage() {
			// downloadImage(this.exampleUrl)
			// 	.then(res => {
			// 		this.downloadResult = res;
			// 	})
			this.exampleUrls = rebuildImages(exampleUrls);
			console.log('this.exampleUrls', this.exampleUrls[0]);
		},
		// 获取缓存图片占用空间
		getCacheImagesSize() {
			this.sizeResult = getCacheImagesSize();
		}
	}
};
