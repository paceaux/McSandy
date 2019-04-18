/*! FileSaver.js
 *  A saveAs() FileSaver implementation.
 *  2014-01-24
 *
 *  By Eli Grey, http://eligrey.com
 *  License: X11/MIT
 *    See LICENSE.md
 */
/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */
var saveAs = saveAs
  || (navigator.msSaveOrOpenBlob && navigator.msSaveOrOpenBlob.bind(navigator))
  || (function (view) {
      if (/MSIE [1-9]\./.test(navigator.userAgent)) {
          return;
      }
      let
          doc = view.document;
      const get_URL = function () {
          return view.URL || view.webkitURL || view;
      };
      const URL = view.URL || view.webkitURL || view;
      let save_link = doc.createElementNS('http://www.w3.org/1999/xhtml', 'a');
      const can_use_save_link = !view.externalHost && 'download' in save_link;
      const click = function (node) {
          const event = doc.createEvent('MouseEvents');
          event.initMouseEvent(
              'click', true, false, view, 0, 0, 0, 0, 0,
              false, false, false, false, 0, null,
          );
          node.dispatchEvent(event);
      };
      const webkit_req_fs = view.webkitRequestFileSystem;
      const req_fs = view.requestFileSystem || webkit_req_fs || view.mozRequestFileSystem;
      const throw_outside = function (ex) {
          (view.setImmediate || view.setTimeout)(() => {
              throw ex;
          }, 0);
      };
      const force_saveable_type = 'application/octet-stream';
      let fs_min_size = 0;
      const deletion_queue = [];
      const process_deletion_queue = function () {
          let i = deletion_queue.length;
          while (i--) {
              const file = deletion_queue[i];
              if (typeof file === 'string') { // file is an object URL
                  URL.revokeObjectURL(file);
              } else { // file is a File
                  file.remove();
              }
          }
          deletion_queue.length = 0; // clear queue
      };
      const dispatch = function (filesaver, event_types, event) {
          event_types = [].concat(event_types);
          let i = event_types.length;
          while (i--) {
              const listener = filesaver[`on${event_types[i]}`];
              if (typeof listener === 'function') {
                  try {
                      listener.call(filesaver, event || filesaver);
                  } catch (ex) {
                      throw_outside(ex);
                  }
              }
          }
      };
      const FileSaver = function (blob, name) {
          const
              filesaver = this;
          const { type } = blob;
          let blob_changed = false;
          let object_url;
          let target_view;
          const get_object_url = function () {
              const object_url = get_URL().createObjectURL(blob);
              deletion_queue.push(object_url);
              return object_url;
          };
          const dispatch_all = function () {
              dispatch(filesaver, 'writestart progress write writeend'.split(' '));
          };
          const fs_error = function () {
              if (blob_changed || !object_url) {
                  object_url = get_object_url(blob);
              }
              if (target_view) {
                  target_view.location.href = object_url;
              } else {
                  window.open(object_url, '_blank');
              }
              filesaver.readyState = filesaver.DONE;
              dispatch_all();
          };
          const abortable = function (func) {
              return function () {
                  if (filesaver.readyState !== filesaver.DONE) {
                      return func.apply(this, arguments);
                  }
              };
          };
          const create_if_not_found = { create: true, exclusive: false };
          let slice;
          filesaver.readyState = filesaver.INIT;
          if (!name) {
              name = 'download';
          }
          if (can_use_save_link) {
              object_url = get_object_url(blob);
              doc = view.document;
              save_link = doc.createElementNS('http://www.w3.org/1999/xhtml', 'a');
              save_link.href = object_url;
              save_link.download = name;
              const event = doc.createEvent('MouseEvents');
              event.initMouseEvent(
                  'click', true, false, view, 0, 0, 0, 0, 0,
                  false, false, false, false, 0, null,
              );
              save_link.dispatchEvent(event);
              filesaver.readyState = filesaver.DONE;
              dispatch_all();
              return;
          }
          if (view.chrome && type && type !== force_saveable_type) {
              slice = blob.slice || blob.webkitSlice;
              blob = slice.call(blob, 0, blob.size, force_saveable_type);
              blob_changed = true;
          }

          if (webkit_req_fs && name !== 'download') {
              name += '.download';
          }
          if (type === force_saveable_type || webkit_req_fs) {
              target_view = view;
          }
          if (!req_fs) {
              fs_error();
              return;
          }
          fs_min_size += blob.size;
          req_fs(view.TEMPORARY, fs_min_size, abortable((fs) => {
              fs.root.getDirectory('saved', create_if_not_found, abortable((dir) => {
                  const save = function () {
                      dir.getFile(name, create_if_not_found, abortable((file) => {
                          file.createWriter(abortable((writer) => {
                              writer.onwriteend = function (event) {
                                  target_view.location.href = file.toURL();
                                  deletion_queue.push(file);
                                  filesaver.readyState = filesaver.DONE;
                                  dispatch(filesaver, 'writeend', event);
                              };
                              writer.onerror = function () {
                                  const { error } = writer;
                                  if (error.code !== error.ABORT_ERR) {
                                      fs_error();
                                  }
                              };
                              'writestart progress write abort'.split(' ').forEach((event) => {
                                  writer[`on${event}`] = filesaver[`on${event}`];
                              });
                              writer.write(blob);
                              filesaver.abort = function () {
                                  writer.abort();
                                  filesaver.readyState = filesaver.DONE;
                              };
                              filesaver.readyState = filesaver.WRITING;
                          }), fs_error);
                      }), fs_error);
                  };
                  dir.getFile(name, { create: false }, abortable((file) => {
                      file.remove();
                      save();
                  }), abortable((ex) => {
                      if (ex.code === ex.NOT_FOUND_ERR) {
                          save();
                      } else {
                          fs_error();
                      }
                  }));
              }), fs_error);
          }), fs_error);
      };
      const FS_proto = FileSaver.prototype;
      const saveAs = function (blob, name) {
          return new FileSaver(blob, name);
      };
      FS_proto.abort = function () {
          const filesaver = this;
          filesaver.readyState = filesaver.DONE;
          dispatch(filesaver, 'abort');
      };
      FS_proto.readyState = FS_proto.INIT = 0;
      FS_proto.WRITING = 1;
      FS_proto.DONE = 2;
      FS_proto.error = FS_proto.onwritestart = FS_proto.onprogress = FS_proto.onwrite = FS_proto.onabort = FS_proto.onerror = FS_proto.onwriteend = null;

      view.addEventListener('unload', process_deletion_queue, false);
      return saveAs;
  }(
      typeof self !== 'undefined' && self
    || typeof window !== 'undefined' && window
    || this.content,
  ));
if (typeof module !== 'undefined') module.exports = saveAs;
