var AppStore = (function () {
  var DB_NAME = "ashare-us-screener";
  var DB_VERSION = 1;
  var STORE = "analyses";
  var dbPromise = null;

  function openDb() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise(function (resolve, reject) {
      if (!window.indexedDB) {
        reject(new Error("当前浏览器不支持 IndexedDB"));
        return;
      }
      var req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = function () {
        var db = req.result;
        if (!db.objectStoreNames.contains(STORE)) {
          var os = db.createObjectStore(STORE, { keyPath: "id" });
          os.createIndex("usDate", "usDate", { unique: false });
          os.createIndex("primaryTicker", "primaryTicker", { unique: false });
        }
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
    });
    return dbPromise;
  }

  function withStore(mode, fn) {
    return openDb().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE, mode);
        var store = tx.objectStore(STORE);
        var result = fn(store);
        tx.oncomplete = function () { resolve(result); };
        tx.onerror = function () { reject(tx.error); };
      });
    });
  }

  function sortNotes(rows) {
    rows.sort(function (a, b) {
      return String(b.createdAt).localeCompare(String(a.createdAt));
    });
    return rows;
  }

  function getAll() {
    return openDb().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE, "readonly");
        var store = tx.objectStore(STORE);
        if (store.getAll) {
          var req = store.getAll();
          req.onsuccess = function () { resolve(sortNotes(req.result || [])); };
          req.onerror = function () { reject(req.error); };
          return;
        }
        var rows = [];
        var cursorReq = store.openCursor();
        cursorReq.onsuccess = function (e) {
          var cursor = e.target.result;
          if (cursor) {
            rows.push(cursor.value);
            cursor.continue();
          } else {
            resolve(sortNotes(rows));
          }
        };
        cursorReq.onerror = function () { reject(cursorReq.error); };
      });
    });
  }

  function save(note) {
    return withStore("readwrite", function (store) {
      store.put(note);
      return note;
    }).then(function () { return note; });
  }

  function remove(id) {
    return withStore("readwrite", function (store) {
      store.delete(id);
    });
  }

  function uid() {
    return "n_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);
  }

  return {
    DB_NAME: DB_NAME,
    STORE: STORE,
    getAll: getAll,
    save: save,
    remove: remove,
    uid: uid
  };
})();
