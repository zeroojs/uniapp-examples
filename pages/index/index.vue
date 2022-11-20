<template>
	<view class="content">
		<view class="content-item">
			<button @tap="downloadImage()">下载图片</button>
			<view class="result-container">
				<view
					v-for="(item, key) in downloadResult"
					:key="key"
					class="result-item"
				>
					<view>{{ key }}</view>
					<view>{{ item }}</view>
				</view>
			</view>
		</view>
		<view class="content-item">
			<button @tap="getCacheImagesSize()">获取全部缓存文件大小</button>
			<view class="result-container">
				<view
					v-for="(item, key) in sizeResult"
					:key="key"
					class="result-item"
				>
					<view>{{ key }}</view>
					<view>{{ item }}</view>
				</view>
			</view>
		</view>
		<view class="content-item">
			<view
				v-for="src in exampleUrls"
				:key="src"
				class="image-container"
			>
				<CacheImage
					:src="src"
					mode="widthFix"
					class="full-image"
				/>
				<text>{{ src }}</text>
			</view>
		</view>
		<image v-if="downloadResult" :src="downloadResult.savedFilePath"></image>
	</view>
</template>

<script>
	import { CacheMixin } from './mixin';
	import CacheImage from '@/components/CacheImage';
	
	export default {
		name: 'Cache',
		mixins: [CacheMixin],
		components: {
			CacheImage
		},
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style>
	.content {
		padding: 48upx;
		box-sizing: border-box;
	}
	.result-item {
		margin-top: 48upx;
	}
	.content-item {
		margin-bottom: 48upx;
	}
	.full-image {
		width: 100%;
		display: block;
		border-radius: 20upx;
		box-shadow: 0 0 40upx rgba(0, 0, 0, .3);
	}
	.image-container ~ .image-container {
		margin-top: 40upx;
	}
</style>
