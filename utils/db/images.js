import { DB } from './sqllite';

export const config = {
	TABLE_NAME: 'images',
	cols: ['filename', 'savedFilePath', 'src', 'size', 'sizeText', 'createTime']
};

// 创建图片表
export async function createImagesTabe() {
	const isOpen = DB.isOpen();
	if (!isOpen) {
		try {
			await DB.openSqlite();
		} catch (e) {
			uni.showToast({
				title: '打开数据库失败'
			});
			return;
		}
	}
	let colsSql = '';
	config.cols.forEach(col => {
		colsSql += `"${col}" text,`;
	});
	colsSql = colsSql.replace(/,$/, '');
	const sql = `"id" INTEGER PRIMARY KEY AUTOINCREMENT,${colsSql}`;
	// 创建表 DB.createTable(表名, 表的列)
	console.log(`开始创建 [${config.TABLE_NAME}] 表`);
	return DB.createTable(config.TABLE_NAME, sql);
}

/**
 * 存储图片
 * @param {Object} params 
 */
export async function insertImage(params = {}) {
	const isOpen = DB.isOpen();
	if (!isOpen) {
		try {
			await DB.openSqlite();
		} catch (e) {
			uni.showToast({
				title: '打开数据库失败'
			});
			return;
		}
	}
	const image = await findImage(params.src);
	console.log('image', image);
	if (image) {
		return image;
	}
	// 编写 sql 语句
	let sql = '';
	let condition = '';
	Object.keys(params).forEach(k => {
		condition += `'${k}',`;
		sql += `'${params[k]}',`;
	});
	sql = sql.replace(/,$/, '');
	condition = condition.replace(/,$/, '');

	// 插入数据 DB.insertTableData(表名, 对应表头列的数据)
	try {
		const insertTableResult = await DB.insertTableData(config.TABLE_NAME, sql, condition);
		console.log('成功存储图片');
		return insertTableResult;
	} catch (err) {
		console.log('存储图片失败', err);
		return { code: -1, err };
	}
}

/**
 * 查询全部图片资源
 * @param {string} src 筛选条件 -> 图片原始 src
 */
export async function selectImages(src = '') {
	const isOpen = DB.isOpen();
	if (!isOpen) {
		try {
			await DB.openSqlite();
		} catch (e) {
			uni.showToast({
				title: '打开数据库失败'
			});
			return;
		}
	}
	let result = null;
	if (!src) {
		result = await DB.selectTableData(config.TABLE_NAME);
		return result || [];
	}
	result = await DB.selectTableData(config.TABLE_NAME, 'src', src);
	console.log('result', result);
	return result || [];
}

/**
 * 查找图片资源
 * @param {string} src 图片原始 src
 */
export async function findImage(src = '') {
	const isOpen = DB.isOpen();
	if (!isOpen) {
		try {
			await DB.openSqlite();
		} catch (e) {
			uni.showToast({
				title: '打开数据库失败'
			});
			return;
		}
	}
	const result = await DB.selectTableData(config.TABLE_NAME, 'src', src);
	return (result || [])[0] || null;
}

/**
 * 删除全部图片
 */
export async function deleteAllImages() {
	return DB.deleteTableData(config.TABLE_NAME);
}

// 删除表
export function dropImagesTable() {
	return DB.dropTable(config.TABLE_NAME);
}
