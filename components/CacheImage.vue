<template>
	<image
		v-if="tag === 'image'"
		v-bind="$attrs"
		:src="localSrc"
	></image>
	<cover-image
		v-else
		v-bind="$attrs"
		:src="localSrc"
	></cover-image>
</template>

<script>
	import { rebuildImages } from '@/utils/cache';
	export default {
		name: 'CacheImage',
		props: {
			tag: {
				type: String,
				default: 'image', // image | cover-image
			},
			src: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				localSrc: '_doc/uniapp_save/16689398925877.jpg', // 本地图片路径
			}
		},
		watch: {
			src: {
				handler(v) {
					this.getLocalSrc(v);
				},
				immediate: true,
			}
		},
		methods: {
			getLocalSrc(src = '') {
				if (!src) return;
				try {
					this.localSrc = rebuildImages(src);
					console.log('this.localSrc', this.localSrc);
				} catch (e) {
					console.log('转储失败', e);
				}
			}
		}
	}
</script>
