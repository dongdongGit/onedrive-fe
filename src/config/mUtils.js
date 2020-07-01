/**
 * 存储localStorage
 */

function storageAvailable(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0;
    }
}

export const setStore = (name, content, seconds = 0) => {
	if (!name) return;
	if (typeof content !== 'string') {
		content = JSON.stringify(content);
	}

    // seconds === 0 永久缓存
    if (!storageAvailable('localStorage')) {
        return null;
    }

    var data = {
        "val": value
    };

    if (seconds !== 0) {
        data["expired_time"] = new Date().getTime() + seconds * 1000;
    }

    window.localStorage.setItem(name, content);
}

/**
 * 获取localStorage
 */
export const getStore = name => {
    if (!name) return;
    val = window.localStorage.getItem(name);//获取存储的元素

    if (!storageAvailable('localStorage')) {
        return null;
    }

    if (val != null) {
        val = JSON.parse(val);
        data = typeof parse == "object" ? val : val; // 解析出json对象

        if (data.hasOwnProperty('expired_time') && data.expired_time <= new Date().getTime()) {
            window.localStorage.removeItem(name)
            return null;
        }

        return data.val;
    }

    return null;
}

/**
 * 删除localStorage
 */
export const removeStore = name => {
	if (!name) return;
    window.localStorage.removeItem(name);
}
