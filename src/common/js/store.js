import storage from 'good-storage'

const SEARCH_KEY = '__search__'

/**
 * 插入新元素到 arr[0] 并删除重复值，可控制数组最大长度
 * @param  {[type]} arr   要插入到哪个数组
 * @param  {[type]} val   要插入的值
 * @param  {fn} compareFn 比较函数
 * @param  {num} maxLen   数组最大长度
 * @return {[type]}           [description]
 */


// 向数组插入数据
function insertArr(arr, val, compareFn, maxLen = 15) {
  let index = arr.findIndex(compareFn)       // findIndex() 方法返回传入一个测试条件（函数）符合条件的数组第一个元素位置。
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)       // 如果设置为 0，则不会删除项目, splice() 方法可删除从 index 处开始的零个或多个元素，并且用参数列表中声明的一个或多个值来替换那些被删除的元素。
  }
  arr.unshift(val)        // unshift() 方法可向数组的开头添加一个或更多元素，并返回新的长度。
  if (maxLen && arr.length > maxLen) {
    arr.pop()            // pop() 方法用于删除并返回数组的最后一个元素。
  }
}

// 向数组中删除数据
function delArr(arr, compareFn) {
  let index = arr.findIndex(compareFn)
  if (index > -1) {         // findIndex()方法中如果没有符合条件的元素返回 -1
    arr.splice(index, 1)
  }
}


export function getStorage() {            // 获取localStorage的值
  return storage.get(SEARCH_KEY, [])
}

export function localSave(query) {      // 增加
  let searches = storage.get(SEARCH_KEY, [])         // 当前localStorage数组
  insertArr(searches, query, (item) => {
    return item === query
  }, 15)
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function localDel(query) {        // 删除
  let searches = storage.get(SEARCH_KEY, [])         // 当前localStorage数组
  delArr(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function localClear(query) {       // 清空
  storage.remove(SEARCH_KEY)
  return []
}

const PLAY_KEY = '__play__'     // 最近播放的localStorage

export function getPlayStorage() {        // 获取
  return storage.get(SEARCH_KEY, [])
}

export function savePlay(song) {        // 增加
  let songs = storage.get(SEARCH_KEY, [])
  insertArr(songs, song, (item) => {
    return item.id === song.id
  }, 50)
  storage.set(PLAY_KEY, songs)
  return songs
}

// 最近播放 localstorage
const FAVORITE_KEY = '__favorite__'

// 获取
export function getFavorite() {
  return storage.get(FAVORITE_KEY, [])
}

// 增加
export function saveFavorite(song) {
  // 当前 localstorage 数组
  let songs = storage.get(FAVORITE_KEY, [])

  insertArr(songs, song, (item) => {
    return item.id === song.id
  }, 50)

  storage.set(FAVORITE_KEY, songs)
  return songs
}

// 删除
export function delFavorite(song) {
  // 当前 localstorage 数组
  let songs = storage.get(FAVORITE_KEY, [])

  delArr(songs, (item) => {
    return item.id === song.id
  })

  storage.set(FAVORITE_KEY, songs)
  return songs
}
