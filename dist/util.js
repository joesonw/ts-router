"use strict";
const formy = require('formidable');
(function (MediaType) {
    MediaType[MediaType["TEXT"] = 0] = "TEXT";
    MediaType[MediaType["JSON"] = 1] = "JSON";
    MediaType[MediaType["FORM"] = 2] = "FORM";
    MediaType[MediaType["MULTIPART"] = 3] = "MULTIPART";
})(exports.MediaType || (exports.MediaType = {}));
var MediaType = exports.MediaType;
(function (HttpMethod) {
    HttpMethod[HttpMethod["GET"] = 0] = "GET";
    HttpMethod[HttpMethod["POST"] = 1] = "POST";
    HttpMethod[HttpMethod["PUT"] = 2] = "PUT";
    HttpMethod[HttpMethod["DELETE"] = 3] = "DELETE";
})(exports.HttpMethod || (exports.HttpMethod = {}));
var HttpMethod = exports.HttpMethod;
(function (Charset) {
    Charset[Charset["UTF8"] = 0] = "UTF8";
})(exports.Charset || (exports.Charset = {}));
var Charset = exports.Charset;
function mediaTypeToString(type) {
    switch (type) {
        case MediaType.TEXT:
            return 'text/plain';
        case MediaType.JSON:
            return 'application/json';
        case MediaType.FORM:
            return 'application/x-www-form-urlencoded';
        case MediaType.MULTIPART:
            return 'multipart/form-data';
    }
}
exports.mediaTypeToString = mediaTypeToString;
/// <reference path="../node_modules/reflect-metadata/reflect-metadata.d.ts"/>
require('reflect-metadata');
class ReflectType {
}
ReflectType.TYPE = 'design:type';
ReflectType.PARAMETER_TYPE = 'design:paramtypes';
ReflectType.RETURN_TYPE = 'design:returntype';
exports.ReflectType = ReflectType;
function parseMulti(ctx, opts) {
    opts = opts || {};
    return new Promise((resolve, reject) => {
        var fields = {};
        var files = {};
        var form = new formy.IncomingForm(opts);
        form
            .on('end', () => resolve({ fields: fields, files: files }))
            .on('error', err => reject(err))
            .on('field', (field, value) => {
            if (fields[field]) {
                if (Array.isArray(fields[field])) {
                    fields[field].push(value);
                }
                else {
                    fields[field] = [fields[field], value];
                }
            }
            else {
                fields[field] = value;
            }
        })
            .on('file', (field, file) => {
            if (files[field]) {
                if (Array.isArray(files[field])) {
                    files[field].push(file);
                }
                else {
                    files[field] = [files[field], file];
                }
            }
            else {
                files[field] = file;
            }
        });
        if (opts.onFileBegin) {
            form.on('fileBegin', opts.onFileBegin);
        }
        form.parse(ctx.req);
    });
}
exports.parseMulti = parseMulti;
//# sourceMappingURL=util.js.map