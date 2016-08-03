//based on https://github.com/leancloud/typed-leancloud-storage
declare module "leanengine" {
    import * as express from "express";
    import {Server} from "connect";

    namespace AV {

        var applicationId: string;
        var applicationKey: string;
        var masterKey: string;

        function express(): Server;

        interface SuccessOption {
            success?: Function;
        }

        interface ErrorOption {
            error?: Function;
        }

        interface SuccessFailureOptions extends SuccessOption, ErrorOption {
        }

        interface WaitOption {
            /**
             * Set to true to wait for the server to confirm success
             * before triggering an event.
             */
            wait?: boolean;
        }

        interface UseMasterKeyOption {
            /**
             * In Cloud Code and Node only, causes the Master Key to be used for this request.
             */
            useMasterKey?: boolean;
        }

        interface SilentOption {
            /**
             * Set to true to avoid firing the event.
             */
            silent?: boolean;
        }

        /**
         * A Promise is returned by async methods as a hook to provide callbacks to be
         * called when the async task is fulfilled.
         *
         * <p>Typical usage would be like:<pre>
         *    query.find().then(function(results) {
         *      results[0].set("foo", "bar");
         *      return results[0].saveAsync();
         *    }).then(function(result) {
         *      console.log("Updated " + result.id);
         *    });
         * </pre></p>
         *
         * @see AV.Promise.prototype.then
         * @class
         */
        interface IPromise<T> {

            then<U>(resolvedCallback: (value: T) => IPromise<U>, rejectedCallback?: (reason: any) => IPromise<U>): IPromise<T>;
            then<U>(resolvedCallback: (value: T) => U, rejectedCallback?: (reason: any) => IPromise<U>): IPromise<U>;
            then<U>(resolvedCallback: (value: T) => U, rejectedCallback?: (reason: any) => U): IPromise<U>;
        }

        /**
         * A Promise is returned by async methods as a hook to provide callbacks to be
         * called when the async task is fulfilled.
         *
         * <p>Typical usage would be like:<pre>
         *    query.find().then(function(results) {
         *      results[0].set("foo", "bar");
         *      return results[0].saveAsync();
         *    }).then(function(result) {
         *      console.log("Updated " + result.id);
         *    });
         * </pre></p>
         * <p>Another example:<pre>
         *    var promise = new AV.Promise(function(resolve, reject) {
         *      resolve(42);
         *    });
         *    promise.then(function(value){
         *      console.log(value);
         *    }).catch(function(error){
         *      console.error(error);
         *    });
         * </pre></p>
         * @param {Function} fn An optional function with two arguments resolve
         *                   and reject.The first argument fulfills the promise,
         *                   the second argument rejects it. We can call these
            *                  functions, once our operation is completed.
        * @see AV.Promise.prototype.then
        * @class
        */
        class Promise<T> {

            /**
             * Returns a new promise that is resolved with a given value.
             * @return {AV.Promise} the new promise.
             */
            static as<U>(resolvedValue: U): Promise<U>;
            /**
             * Returns a new promise that is rejected with a given error.
             * @return {AV.Promise} the new promise.
             */
            static error<U>(error: U): Promise<U>;
            /**
             * Returns true iff the given object fulfils the Promise interface.
             * @return {Boolean}
             */
            static is(possiblePromise: any): Boolean;
            /**
             * Returns a new promise that is fulfilled when all of the input promises
             * are resolved. If any promise in the list fails, then the returned promise
             * will fail with the last error. If they all succeed, then the returned
             * promise will succeed, with the results being the results of all the input
             * promises. For example: <pre>
             *   var p1 = AV.Promise.as(1);
             *   var p2 = AV.Promise.as(2);
             *   var p3 = AV.Promise.as(3);
             *
             *   AV.Promise.when(p1, p2, p3).then(function(r1, r2, r3) {
             *     console.log(r1);  // prints 1
             *     console.log(r2);  // prints 2
             *     console.log(r3);  // prints 3
             *   });</pre>
             *
             * The input promises can also be specified as an array: <pre>
             *   var promises = [p1, p2, p3];
             *   AV.Promise.when(promises).then(function(r1, r2, r3) {
             *     console.log(r1);  // prints 1
             *     console.log(r2);  // prints 2
             *     console.log(r3);  // prints 3
             *   });
             * </pre>
             * @param {Array} promises a list of promises to wait for.
             * @return {AV.Promise} the new promise.
             */
            static when(...promises: Promise<any>[]): Promise<any>;
            /**
             * Just like AV.Promise.when, but it calls resolveCallbck function
             * with one results array and calls rejectCallback function as soon as any one
             * of the input promises rejects.
             * @see AV.Promise.when
             */
            static all(promises: Promise<any>[]): Promise<any[]>;
            /**
             * Returns a promise that resolves or rejects as soon as one
             * of the promises in the iterable resolves or rejects, with
             * the value or reason from that promise.Returns a new promise
             * that is fulfilled when one of the input promises.
             * For example: <pre>
             *   var p1 = AV.Promise.as(1);
             *   var p2 = AV.Promise.as(2);
             *   var p3 = AV.Promise.as(3);
             *
             *   AV.Promise.race(p1, p2, p3).then(function(result) {
             *     console.log(result);  // prints 1
             *   });</pre>
             *
             * The input promises can also be specified as an array: <pre>
             *   var promises = [p1, p2, p3];
             *   AV.Promise.when(promises).then(function(result) {
             *     console.log(result);  // prints 1
             *   });
             * </pre>
             * @param {Array} promises a list of promises to wait for.
             * @return {AV.Promise} the new promise.
             */
            static race(...promises: Promise<any>[]): Promise<any>;

            static setPromisesAPlusCompliant(isCompliant: boolean): void;
            static setDebugError(enable: boolean): void;

            /**
             * Add handlers to be called when the promise
             * is either resolved or rejected
             */
            always(callback: Function): Promise<T>;
            /**
             * Add handlers to be called when the Promise object is resolved
             */
            done(callback: Function): Promise<T>;
            /**
             * Add handlers to be called when the Promise object is rejected
             */
            fail(callback: Function): Promise<T>;
            /**
             * Marks this promise as fulfilled, firing any callbacks waiting on it.
             * @param {Object} error the error to pass to the callbacks.
             */
            reject(error: any): void;
            /**
             * Marks this promise as fulfilled, firing any callbacks waiting on it.
             * @param {Object} result the result to pass to the callbacks.
             */
            resolve(result: any): void;
            /**
             * Adds callbacks to be called when this promise is fulfilled. Returns a new
             * Promise that will be fulfilled when the callback is complete. It allows
             * chaining. If the callback itself returns a Promise, then the one returned
             * by "then" will not be fulfilled until that one returned by the callback
             * is fulfilled.
             * @param {Function} resolvedCallback Function that is called when this
             * Promise is resolved. Once the callback is complete, then the Promise
             * returned by "then" will also be fulfilled.
             * @param {Function} rejectedCallback Function that is called when this
             * Promise is rejected with an error. Once the callback is complete, then
             * the promise returned by "then" with be resolved successfully. If
             * rejectedCallback is null, or it returns a rejected Promise, then the
             * Promise returned by "then" will be rejected with that error.
             * @return {AV.Promise} A new Promise that will be fulfilled after this
             * Promise is fulfilled and either callback has completed. If the callback
             * returned a Promise, then this Promise will not be fulfilled until that
             * one is.
             */
            then<U>(resolvedCallback: (value: T) => IPromise<U>,
                rejectedCallback?: (reason: any) => IPromise<U>): Promise<U>;
            then<U>(resolvedCallback: (value: T) => U,
                rejectedCallback?: (reason: any) => IPromise<U>): Promise<U>;
            then<U>(resolvedCallback: (value: T) => U,
                rejectedCallback?: (reason: any) => U): Promise<U>;

            /**
             * Add handlers to be called when the Promise object is rejected.
             *
             * @param {Function} rejectedCallback Function that is called when this
             *                   Promise is rejected with an error.
             * @return {AV.Promise} A new Promise that will be fulfilled after this
             *                   Promise is fulfilled and either callback has completed. If the callback
             * returned a Promise, then this Promise will not be fulfilled until that
             *                   one is.
             * @function
             */
            catch(onRejected: Function): Promise<T>;

            /**
             * Alias of AV.Promise.prototype.always
             * @function
             * @see AV.Promise#always
             */
            finally(callback: Function): Promise<T>;
            /**
             * Alias of AV.Promise.prototype.done
             * @function
             * @see AV.Promise#done
             */
            try(callback: Function): Promise<T>;
        }

        interface IBaseObject {
            /**
             * Returns a JSON representation of this query.
             * @return {Object}
             */
            toJSON(): any;
        }

        class BaseObject implements IBaseObject {
            /**
             * Returns a JSON representation of this query.
             * @return {Object}
             */
            toJSON(): any;
        }

        /**
         * Creates a new ACL.
         * If no argument is given, the ACL has no permissions for anyone.
         * If the argument is a AV.User, the ACL will have read and write
         *   permission for only that user.
         * If the argument is any other JSON object, that object will be interpretted
         *   as a serialized ACL created with toJSON().
         * @see AV.Object#setACL
         * @class
         *
         * <p>An ACL, or Access Control List can be added to any
         * <code>AV.Object</code> to restrict access to only a subset of users
         * of your application.</p>
         */
        class ACL extends BaseObject {

            permissionsById: any;

            constructor(arg1?: any);

            /**
             * Set whether the public is allowed to read this object.
             * @param {Boolean} allowed
             */
            setPublicReadAccess(allowed: boolean): void;
            /**
             * Get whether the public is allowed to read this object.
             * @return {Boolean}
             */
            getPublicReadAccess(): boolean;

            /**
             * Set whether the public is allowed to write this object.
             * @param {Boolean} allowed
             */
            setPublicWriteAccess(allowed: boolean): void;
            /**
             * Get whether the public is allowed to write this object.
             * @return {Boolean}
             */
            getPublicWriteAccess(): boolean;


            /**
             * Set whether the given user is allowed to read this object.
             * @param userId An instance of AV.User or its objectId.
             * @param {Boolean} allowed Whether that user should have read access.
             */
            setReadAccess(userId: User | string, allowed: boolean): void;
            /**
             * Get whether the given user id is *explicitly* allowed to read this object.
             * Even if this returns false, the user may still be able to access it if
             * getPublicReadAccess returns true or a role that the user belongs to has
             * write access.
             * @param userId An instance of AV.User or its objectId, or a AV.Role.
             * @return {Boolean}
             */
            getReadAccess(userId: User | string): boolean;

            /**
             * Set whether users belonging to the given role are allowed
             * to read this object.
             *
             * @param role The name of the role, or a AV.Role object.
             * @param {Boolean} allowed Whether the given role can read this object.
             * @throws {String} If role is neither a AV.Role nor a String.
             */
            setRoleReadAccess(role: Role | string, allowed: boolean): void;

            /**
             * Get whether users belonging to the given role are allowed
             * to read this object. Even if this returns false, the role may
             * still be able to write it if a parent role has read access.
             *
             * @param role The name of the role, or a AV.Role object.
             * @return {Boolean} true if the role has read access. false otherwise.
             * @throws {String} If role is neither a AV.Role nor a String.
             */
            getRoleReadAccess(role: Role | string): boolean;

            /**
             * Set whether users belonging to the given role are allowed
             * to write this object.
             *
             * @param role The name of the role, or a AV.Role object.
             * @param {Boolean} allowed Whether the given role can write this object.
             * @throws {String} If role is neither a AV.Role nor a String.
             */
            setRoleWriteAccess(role: Role | string, allowed: boolean): void;

            /**
             * Get whether users belonging to the given role are allowed
             * to write this object. Even if this returns false, the role may
             * still be able to write it if a parent role has write access.
             *
             * @param role The name of the role, or a AV.Role object.
             * @return {Boolean} true if the role has write access. false otherwise.
             * @throws {String} If role is neither a AV.Role nor a String.
             */
            getRoleWriteAccess(role: Role | string): boolean;

            /**
             * Set whether the given user id is allowed to write this object.
             * @param userId An instance of AV.User or its objectId, or a AV.Role..
             * @param {Boolean} allowed Whether that user should have write access.
             */
            setWriteAccess(userId: User | string, allowed: boolean): void;

            /**
             * Get whether the given user id is *explicitly* allowed to write this object.
             * Even if this returns false, the user may still be able to write it if
             * getPublicWriteAccess returns true or a role that the user belongs to has
             * write access.
             * @param userId An instance of AV.User or its objectId, or a AV.Role.
             * @return {Boolean}
             */
            getWriteAccess(userId: User | string): boolean;
        }


        /**
         * A AV.File is a local representation of a file that is saved to the AV
         * cloud.
         * @class
         * @param name {String} The file's name. This will be prefixed by a unique
         *     value once the file has finished saving. The file name must begin with
         *     an alphanumeric character, and consist of alphanumeric characters,
         *     periods, spaces, underscores, or dashes.
         * @param data {Array} The data for the file, as either:
         *     1. an Array of byte value Numbers, or
         *     2. an Object like { base64: "..." } with a base64-encoded String.
         *     3. a File object selected with a file upload control. (3) only works
         *        in Firefox 3.6+, Safari 6.0.2+, Chrome 7+, and IE 10+.
         *        For example:<pre>
         * var fileUploadControl = $("#profilePhotoFileUpload")[0];
         * if (fileUploadControl.files.length > 0) {
         *   var file = fileUploadControl.files[0];
         *   var name = "photo.jpg";
         *   var AVFile = new AV.File(name, file);
         *   AVFile.save().then(function() {
         *     // The file has been saved to AV.
         *   }, function(error) {
         *     // The file either could not be read, or could not be saved to AV.
         *   });
         * }</pre>
         * @param type {String} Optional Content-Type header to use for the file. If
         *     this is omitted, the content type will be inferred from the name's
         *     extension.
         */
        class File {

            constructor(name: string, data: any, type?: string);
            /**
             * Creates a fresh AV.File object with exists url for saving to AVOS Cloud.
             * @param {String} name the file name
             * @param {String} url the file url.
             * @param {Object} metaData the file metadata object,it's optional.
             * @param {String} Optional Content-Type header to use for the file. If
             *     this is omitted, the content type will be inferred from the name's
             *     extension.
             * @return {AV.File} the file object
             */
            static withURL(name: string, url: string): File;
            /**
             * Creates a file object with exists objectId.
             * @param {String} objectId The objectId string
             * @return {AV.File} the file object
             */
            static createWithoutData(objectId: string): File;

            /**
            * Destroy the file.
            * @return {AV.Promise} A promise that is fulfilled when the destroy
            *     completes.
            */
            destroy<T>(): Promise<T>;
            metaData(): any;
            metaData(metaKey: string): any;
            /**
            * <p>Returns the file's metadata JSON object if no arguments is given.Returns the
            * metadata value if a key is given.Set metadata value if key and value are both given.</p>
            * <p><pre>
            *  var metadata = file.metaData(); //Get metadata JSON object.
            *  var size = file.metaData('size');  // Get the size metadata value.
            *  file.metaData('format', 'jpeg'); //set metadata attribute and value.
            *</pre></p>
            * @return {Object} The file's metadata JSON object.
            * @param {String} attr an optional metadata key.
            * @param {Object} value an optional metadata value.
            **/
            metaData(metaKey: string, metaValue: any): any;
            /**
             * Gets the name of the file. Before save is called, this is the filename
             * given by the user. After save is called, that name gets prefixed with a
             * unique identifier.
             */
            name(): string;

            /**
             * Returns the file's owner.
             * @return {String} The file's owner id.
             */
            ownerId(): string;
            /**
             * Gets the url of the file. It is only available after you save the file or
             * after you get the file from a AV.Object.
             * @return {String}
             */
            url(): string;
            /**
             * Saves the file to the AV cloud.
             * @param {Object} saveOptions
             * @param {UploadProgressCallback} [saveOptions.onProgress]
             * @param {Object} options A Backbone-style options object.
             * @return {AV.Promise} Promise that is resolved when the save finishes.
             */
            save<T>(options?: SuccessFailureOptions): Promise<T>;
            /**
            * Returns the file's size.
            * @return {Number} The file's size in bytes.
            **/
            size(): any;
            /**
             * 如果文件是图片，获取图片的缩略图URL。可以传入宽度、高度、质量、格式等参数。
             * @return {String} 缩略图URL
             * @param {Number} width 宽度，单位：像素
             * @param {Number} heigth 高度，单位：像素
             * @param {Number} quality 质量，1-100的数字，默认100
             * @param {Number} scaleToFit 是否将图片自适应大小。默认为true。
             * @param {String} fmt 格式，默认为png，也可以为jpeg,gif等格式。
             */
            thumbnailURL(width: number, height: number): string;

            /**
             * Returns the ACL for this file.
             * @returns {AV.ACL} An instance of AV.ACL.
             */
            getACL(): ACL;

            /**
             * Sets the ACL to be used for this file.
             * @param {AV.ACL} acl An instance of AV.ACL.
             */
            setACL(acl: ACL): void;

            /**
            * Gets the attributs of the file object.
            * @param {String} The attribute name which want to get.
            * @returns {String|Number|Array|Object}
            */
            get(attrName: string): any;

            /**
            * Set the metaData of the file object.
            * @param {Object} Object is an key value Object for setting metaData.
            * @param {String} attr is an optional metadata key.
            * @param {Object} value is an optional metadata value.
            * @returns {String|Number|Array|Object}
            */
            set(attrName: string, value: any): void;
            set(data: any): void;

            /**
            * fetch the file from server. If the server's representation of the
            * model differs from its current attributes, they will be overriden,
            * @param {Object} fetchOptions Optional options to set 'keys' and
            *      'include' option.
            * @param {Object} options Optional Backbone-like options object to be
            *     passed in to set.
            * @return {AV.Promise} A promise that is fulfilled when the fetch
            *     completes.
            */
            fetch<T>(): Promise<T>;
            fetch<T>(options: Object.FetchOptions): Promise<T>;
            fetch<T>(fetchOptions: any, options: Object.FetchOptions): Promise<T>;
        }

        /**
         * Creates a new GeoPoint with any of the following forms:<br>
         *   <pre>
         *   new GeoPoint(otherGeoPoint)
         *   new GeoPoint(30, 30)
         *   new GeoPoint([30, 30])
         *   new GeoPoint({latitude: 30, longitude: 30})
         *   new GeoPoint()  // defaults to (0, 0)
         *   </pre>
         * @class
         *
         * <p>Represents a latitude / longitude point that may be associated
         * with a key in a AVObject or used as a reference point for geo queries.
         * This allows proximity-based queries on the key.</p>
         *
         * <p>Only one key in a class may contain a GeoPoint.</p>
         *
         * <p>Example:<pre>
         *   var point = new AV.GeoPoint(30.0, -20.0);
         *   var object = new AV.Object("PlaceObject");
         *   object.set("location", point);
         *   object.save();</pre></p>
         */
        class GeoPoint extends BaseObject {

            latitude: number;
            longitude: number;

            constructor(arg1?: any, arg2?: any);

            /**
             * Creates a GeoPoint with the user's current location, if available.
             * Calls options.success with a new GeoPoint instance or calls options.error.
             * @param {Object} options An object with success and error callbacks.
             */
            current(options?: SuccessFailureOptions): GeoPoint;
            /**
             * Returns the distance from this GeoPoint to another in radians.
             * @param {AV.GeoPoint} point the other AV.GeoPoint.
             * @return {Number}
             */
            radiansTo(point: GeoPoint): number;
            /**
             * Returns the distance from this GeoPoint to another in kilometers.
             * @param {AV.GeoPoint} point the other AV.GeoPoint.
             * @return {Number}
             */
            kilometersTo(point: GeoPoint): number;
            /**
             * Returns the distance from this GeoPoint to another in miles.
             * @param {AV.GeoPoint} point the other AV.GeoPoint.
             * @return {Number}
             */
            milesTo(point: GeoPoint): number;
        }

        /**
         * A class that is used to access all of the children of a many-to-many relationship.
         * Each instance of AV.Relation is associated with a particular parent object and key.
         */
        class Relation extends BaseObject {

            parent: Object;
            key: string;
            targetClassName: string;

            constructor(parent?: Object, key?: string);

            /**
             * Creates a query that can be used to query the parent objects in this relation.
             * @param {String} parentClass The parent class or name.
             * @param {String} relationKey The relation field key in parent.
             * @param {AV.Object} child The child object.
             * @return {AV.Query}
             */
            static reverseQuery(parentClass: typeof Object, relationKey: string, child: Object): Query;
            static reverseQuery(parentClass: string, relationKey: string, child: Object): Query;

            /**
             * Adds a AV.Object or an array of AV.Objects to the relation.
            * @param {} objects The item or items to add.
            */
            add(object: Object): void;
            /**
             * Returns a AV.Query that is limited to objects in this
             * relation.
             * @return {AV.Query}
             */
            query(): Query;

            /**
             * Removes a AV.Object or an array of AV.Objects from this relation.
             * @param {} objects The item or items to remove.
             */
            remove(object: Object): void;
        }

        /**
         * Creates a new model with defined attributes. A client id (cid) is
         * automatically generated and assigned for you.
         *
         * <p>You won't normally call this method directly.  It is recommended that
         * you use a subclass of <code>AV.Object</code> instead, created by calling
         * <code>extend</code>.</p>
         *
         * <p>However, if you don't want to use a subclass, or aren't sure which
         * subclass is appropriate, you can use this form:<pre>
         *     var object = new AV.Object("ClassName");
         * </pre>
         * That is basically equivalent to:<pre>
         *     var MyClass = AV.Object.extend("ClassName");
         *     var object = new MyClass();
         * </pre></p>
         *
         * @param {Object} attributes The initial set of data to store in the object.
         * @param {Object} options A set of Backbone-like options for creating the
         *     object.  The only option currently supported is "collection".
         * @see AV.Object.extend
         *
         * @class
         *
         * <p>The fundamental unit of AV data, which implements the Backbone Model
         * interface.</p>
         */
        class Object extends BaseObject {

            id: any;
            createdAt: any;
            updatedAt: any;
            attributes: any;
            cid: string;
            changed: boolean;
            className: string;

            constructor(className?: string, options?: any);
            constructor(attributes?: string[], options?: any);
            /**
             * Creates an instance of a subclass of AV.Object for the give classname
             * and id.
             * @param  {String} className The name of the AV class backing this model.
             * @param {String} id The object id of this model.
             * @return {AV.Object} A new subclass instance of AV.Object.
             */
            static createWithoutData(className: string, objectId: string): Object;
            /**
             * Creates a new subclass of AV.Object for the given AV class name.
             *
             * <p>Every extension of a AV class will inherit from the most recent
             * previous extension of that class. When a AV.Object is automatically
             * created by parsing JSON, it will use the most recent extension of that
             * class.</p>
             *
             * <p>You should call either:<pre>
             *     var MyClass = AV.Object.extend("MyClass", {
             *         <i>Instance properties</i>
             *     }, {
             *         <i>Class properties</i>
             *     });</pre>
             * or, for Backbone compatibility:<pre>
             *     var MyClass = AV.Object.extend({
             *         className: "MyClass",
             *         <i>Other instance properties</i>
             *     }, {
             *         <i>Class properties</i>
             *     });</pre></p>
             *
             * @param {String} className The name of the AV class backing this model.
             * @param {Object} protoProps Instance properties to add to instances of the
             *     class returned from this method.
             * @param {Object} classProps Class properties to add the class returned from
             *     this method.
             * @return {Class} A new subclass of AV.Object.
             */
            static extend(className: string, protoProps?: any, classProps?: any): typeof Object;

            /**
             * Fetch the given list of AV.Object.
             * 
             * @param {AV.Object[]} objects A list of <code>AV.Object</code>
             * @param {Object} options
             * @param {String} options.sessionToken specify user's session, used in LeanEngine.
             * @return {Promise.<AV.Object[]>} The given list of <code>AV.Object</code>, updated
             */
            static fetchAll<T>(list: Object[], options?: SuccessFailureOptions): Promise<T>;
            static fetchAllIfNeeded<T>(list: Object[], options: SuccessFailureOptions): Promise<T>;
            /**
             * Delete objects in batch.The objects className must be the same.
             * @param {Array} The <code>AV.Object</code> array to be deleted.
             * @param {Object} options Standard options object with success and error
             *     callbacks.
             * @return {AV.Promise} A promise that is fulfilled when the save
             *     completes.
             */
            static destroyAll<T>(list: Object[], options?: Object.DestroyAllOptions): Promise<T>;

            /**
             * Saves the given list of AV.Object.
             * If any error is encountered, stops and calls the error handler.
             * There are two ways you can call this function.
             *
             * The Backbone way:<pre>
             *   AV.Object.saveAll([object1, object2, ...], {
             *     success: function(list) {
             *       // All the objects were saved.
             *     },
             *     error: function(error) {
             *       // An error occurred while saving one of the objects.
             *     },
             *   });
             * </pre>
             * A simplified syntax:<pre>
             *   AV.Object.saveAll([object1, object2, ...], function(list, error) {
             *     if (list) {
             *       // All the objects were saved.
             *     } else {
             *       // An error occurred.
             *     }
             *   });
             * </pre>
             *
             * @param {Array} list A list of <code>AV.Object</code>.
             * @param {Object} options A Backbone-style callback object.
             */
            static saveAll<T>(list: Object[], options?: Object.SaveAllOptions): Promise<T>;
            /**
             * Creates a new model with defined attributes,
             * It's the same with
             * <pre>
             *   new AV.Object(attributes, options);
             *  </pre>
             * @param {Object} attributes The initial set of data to store in the object.
             * @param {Object} options A set of Backbone-like options for creating the
             *     object.  The only option currently supported is "collection".
             * @return {AV.Object}
             * @since v0.4.4
             * @see AV.Object
             * @see AV.Object.extend
             */
            static new(data?: any): Object;

            /**
             * Initialize is an empty function by default. Override it with your own
             * initialization logic.
             */
            initialize(): void;
            /**
             * Atomically add an object to the end of the array associated with a given
             * key.
             * @param attr {String} The key.
             * @param item {} The item to add.
             */
            add(attributeName: string, item: any): Object;
            /**
             * Atomically add an object to the array associated with a given key, only
             * if it is not already present in the array. The position of the insert is
             * not guaranteed.
             *
             * @param attr {String} The key.
             * @param item {} The object to add.
             */
            addUnique(attributeName: string, item: any): any;
            /**
             * Call this method to manually fire a `"change"` event for this model and
             * a `"change:attribute"` event for each changed attribute.
             * Calling this will cause all objects observing the model to update.
             */
            change(options: any): Object;
            /**
             * Returns an object containing all the attributes that have changed, or
             * false if there are no changed attributes. Useful for determining what
             * parts of a view need to be updated and/or what attributes need to be
             * persisted to the server. Unset attributes will be set to undefined.
             * You can also pass an attributes object to diff against the model,
             * determining if there *would be* a change.
             */
            changedAttributes(diff: any): boolean;
            /**
             * Clear all attributes on the model, firing <code>"change"</code> unless
             * you choose to silence it.
             */
            clear(options: any): any;
            /**
             * Creates a new model with identical attributes to this one.
             * @return {AV.Object}
             */
            clone(): Object;
            /**
             * Destroy this model on the server if it was already persisted.
             * Optimistically removes the model from its collection, if it has one.
             * If `wait: true` is passed, waits for the server to respond
             * before removal.
             *
             * @return {AV.Promise} A promise that is fulfilled when the destroy
             *     completes.
             */
            destroy<T>(options?: Object.DestroyOptions): Promise<T>;
            /**
             * Returns true if this object has been modified since its last
             * save/refresh.  If an attribute is specified, it returns true only if that
             * particular attribute has been modified since the last save/refresh.
             * @param {String} attr An attribute name (optional).
             * @return {Boolean}
             */
            dirty(attr: String): boolean;
            // dirtyKeys(): string[];
            /**
             * Gets the HTML-escaped value of an attribute.
             */
            escape(attr: string): string;
            /**
             * (DEPRECATED) Returns true if this object was created by the AV server when the
             * object might have already been there (e.g. in the case of a Facebook
             * login)
             * 
             * @deprecated
             */
            existed(): boolean;
            /**
             * Fetch the model from the server. If the server's representation of the
             * model differs from its current attributes, they will be overriden,
             * triggering a <code>"change"</code> event.
             * @param {Object} fetchOptions Optional options to set 'keys' and
             *      'include' option.
             * @param {Object} options Optional Backbone-like options object to be
             *     passed in to set.
             * @return {AV.Promise} A promise that is fulfilled when the fetch
             *     completes.
             */
            fetch<T>(): Promise<T>;
            fetch<T>(options: Object.FetchOptions): Promise<T>;
            fetch<T>(fetchOptions: any, options: Object.FetchOptions): Promise<T>;
            /**
            * Set whether to enable fetchWhenSave option when updating object.
            * When set true, SDK would fetch the latest object after saving.
            * Default is false.
            *
            * @deprecated use AV.Object#save with options.fetchWhenSave instead
            * @param {boolean} enable  true to enable fetchWhenSave option.
            */
            fetchWhenSave(enable: boolean): any;
            /**
             * Gets the value of an attribute.
             * @param {String} attr The string name of an attribute.
             */
            get(attr: string): any;
            /**
             * Returns the ACL for this object.
             * @returns {AV.ACL} An instance of AV.ACL.
             * @see AV.Object#get
             */
            getACL(): ACL;
            /**
             * Returns <code>true</code> if the attribute contains a value that is not
             * null or undefined.
             * @param {String} attr The string name of the attribute.
             * @return {Boolean}
             */
            has(attr: string): boolean;
            /**
             * Determine if the model has changed since the last <code>"change"</code>
             * event.  If you specify an attribute name, determine if that attribute
             * has changed.
             * @param {String} attr Optional attribute name
             * @return {Boolean}
             */
            hasChanged(attr: string): boolean;
            /**
             * Atomically increments the value of the given attribute the next time the
             * object is saved. If no amount is specified, 1 is used by default.
             *
             * @param attr {String} The key.
             * @param amount {Number} The amount to increment by.
             */
            increment(attr: string, amount?: number): any;
            /**
             * Checks if the model is currently in a valid state. It's only possible to
             * get into an *invalid* state if you're using silent changes.
             * @return {Boolean}
             */
            isValid(): boolean;
            /**
             * Returns true if this object has never been saved to AV.
             * @return {Boolean}
             */
            isNew(): boolean;
            /**
             * Returns an instance of a subclass of AV.Op describing what kind of
             * modification has been performed on this field since the last time it was
             * saved. For example, after calling object.increment("x"), calling
             * object.op("x") would return an instance of AV.Op.Increment.
             *
             * @param attr {String} The key.
             * @returns {AV.Op} The operation, or undefined if none.
             */
            op(attr: string): any;
            /**
             * Gets the previous value of an attribute, recorded at the time the last
             * <code>"change"</code> event was fired.
             * @param {String} attr Name of the attribute to get.
             */
            previous(attr: string): any;
            /**
             * Gets all of the attributes of the model at the time of the previous
             * <code>"change"</code> event.
             * @return {Object}
             */
            previousAttributes(): any;
            /**
             * Gets a relation on the given class for the attribute.
             * @param String attr The attribute to get the relation for.
             */
            relation(attr: string): Relation;
            /**
             * Atomically remove all instances of an object from the array associated
             * with a given key.
             *
             * @param attr {String} The key.
             * @param item {} The object to remove.
             */
            remove(attr: string, item: any): any;
            /**
             * Set a hash of model attributes, and save the model to the server.
             * updatedAt will be updated when the request returns.
             * You can either call it as:<pre>
             *   object.save();</pre>
             * or<pre>
             *   object.save(null, options);</pre>
             * or<pre>
             *   object.save(attrs, options);</pre>
             * or<pre>
             *   object.save(key, value, options);</pre>
             *
             * For example, <pre>
             *   gameTurn.save({
             *     player: "Jake Cutter",
             *     diceRoll: 2
             *   }, {
             *     success: function(gameTurnAgain) {
             *       // The save was successful.
             *     },
             *     error: function(gameTurnAgain, error) {
             *       // The save failed.  Error is an instance of AVError.
             *     }
             *   });</pre>
             * or with promises:<pre>
             *   gameTurn.save({
             *     player: "Jake Cutter",
             *     diceRoll: 2
             *   }).then(function(gameTurnAgain) {
             *     // The save was successful.
             *   }, function(error) {
             *     // The save failed.  Error is an instance of AVError.
             *   });</pre>
             * @param {Object} options Optional Backbone-like options object to be passed in to set.
             * @param {Boolean} options.fetchWhenSave fetch and update object after save succeeded
             * @param {AV.Query} options.query Save object only when it matches the query
             * @return {AV.Promise} A promise that is fulfilled when the save
             *     completes.
             * @see AVError
             */
            save<T>(options?: Object.SaveOptions, arg2?: any, arg3?: any): Promise<T>;
            /**
             * Sets a hash of model attributes on the object, firing
             * <code>"change"</code> unless you choose to silence it.
             *
             * <p>You can call it with an object containing keys and values, or with one
             * key and value.  For example:<pre>
             *   gameTurn.set({
             *     player: player1,
             *     diceRoll: 2
             *   }, {
             *     error: function(gameTurnAgain, error) {
             *       // The set failed validation.
             *     }
             *   });
             *
             *   game.set("currentPlayer", player2, {
             *     error: function(gameTurnAgain, error) {
             *       // The set failed validation.
             *     }
             *   });
             *
             *   game.set("finished", true);</pre></p>
             *
             * @param {String} key The key to set.
             * @param {} value The value to give it.
             * @param {Object} options A set of Backbone-like options for the set.
             *     The only supported options are <code>silent</code>,
             *     <code>error</code>, and <code>promise</code>.
             * @return {AV.Object} self if succeeded, false if the value is not valid.
             * @see AV.Object#validate
             * @see AVError
             */
            set(key: string, value: any, options?: Object.SetOptions): boolean;
            /**
             * Sets the ACL to be used for this object.
             * @param {AV.ACL} acl An instance of AV.ACL.
             * @param {Object} options Optional Backbone-like options object to be
             *     passed in to set.
             * @return {Boolean} Whether the set passed validation.
             * @see AV.Object#set
             */
            setACL(acl: ACL, options?: SuccessFailureOptions): boolean;
            /**
             * Remove an attribute from the model, firing <code>"change"</code> unless
             * you choose to silence it. This is a noop if the attribute doesn't
             * exist.
             */
            unset(attr: string, options?: any): any;
            /**
             * You should not call this function directly unless you subclass
             * <code>AV.Object</code>, in which case you can override this method
             * to provide additional validation on <code>set</code> and
             * <code>save</code>.  Your implementation should return
             *
             * @param {Object} attrs The current data to validate.
             * @param {Object} options A Backbone-like options object.
             * @return {} False if the data is valid.  An error object otherwise.
             * @see AV.Object#set
             */
            validate(attrs: any, options?: SuccessFailureOptions): boolean;

            disableBeforeHook(): void;
            disableAfterHook(): void;

            /**
             * Returns the object's objectId.
             * @return {String} the objectId.
             */
            getObjectId(): string;
            /**
             * Returns the object's createdAt attribute.
             * @return {Date}
             */
            getCreatedAt(): Date;
            /**
             * Returns the object's updatedAt attribute.
             * @return {Date}
             */
            getUpdatedAt(): Date;
        }

        namespace Object {
            interface DestroyOptions extends SuccessFailureOptions, WaitOption, UseMasterKeyOption { }

            interface DestroyAllOptions extends SuccessFailureOptions, UseMasterKeyOption { }

            interface FetchOptions extends SuccessFailureOptions, UseMasterKeyOption { }

            interface SaveOptions extends SuccessFailureOptions, SilentOption, UseMasterKeyOption, WaitOption { }

            interface SaveAllOptions extends SuccessFailureOptions, UseMasterKeyOption { }

            interface SetOptions extends ErrorOption, SilentOption {
                promise?: any;
            }
        }

        /**
         * Every AV application installed on a device registered for
         * push notifications has an associated Installation object.
         */
        class Installation extends Object {

            badge: any;
            channels: string[];
            timeZone: any;
            deviceType: string;
            pushType: string;
            installationId: string;
            deviceToken: string;
            channelUris: string;
            appName: string;
            appVersion: string;
            AVVersion: string;
            appIdentifier: string;

        }

        /**
         * Creates a new instance with the given models and options.  Typically, you
         * will not call this method directly, but will instead make a subclass using
         * <code>AV.Collection.extend</code>.
         *
         * @param {Array} models An array of instances of <code>AV.Object</code>.
         *
         * @param {Object} options An optional object with Backbone-style options.
         * Valid options are:<ul>
         *   <li>model: The AV.Object subclass that this collection contains.
         *   <li>query: An instance of AV.Query to use when fetching items.
         *   <li>comparator: A string property name or function to sort by.
         * </ul>
         *
         * @see AV.Collection.extend
         *
         * @class
         *
         * <p>Provides a standard collection class for our sets of models, ordered
         * or unordered.  For more information, see the
         * <a href="http://documentcloud.github.com/backbone/#Collection">Backbone
         * documentation</a>.</p>
         */
        class Collection<T> extends Events implements IBaseObject {

            model: Object;
            models: Object[];
            query: Query;
            comparator: (object: Object) => any;

            constructor(models?: Object[], options?: Collection.Options);
            static extend(instanceProps: any, classProps: any): any;

            initialize(): void;
            add(models: any[], options?: Collection.AddOptions): Collection<T>;
            at(index: number): Object;
            fetch(options?: Collection.FetchOptions): Promise<T>;
            create(model: Object, options?: Collection.CreateOptions): Object;
            get(id: string): Object;
            getByCid(cid: any): any;
            pluck(attr: string): any[];
            remove(model: any, options?: Collection.RemoveOptions): Collection<T>;
            remove(models: any[], options?: Collection.RemoveOptions): Collection<T>;
            reset(models: any[], options?: Collection.ResetOptions): Collection<T>;
            sort(options?: Collection.SortOptions): Collection<T>;
            toJSON(): any;
        }

        namespace Collection {
            interface Options {
                model?: Object;
                query?: Query;
                comparator?: string;
            }

            interface AddOptions extends SilentOption {
                /**
                 * The index at which to add the models.
                 */
                at?: number;
            }

            interface CreateOptions extends SuccessFailureOptions, WaitOption, SilentOption, UseMasterKeyOption {
            }

            interface FetchOptions extends SuccessFailureOptions, SilentOption, UseMasterKeyOption { }

            interface RemoveOptions extends SilentOption { }

            interface ResetOptions extends SilentOption { }

            interface SortOptions extends SilentOption { }
        }

        /**
         * @class
         *
         * <p>AV.Events is a fork of Backbone's Events module, provided for your
         * convenience.</p>
         *
         * <p>A module that can be mixed in to any object in order to provide
         * it with custom events. You may bind callback functions to an event
         * with `on`, or remove these functions with `off`.
         * Triggering an event fires all callbacks in the order that `on` was
         * called.
         *
         * <pre>
         *     var object = {};
         *     _.extend(object, AV.Events);
         *     object.on('expand', function(){ alert('expanded'); });
         *     object.trigger('expand');</pre></p>
         *
         * <p>For more information, see the
         * <a href="http://documentcloud.github.com/backbone/#Events">Backbone
         * documentation</a>.</p>
         */
        class Events {

            static off(events: string[], callback?: Function, context?: any): Events;
            static on(events: string[], callback?: Function, context?: any): Events;
            static trigger(events: string[]): Events;
            static bind(): Events;
            static unbind(): Events;

            on(eventName: string, callback?: Function, context?: any): Events;
            off(eventName?: string, callback?: Function, context?: any): Events;
            trigger(eventName: string, ...args: any[]): Events;
            bind(eventName: string, callback: Function, context?: any): Events;
            unbind(eventName?: string, callback?: Function, context?: any): Events;

        }

        /**
         * Creates a new AV AV.Query for the given AV.Object subclass.
         * @param objectClass -
         *   An instance of a subclass of AV.Object, or a AV className string.
         * @class
         *
         * <p>AV.Query defines a query that is used to fetch AV.Objects. The
         * most common use case is finding all objects that match a query through the
         * <code>find</code> method. For example, this sample code fetches all objects
         * of class <code>MyClass</code>. It calls a different function depending on
         * whether the fetch succeeded or not.
         *
         * <pre>
         * var query = new AV.Query(MyClass);
         * query.find({
         *   success: function(results) {
         *     // results is an array of AV.Object.
         *   },
         *
         *   error: function(error) {
         *     // error is an instance of AV.Error.
         *   }
         * });</pre></p>
         *
         * <p>A AV.Query can also be used to retrieve a single object whose id is
         * known, through the get method. For example, this sample code fetches an
         * object of class <code>MyClass</code> and id <code>myId</code>. It calls a
         * different function depending on whether the fetch succeeded or not.
         *
         * <pre>
         * var query = new AV.Query(MyClass);
         * query.get(myId, {
         *   success: function(object) {
         *     // object is an instance of AV.Object.
         *   },
         *
         *   error: function(object, error) {
         *     // error is an instance of AV.Error.
         *   }
         * });</pre></p>
         *
         * <p>A AV.Query can also be used to count the number of objects that match
         * the query without retrieving all of those objects. For example, this
         * sample code counts the number of objects of the class <code>MyClass</code>
         * <pre>
         * var query = new AV.Query(MyClass);
         * query.count({
         *   success: function(number) {
         *     // There are number instances of MyClass.
         *   },
         *
         *   error: function(error) {
         *     // error is an instance of AV.Error.
         *   }
         * });</pre></p>
         */
        class Query extends BaseObject {

            objectClass: any;
            className: string;

            constructor(objectClass: any);

            /**
             * Constructs a AV.Query that is the OR of the passed in queries.  For
             * example:
             * <pre>var compoundQuery = AV.Query.or(query1, query2, query3);</pre>
             *
             * will create a compoundQuery that is an or of the query1, query2, and
             * query3.
             * @param {...AV.Query} var_args The list of queries to OR.
             * @return {AV.Query} The query that is the OR of the passed in queries.
             */
            static or(...var_args: Query[]): Query;
            /**
             * Constructs a AV.Query that is the AND of the passed in queries.  For
             * example:
             * <pre>var compoundQuery = AV.Query.and(query1, query2, query3);</pre>
             *
             * will create a compoundQuery that is an 'and' of the query1, query2, and
             * query3.
             * @param {...AV.Query} var_args The list of queries to AND.
             * @return {AV.Query} The query that is the AND of the passed in queries.
             */
            static and(...var_args: Query[]): Query;
            /**
             * Retrieves a list of AVObjects that satisfy the CQL.
             * CQL syntax please see <a href='https://cn.avoscloud.com/docs/cql_guide.html'>CQL Guide.</a>
             * Either options.success or options.error is called when the find
             * completes.
             *
             * @param {String} cql,  A CQL string, see <a href='https://cn.avoscloud.com/docs/cql_guide.html'>CQL Guide.</a>
             * @param {Array} pvalues, An array contains placeholder values.
             * @param {Object} options A Backbone-style options object,it's optional.
             * @return {AV.Promise} A promise that is resolved with the results when
             * the query completes,it's optional.
             */
            static doCloudQuery<T>(cql: string, pvalues?: any, options?: Query.FindOptions): Promise<T>;

            /**
             * Also sorts the results in ascending order by the given key. The previous sort keys have
             * precedence over this key.
             *
             * @param {String|string[]} keys The key to order by
             * @return {AV.Query} Returns the query so you can chain this call.
             */
            addAscending(keys: string | string[]): Query;
            /** 
             * Also sorts the results in descending order by the given key. The previous sort keys have
             * precedence over this key.
             *
             * @param {String|string[]} keys The key to order by
             * @return {AV.Query} Returns the query so you can chain this call.
             */
            addDescending(keys: string | string[]): Query;
            /**
             * Sorts the results in ascending order by the given key.
             *
             * @param {String|string[]} keys The key to order by.
             * @return {AV.Query} Returns the query, so you can chain this call.
             */
            ascending(keys: string | string[]): Query;
            /**
             * Returns a new instance of AV.Collection backed by this query.
             * @return {AV.Collection}
             */
            collection(items?: Object[], options?: Collection.Options): Collection<Object>;
            /**
             * Add a constraint to the query that requires a particular key's value to
             * be contained in the provided list of values.
             * @param {String} key The key to check.
             * @param {Array} values The values that will match.
             * @return {AV.Query} Returns the query, so you can chain this call.
             */
            containedIn(key: string, values: any[]): Query;
            /**
             * Add a constraint for finding string values that contain a provided
             * string.  This may be slow for large datasets.
             * @param {String} key The key that the string to match is stored in.
             * @param {String} substring The substring that the value must contain.
             * @return {AV.Query} Returns the query, so you can chain this call.
             */
            contains(key: string, substring: string): Query;
            /**
             * Add a constraint to the query that requires a particular key's value to
             * contain each one of the provided list of values.
             * @param {String} key The key to check.  This key's value must be an array.
             * @param {Array} values The values that will match.
             * @return {AV.Query} Returns the query, so you can chain this call.
             */
            containsAll(key: string, values: any[]): Query;
            /**
             * Counts the number of objects that match this query.
             * Either options.success or options.error is called when the count
             * completes.
             *
             * @param {Object} options A Backbone-style options object.
             * @return {AV.Promise} A promise that is resolved with the count when
             * the query completes.
             */
            count(options?: Query.CountOptions): Promise<number>;
            /**
             * Sorts the results in descending order by the given key.
             *
             * @param {String|string[]} keys The key to order by.
             * @return {AV.Query} Returns the query, so you can chain this call.
             */
            descending(keys: string | string[]): Query;
            /**
             * Add a constraint for finding objects that do not contain a given key.
             * @param {String} key The key that should not exist
             * @return {AV.Query} Returns the query, so you can chain this call.
             */
            doesNotExist(key: string): Query;
            /**
             * Add a constraint that requires that a key's value not match a value in
             * an object returned by a different AV.Query.
             * @param {String} key The key that contains the value that is being
             *                     excluded.
             * @param {String} queryKey The key in the objects returned by the query to
             *                          match against.
             * @param {AV.Query} query The query to run.
             * @return {AV.Query} Returns the query, so you can chain this call.
             */
            doesNotMatchKeyInQuery(key: string, queryKey: string, query: Query): Query;
            /**
            * Add a constraint that requires that a key's value not matches a
            * AV.Query constraint.
            * @param {String} key The key that the contains the object to match the
            *                     query.
            * @param {AV.Query} query The query that should not match.
            * @return {AV.Query} Returns the query, so you can chain this call.
            */
            doesNotMatchQuery(key: string, query: Query): Query;
            /**
             * Iterates over each result of a query, calling a callback for each one. If
             * the callback returns a promise, the iteration will not continue until
             * that promise has been fulfilled. If the callback returns a rejected
             * promise, then iteration will stop with that error. The items are
             * processed in an unspecified order. The query may not have any sort order,
             * and may not use limit or skip.
             * @param callback {Function} Callback that will be called with each result
             *     of the query.
             * @param options {Object} An optional Backbone-like options object with
             *     success and error callbacks that will be invoked once the iteration
             *     has finished.
             * @return {AV.Promise} A promise that will be fulfilled once the
             *     iteration has completed.
             */
            each<T>(callback: Function, options?: SuccessFailureOptions): Promise<T>;
            /**
             * Add a constraint for finding string values that end with a provided
             * string.  This will be slow for large datasets.
             * @param {String} key The key that the string to match is stored in.
             * @param {String} suffix The substring that the value must end with.
             * @return {AV.Query} Returns the query, so you can chain this call.
             */
            endsWith(key: string, suffix: string): Query;
            /**
             * Add a constraint to the query that requires a particular key's value to
             * be equal to the provided value.
             * @param {String} key The key to check.
             * @param value The value that the AV.Object must contain.
             * @return {AV.Query} Returns the query, so you can chain this call.
             */
            equalTo(key: string, value: any): Query;
            /**
             * Add a constraint for finding objects that contain the given key.
             * @param {String} key The key that should exist.
             * @return {AV.Query} Returns the query, so you can chain this call.
             */
            exists(key: string): Query;
            /**
             * Retrieves a list of AVObjects that satisfy this query.
             * Either options.success or options.error is called when the find
             * completes.
             *
             * @param {Object} options A Backbone-style options object.
             * @return {AV.Promise} A promise that is resolved with the results when
             * the query completes.
             */
            find<T>(options?: Query.FindOptions): Promise<T>;
            /**
             * Retrieves at most one AV.Object that satisfies this query.
             *
             * Either options.success or options.error is called when it completes.
             * success is passed the object if there is one. otherwise, undefined.
             *
             * @param {Object} options A Backbone-style options object.
             * @return {AV.Promise} A promise that is resolved with the object when
             * the query completes.
             */
            first<T>(options?: Query.FirstOptions): Promise<T>;
            /**
             * Constructs a AV.Object whose id is already known by fetching data from
             * the server.  Either options.success or options.error is called when the
             * find completes.
             *
             * @param {} objectId The id of the object to be fetched.
             * @param {Object} options A Backbone-style options object.
             */
            get<T>(objectId: string, options?: SuccessFailureOptions): Promise<T>;
            /**
             * Add a constraint to the query that requires a particular key's value to
             * be greater than the provided value.
             * @param {String} key The key to check.
             * @param value The value that provides an lower bound.
             * @return {AV.Query} Returns the query, so you can chain this call.
             */
            greaterThan(key: string, value: any): Query;
            /**
             * Add a constraint to the query that requires a particular key's value to
             * be greater than or equal to the provided value.
             * @param {String} key The key to check.
             * @param value The value that provides an lower bound.
             * @return {AV.Query} Returns the query, so you can chain this call.
             */
            greaterThanOrEqualTo(key: string, value: any): Query;
            /**
             * Include nested AV.Objects for the provided key.  You can use dot
             * notation to specify which fields in the included object are also fetch.
             * @param {String|string[]} keys The name of the key to include.
             * @return {AV.Query} Returns the query, so you can chain this call.
             */
            include(keys: string | string[]): Query;
            /**
             * Add a constraint to the query that requires a particular key's value to
             * be less than the provided value.
             * @param {String} key The key to check.
             * @param value The value that provides an upper bound.
             * @return {AV.Query} Returns the query, so you can chain this call.
             */
            lessThan(key: string, value: any): Query;
            /**
             * Add a constraint to the query that requires a particular key's value to
             * be less than or equal to the provided value.
             * @param {String} key The key to check.
             * @param value The value that provides an upper bound.
             * @return {AV.Query} Returns the query, so you can chain this call.
             */
            lessThanOrEqualTo(key: string, value: any): Query;
            /**
             * Sets the limit of the number of results to return. The default limit is
             * 100, with a maximum of 1000 results being returned at a time.
             * @param {Number} n the number of results to limit to.
             * @return {AV.Query} Returns the query, so you can chain this call.
             */
            limit(n: number): Query;
            /**
             * Add a regular expression constraint for finding string values that match
             * the provided regular expression.
             * This may be slow for large datasets.
             * @param {String} key The key that the string to match is stored in.
             * @param {RegExp} regex The regular expression pattern to match.
             * @return {AV.Query} Returns the query, so you can chain this call.
             */
            matches(key: string, regex: RegExp, modifiers?: any): Query;
            /**
             * Add a constraint that requires that a key's value matches a value in
             * an object returned by a different AV.Query.
             * @param {String} key The key that contains the value that is being
             *                     matched.
             * @param {String} queryKey The key in the objects returned by the query to
             *                          match against.
             * @param {AV.Query} query The query to run.
             * @return {AV.Query} Returns the query, so you can chain this call.
             */
            matchesKeyInQuery(key: string, queryKey: string, query: Query): Query;
            /**
             * Add a constraint that requires that a key's value matches a AV.Query
             * constraint.
             * @param {String} key The key that the contains the object to match the
             *                     query.
             * @param {AV.Query} query The query that should match.
             * @return {AV.Query} Returns the query, so you can chain this call.
             */
            matchesQuery(key: string, query: Query): Query;
            /**
             * Add a proximity based constraint for finding objects with key point
             * values near the point given.
             * @param {String} key The key that the AV.GeoPoint is stored in.
             * @param {AV.GeoPoint} point The reference AV.GeoPoint that is used.
             * @return {AV.Query} Returns the query, so you can chain this call.
             */
            near(key: string, point: GeoPoint): Query;
            /**
             * Add a constraint to the query that requires a particular key's value to
             * not be contained in the provided list of values.
             * @param {String} key The key to check.
             * @param {Array} values The values that will not match.
             * @return {AV.Query} Returns the query, so you can chain this call.
             */
            notContainedIn(key: string, values: any[]): Query;
            /**
             * Add a constraint to the query that requires a particular key's value to
             * be not equal to the provided value.
             * @param {String} key The key to check.
             * @param value The value that must not be equalled.
             * @return {AV.Query} Returns the query, so you can chain this call.
             */
            notEqualTo(key: string, value: any): Query;
            /**
             * Restrict the fields of the returned AV.Objects to include only the
             * provided keys.  If this is called multiple times, then all of the keys
             * specified in each of the calls will be included.
             * @param {Array} keys The names of the keys to include.
             * @return {AV.Query} Returns the query, so you can chain this call.
             */
            select(...keys: string[]): Query;
            /**
             * Sets the number of results to skip before returning any results.
             * This is useful for pagination.
             * Default is to skip zero results.
             * @param {Number} n the number of results to skip.
             * @return {AV.Query} Returns the query, so you can chain this call.
             */
            skip(n: number): Query;
            /**
             * Add a constraint for finding string values that start with a provided
             * string.  This query will use the backend index, so it will be fast even
             * for large datasets.
             * @param {String} key The key that the string to match is stored in.
             * @param {String} prefix The substring that the value must start with.
             * @return {AV.Query} Returns the query, so you can chain this call.
             */
            startsWith(key: string, prefix: string): Query;
            /**
             * Add a constraint to the query that requires a particular key's
             * coordinates be contained within a given rectangular geographic bounding
             * box.
             * @param {String} key The key to be constrained.
             * @param {AV.GeoPoint} southwest
             *     The lower-left inclusive corner of the box.
             * @param {AV.GeoPoint} northeast
             *     The upper-right inclusive corner of the box.
             * @return {AV.Query} Returns the query, so you can chain this call.
             */
            withinGeoBox(key: string, southwest: GeoPoint, northeast: GeoPoint): Query;
            /**
             * Add a proximity based constraint for finding objects with key point
             * values near the point given and within the maximum distance given.
             * Radius of earth used is 6371.0 kilometers.
             * @param {String} key The key that the AV.GeoPoint is stored in.
             * @param {AV.GeoPoint} point The reference AV.GeoPoint that is used.
             * @param {Number} maxDistance Maximum distance (in kilometers) of results
             *     to return.
             * @return {AV.Query} Returns the query, so you can chain this call.
             */
            withinKilometers(key: string, point: GeoPoint, maxDistance: number): Query;
            /**
             * Add a proximity based constraint for finding objects with key point
             * values near the point given and within the maximum distance given.
             * Radius of earth used is 3958.8 miles.
             * @param {String} key The key that the AV.GeoPoint is stored in.
             * @param {AV.GeoPoint} point The reference AV.GeoPoint that is used.
             * @param {Number} maxDistance Maximum distance (in miles) of results to
             *     return.
             * @return {AV.Query} Returns the query, so you can chain this call.
             */
            withinMiles(key: string, point: GeoPoint, maxDistance: number): Query;
            /**
             * Add a proximity based constraint for finding objects with key point
             * values near the point given and within the maximum distance given.
             * @param {String} key The key that the AV.GeoPoint is stored in.
             * @param {AV.GeoPoint} point The reference AV.GeoPoint that is used.
             * @param maxDistance Maximum distance (in radians) of results to return.
             * @return {AV.Query} Returns the query, so you can chain this call.
             */
            withinRadians(key: string, point: GeoPoint, maxDistance: number): Query;

            /**
             * Delete objects retrieved by this query.
             * @param {Object} options Standard options object with success and error
             *     callbacks.
             * @return {AV.Promise} A promise that is fulfilled when the save
             *     completes.
             */
            destroyAll(options?: Query.FindOptions): Promise<Object[]>;
            /**
             * Add a constraint to the query that requires a particular
             * <strong>array</strong> key's length to be equal to the provided value.
             * @param {String} key The array key to check.
             * @param value The length value.
             * @return {AV.Query} Returns the query, so you can chain this call.
             */
            sizeEqualTo(key: string, value: number): Query;
        }

        class FriendShipQuery extends Query { }

        namespace Query {
            interface CountOptions extends SuccessFailureOptions, UseMasterKeyOption { }
            interface FindOptions extends SuccessFailureOptions, UseMasterKeyOption { }
            interface FirstOptions extends SuccessFailureOptions, UseMasterKeyOption { }
            interface GetOptions extends SuccessFailureOptions, UseMasterKeyOption { }
        }

        /**
         * Represents a Role on the AV server. Roles represent groupings of
         * Users for the purposes of granting permissions (e.g. specifying an ACL
         * for an Object). Roles are specified by their sets of child users and
         * child roles, all of which are granted any permissions that the parent
         * role has.
         *
         * <p>Roles must have a name (which cannot be changed after creation of the
         * role), and must specify an ACL.</p>
         * @class
         * A AV.Role is a local representation of a role persisted to the AV
         * cloud.
         */
        class Role extends Object {

            /**
             * Constructs a new AVRole with the given name and ACL.
             *
             * @param {String} name The name of the Role to create.
             * @param {AV.ACL} [acl] The ACL for this role. if absent, the default ACL
             *    `{'*': { read: true }}` will be used.
             */
            constructor(name: string, acl?: ACL);

            /**
             * Gets the AV.Relation for the AV.Roles that are direct
             * children of this role. These roles' users are granted any privileges that
             * this role has been granted (e.g. read or write access through ACLs). You
             * can add or remove child roles from this role through this relation.
             *
             * <p>This is equivalent to calling role.relation("roles")</p>
             *
             * @return {AV.Relation} the relation for the roles belonging to this
             *     role.
             */
            getRoles(): Relation;
            /**
             * Gets the AV.Relation for the AV.Users that are direct
             * children of this role. These users are granted any privileges that this
             * role has been granted (e.g. read or write access through ACLs). You can
             * add or remove users from the role through this relation.
             *
             * <p>This is equivalent to calling role.relation("users")</p>
             *
             * @return {AV.Relation} the relation for the users belonging to this
             *     role.
             */
            getUsers(): Relation;
            /**
             * Gets the name of the role.  You can alternatively call role.get("name")
             *
             * @return {String} the name of the role.
             */
            getName(): string;
            /**
             * Sets the name for a role. This value must be set before the role has
             * been saved to the server, and cannot be set once the role has been
             * saved.
             *
             * <p>
             *   A role's name can only contain alphanumeric characters, _, -, and
             *   spaces.
             * </p>
             *
             * <p>This is equivalent to calling role.set("name", name)</p>
             *
             * @param {String} name The name of the role.
             * @param {Object} options Standard options object with success and error
             *     callbacks.
             */
            setName(name: string, options?: SuccessFailureOptions): any;
        }

        /**
         * @class
         *
         * <p>A AV.User object is a local representation of a user persisted to the
         * AV cloud. This class is a subclass of a AV.Object, and retains the
         * same functionality of a AV.Object, but also extends it with various
         * user specific methods, like authentication, signing up, and validation of
         * uniqueness.</p>
         */
        class User extends Object {

            /**
             * Retrieves the currently logged in AVUser with a valid session,
             * either from memory or localStorage, if necessary.
             * @return {AV.Object} The currently logged in AV.User.
             */
            static current(): User;

            /**
             * Signs up a new user with a username (or email) and password.
             * This will create a new AV.User on the server, and also persist the
             * session in localStorage so that you can access the user using
             * {@link #current}.
             *
             * <p>Calls options.success or options.error on completion.</p>
             *
             * @param {String} username The username (or email) to sign up with.
             * @param {String} password The password to sign up with.
             * @param {Object} attrs Extra fields to set on the new user.
             * @param {Object} options A Backbone-style options object.
             * @return {AV.Promise} A promise that is fulfilled with the user when
             *     the signup completes.
             * @see AV.User#signUp
             */
            static signUp<T>(username: string, password: string, attrs: any, options?: SuccessFailureOptions): Promise<T>;
            /**
             * Logs in a user with a username (or email) and password. On success, this
             * saves the session to disk, so you can retrieve the currently logged in
             * user using <code>current</code>.
             *
             * <p>Calls options.success or options.error on completion.</p>
             *
             * @param {String} username The username (or email) to log in with.
             * @param {String} password The password to log in with.
             * @param {Object} options A Backbone-style options object.
             * @return {AV.Promise} A promise that is fulfilled with the user when
             *     the login completes.
             * @see AV.User#logIn
             */
            static logIn(username: string, password: string, options?: SuccessFailureOptions): Promise<User>;
            /**
             * Logs out the currently logged in user session. This will remove the
             * session from disk, log out of linked services, and future calls to
             * <code>current</code> will return <code>null</code>.
             */
            static logOut(): Promise<void>;
            // static allowCustomUserClass(isAllowed: boolean): void;
            /**
             * Logs in a user with a session token. On success, this saves the session
             * to disk, so you can retrieve the currently logged in user using
             * <code>current</code>.
             *
             * <p>Calls options.success or options.error on completion.</p>
             *
             * @param {String} sessionToken The sessionToken to log in with.
             * @param {Object} options A Backbone-style options object.
             * @return {AV.Promise} A promise that is fulfilled with the user when
             *     the login completes.
             */
            static become(sessionToken: string, options?: SuccessFailureOptions): Promise<User>;
            /**
             * Logs in a user with a mobile phone number and password. On success, this
             * saves the session to disk, so you can retrieve the currently logged in
             * user using <code>current</code>.
             *
             * <p>Calls options.success or options.error on completion.</p>
             *
             * @param {String} mobilePhone The user's mobilePhoneNumber
             * @param {String} password The password to log in with.
             * @param {Object} options A Backbone-style options object.
             * @return {AV.Promise} A promise that is fulfilled with the user when
             *     the login completes.
             * @see AV.User#logIn
             */
            static logInWithMobilePhone(mobilePhone: string, password: string, options?: SuccessFailureOptions): Promise<User>;
            /**
             * Logs in a user with a mobile phone number and sms code sent by
             * AV.User.requestLoginSmsCode.On success, this
             * saves the session to disk, so you can retrieve the currently logged in
             * user using <code>current</code>.
             *
             * <p>Calls options.success or options.error on completion.</p>
             *
             * @param {String} mobilePhone The user's mobilePhoneNumber
             * @param {String} smsCode The sms code sent by AV.User.requestLoginSmsCode
             * @param {Object} options A Backbone-style options object.
             * @return {AV.Promise} A promise that is fulfilled with the user when
             *     the login completes.
             * @see AV.User#logIn
             */
            static logInWithMobilePhoneSmsCode(mobilePhone: string, smsCode: string, options?: SuccessFailureOptions): Promise<User>;

            /**
             * Sign up or logs in a user with a third party auth data(AccessToken).
             * On success, this saves the session to disk, so you can retrieve the currently
             * logged in user using <code>current</code>.
             *
             * @param {Object} authData The response json data returned from third party token, maybe like { openid: 'abc123', access_token: '123abc', expires_in: 1382686496 }
             * @param {string} platform Available platform for sign up.
             * @param {Object} [callback] An object that has an optional success function, that takes no arguments and will be called on a successful puSH. and an error function that takes a AVError and will be called if the push failed.
             * @return {AV.Promise} A promise that is fulfilled with the user when
             *     the login completes.
             * @example AV.User.signUpOrlogInWithAuthData(authData, platform).then(function(user) {
             *   //Access user here
             * }).catch(function(error) {
             *   //console.error("error: ", error);
             * });
             * @see {@link https://leancloud.cn/docs/js_guide.html#绑定第三方平台账户}
             */
            static signUpOrlogInWithAuthData(data: any, platform: string, callback: any): Promise<User>;
            /**
             * Sign up or logs in a user with a mobilePhoneNumber and smsCode.
             * On success, this saves the session to disk, so you can retrieve the currently
             * logged in user using <code>current</code>.
             *
             * <p>Calls options.success or options.error on completion.</p>
             *
             * @param {String} mobilePhoneNumber The user's mobilePhoneNumber.
             * @param {String} smsCode The sms code sent by AV.Cloud.requestSmsCode
             * @param {Object} attributes  The user's other attributes such as username etc.
             * @param {Object} options A Backbone-style options object.
             * @return {AV.Promise} A promise that is fulfilled with the user when
             *     the login completes.
             * @see AV.User#signUpOrlogInWithMobilePhone
             * @see AV.Cloud.requestSmsCode
             */
            static signUpOrlogInWithMobilePhone(mobilePhoneNumber: string, smsCode: string, attributes?: any, options?: SuccessFailureOptions): Promise<User>;
            /**
             * Requests a verify email to be sent to the specified email address
             * associated with the user account. This email allows the user to securely
             * verify their email address on the AV site.
             *
             * <p>Calls options.success or options.error on completion.</p>
             *
             * @param {String} email The email address associated with the user that
             *     doesn't verify their email address.
             * @param {Object} options A Backbone-style options object.
             */
            static requestEmailVerfiy<T>(email: string, options?: SuccessFailureOptions): Promise<T>;
            /**
             * Requests a logIn sms code to be sent to the specified mobile phone
             * number associated with the user account. This sms code allows the user to
             * login by AV.User.logInWithMobilePhoneSmsCode function.
             *
             * <p>Calls options.success or options.error on completion.</p>
             *
             * @param {String} mobilePhone The mobile phone number  associated with the
             *           user that want to login by AV.User.logInWithMobilePhoneSmsCode
             * @param {Object} options A Backbone-style options object.
             */
            static requestLoginSmsCode<T>(mobilePhone: string, options?: SuccessFailureOptions): Promise<T>;
            /**
             * Requests a verify sms code to be sent to the specified mobile phone
             * number associated with the user account. This sms code allows the user to
             * verify their mobile phone number by calling AV.User.verifyMobilePhone
             *
             * <p>Calls options.success or options.error on completion.</p>
             *
             * @param {String} mobilePhone The mobile phone number  associated with the
             *                  user that doesn't verify their mobile phone number.
             * @param {Object} options A Backbone-style options object.
             */
            static requestMobilePhoneVerify<T>(mobilePhone: string, options?: SuccessFailureOptions): Promise<T>;
            /**
             * Requests a password reset email to be sent to the specified email address
             * associated with the user account. This email allows the user to securely
             * reset their password on the AV site.
             *
             * <p>Calls options.success or options.error on completion.</p>
             *
             * @param {String} email The email address associated with the user that
             *     forgot their password.
             * @param {Object} options A Backbone-style options object.
             */
            static requestPasswordReset<T>(email: string, options?: SuccessFailureOptions): Promise<T>;
            /**
             * Requests a reset password sms code to be sent to the specified mobile phone
             * number associated with the user account. This sms code allows the user to
             * reset their account's password by calling AV.User.resetPasswordBySmsCode
             *
             * <p>Calls options.success or options.error on completion.</p>
             *
             * @param {String} mobilePhone The mobile phone number  associated with the
             *                  user that doesn't verify their mobile phone number.
             * @param {Object} options A Backbone-style options object.
             */
            static requestPasswordResetBySmsCode<T>(mobilePhone: string, options?: SuccessFailureOptions): Promise<T>;
            /**
             * Makes a call to reset user's account password by sms code and new password.
            * The sms code is sent by AV.User.requestPasswordResetBySmsCode.
            * @param {String} code The sms code sent by AV.User.Cloud.requestSmsCode
            * @param {String} password The new password.
            * @param {Object} options A Backbone-style options object
            * @return {AV.Promise} A promise that will be resolved with the result
            * of the function.
            */
            static resetPasswordBySmsCode<T>(code: string, password: string, options?: SuccessFailureOptions): Promise<T>;
            /**
             * Makes a call to verify sms code that sent by AV.User.Cloud.requestSmsCode
             * If verify successfully,the user mobilePhoneVerified attribute will be true.
             * @param {String} code The sms code sent by AV.User.Cloud.requestSmsCode
             * @param {Object} options A Backbone-style options object
             * @return {AV.Promise} A promise that will be resolved with the result
             * of the function.
             */
            static verifyMobilePhone<T>(code: string, options?: SuccessFailureOptions): Promise<T>;

            /**
             * Associate a user with a third party auth data(AccessToken).
             *
             * @param {AV.User} userObj A user which you want to associate.
             * @param {string} platform Available platform for sign up.
             * @param {Object} authData The response json data returned from third party token, maybe like { openid: 'abc123', access_token: '123abc', expires_in: 1382686496 }
             * @return {AV.Promise} A promise that is fulfilled with the user when completed.
             * @example AV.User.associateWithAuthData(loginUser, 'weixin', {
             *   openid: 'abc123',
             *   access_token: '123abc',
             *   expires_in: 1382686496
             * }).then(function(user) {
             *   //Access user here
             * }).catch(function(error) {
             *   //console.error("error: ", error);
             * });
             */
            static associateWithAuthData(userObj: User, platform: string, authData: any): Promise<User>;

            /**
             *Create a follower query for special user to query the user's followers.
             * @param userObjectId {String} The user object id.
             * @since 0.3.0
             */
            static followerQuery(userObjectId: string): Query;

            /**
             *Create a followee query for special user to query the user's followees.
             * @param userObjectId {String} The user object id.
             * @since 0.3.0
             */
            static followeeQuery(userObjectId: string): Query;

            /**
             * Retrieves the currently logged in AVUser with a valid session,
             * either from memory or localStorage, if necessary.
             * @return {AV.Promise} resolved with the currently logged in AV.User.
             */
            static currentAsync(): Promise<User>;



            /**
             * Signs up a new user. You should call this instead of save for
             * new AV.Users. This will create a new AV.User on the server, and
             * also persist the session on disk so that you can access the user using
             * <code>current</code>.
             *
             * <p>A username and password must be set before calling signUp.</p>
             *
             * <p>Calls options.success or options.error on completion.</p>
             *
             * @param {Object} attrs Extra fields to set on the new user, or null.
             * @param {Object} options A Backbone-style options object.
             * @return {AV.Promise} A promise that is fulfilled when the signup
             *     finishes.
             * @see AV.User.signUp
             */
            signUp(attrs?: any, options?: SuccessFailureOptions): Promise<User>;
            /**
             * Sign up or logs in a user with a mobilePhoneNumber and smsCode.
             * On success, this saves the session to disk, so you can retrieve the currently
             * logged in user using <code>current</code>.
             *
             * <p>Calls options.success or options.error on completion.</p>
             *
             * @param {String} mobilePhoneNumber The user's mobilePhoneNumber.
             * @param {String} smsCode The sms code sent by AV.Cloud.requestSmsCode
             * @param {Object} attributes  The user's other attributes such as username etc.
             * @param {Object} options A Backbone-style options object.
             * @return {AV.Promise} A promise that is fulfilled with the user when
             *     the login completes.
             * @see AV.User#signUpOrlogInWithMobilePhone
             * @see AV.Cloud.requestSmsCode
             */
            signUpOrlogInWithMobilePhone(attrs?: any, options?: SuccessFailureOptions): Promise<User>;
            /**
             * Logs in a AV.User. On success, this saves the session to localStorage,
             * so you can retrieve the currently logged in user using
             * <code>current</code>.
             *
             * <p>A username and password must be set before calling logIn.</p>
             *
             * <p>Calls options.success or options.error on completion.</p>
             *
             * @param {Object} options A Backbone-style options object.
             * @see AV.User.logIn
             * @return {AV.Promise} A promise that is fulfilled with the user when
             *     the login is complete.
             */
            logIn(options?: SuccessFailureOptions): Promise<User>;
            // fetch(options?: SuccessFailureOptions): Promise<User>;
            // save(arg1?: any, arg2?: any, arg3?: any): Promise<User>;
            /**
             * Checks whether this user is the current user and has been authenticated.
             * @return (Boolean) whether this user is the current user and is logged in.
             */
            authenticated(): boolean;
            /**
             * Returns true if <code>current</code> would return this user.
             * @see AV.User#current
             */
            isCurrent(): boolean;

            /**
             * Follow a user
             * @since 0.3.0
             * @param {} target The target user or user's objectId to follow.
             * @param {Object} options An optional Backbone-like options object with
             *     success and error callbacks that will be invoked once the iteration
             *     has finished.
             */
            follow<T>(target: User | string, options?: SuccessFailureOptions): Promise<T>;

            /**
             * Unfollow a user.
             * @since 0.3.0
             * @param {} target The target user or user's objectId to unfollow.
             * @param options {Object} An optional Backbone-like options object with
             *     success and error callbacks that will be invoked once the iteration
             *     has finished.
             */
            unfollow<T>(target: User | string, options?: SuccessFailureOptions): Promise<T>;

            /**
             *Create a follower query to query the user's followers.
             * @since 0.3.0
             * @see AV.User#followerQuery
             */
            followerQuery(): Promise<User>;
            /**
             *Create a followee query to query the user's followees.
            * @since 0.3.0
            * @see AV.User#followeeQuery
            */
            followeeQuery(): Promise<User>;

            /**
             * Update user's new password safely based on old password.
             * @param {String} oldPassword, the old password.
             * @param {String} newPassword, the new password.
             * @param {Object} An optional Backbone-like options object with
             *     success and error callbacks that will be invoked once the iteration
             *     has finished.
             */
            updatePassword<T>(oldPassword: string, newPassword: string, options?: SuccessFailureOptions): Promise<T>;

            /**
             * Returns get("email").
             * @return {String}
             * @see AV.Object#get
             */
            getEmail(): string;
            /**
             * Calls set("email", email, options) and returns the result.
             * @param {String} email
             * @param {Object} options A Backbone-style options object.
             * @return {Boolean}
             * @see AV.Object.set
             */
            setEmail(email: string, options?: SuccessFailureOptions): boolean;

            /**
             * Calls set("mobilePhoneNumber", phoneNumber, options) and returns the result.
             * @param {String} mobilePhoneNumber
             * @param {Object} options A Backbone-style options object.
             * @return {Boolean}
             * @see AV.Object.set
             */
            setMobilePhoneNumber(mobilePhoneNumber: string, options?: SuccessFailureOptions): boolean;
            /**
             * Returns get("mobilePhoneNumber").
             * @return {String}
             * @see AV.Object#get
             */
            getMobilePhoneNumber(): string;

            /**
             * Returns get("username").
             * @return {String}
             * @see AV.Object#get
             */
            getUsername(): string;
            /**
             * Calls set("username", username, options) and returns the result.
             * @param {String} username
             * @param {Object} options A Backbone-style options object.
             * @return {Boolean}
             * @see AV.Object.set
             */
            setUsername(username: string, options?: SuccessFailureOptions): boolean;

            /**
             * Calls set("password", password, options) and returns the result.
             * @param {String} password
             * @param {Object} options A Backbone-style options object.
             * @return {Boolean}
             * @see AV.Object.set
             */
            setPassword(password: string, options?: SuccessFailureOptions): boolean;
            getSessionToken(): string;
        }

        namespace Analytics {

            function track<T>(name: string, dimensions: any): Promise<T>;
        }


        class Error {

            code: ErrorCode;
            message: string;

            constructor(code: ErrorCode, message: string);

        }

        enum ErrorCode {

            OTHER_CAUSE = -1,
            INTERNAL_SERVER_ERROR = 1,
            CONNECTION_FAILED = 100,
            OBJECT_NOT_FOUND = 101,
            INVALID_QUERY = 102,
            INVALID_CLASS_NAME = 103,
            MISSING_OBJECT_ID = 104,
            INVALID_KEY_NAME = 105,
            INVALID_POINTER = 106,
            INVALID_JSON = 107,
            COMMAND_UNAVAILABLE = 108,
            NOT_INITIALIZED = 109,
            INCORRECT_TYPE = 111,
            INVALID_CHANNEL_NAME = 112,
            PUSH_MISCONFIGURED = 115,
            OBJECT_TOO_LARGE = 116,
            OPERATION_FORBIDDEN = 119,
            CACHE_MISS = 120,
            INVALID_NESTED_KEY = 121,
            INVALID_FILE_NAME = 122,
            INVALID_ACL = 123,
            TIMEOUT = 124,
            INVALID_EMAIL_ADDRESS = 125,
            MISSING_CONTENT_TYPE = 126,
            MISSING_CONTENT_LENGTH = 127,
            INVALID_CONTENT_LENGTH = 128,
            FILE_TOO_LARGE = 129,
            FILE_SAVE_ERROR = 130,
            DUPLICATE_VALUE = 137,
            INVALID_ROLE_NAME = 139,
            EXCEEDED_QUOTA = 140,
            SCRIPT_FAILED = 141,
            VALIDATION_ERROR = 142,
            INVALID_IMAGE_DATA = 150,
            UNSAVED_FILE_ERROR = 151,
            INVALID_PUSH_TIME_ERROR = 152,
            FILE_DELETE_ERROR = 153,
            REQUEST_LIMIT_EXCEEDED = 155,
            INVALID_EVENT_NAME = 160,
            USERNAME_MISSING = 200,
            PASSWORD_MISSING = 201,
            USERNAME_TAKEN = 202,
            EMAIL_TAKEN = 203,
            EMAIL_MISSING = 204,
            EMAIL_NOT_FOUND = 205,
            SESSION_MISSING = 206,
            MUST_CREATE_USER_THROUGH_SIGNUP = 207,
            ACCOUNT_ALREADY_LINKED = 208,
            INVALID_SESSION_TOKEN = 209,
            LINKED_ID_MISSING = 250,
            INVALID_LINKED_SESSION = 251,
            UNSUPPORTED_SERVICE = 252,
            AGGREGATE_ERROR = 600,
            FILE_READ_ERROR = 601,
            X_DOMAIN_REQUEST = 602
        }

        /**
         * @class
         * A AV.Op is an atomic operation that can be applied to a field in a
         * AV.Object. For example, calling <code>object.set("foo", "bar")</code>
         * is an example of a AV.Op.Set. Calling <code>object.unset("foo")</code>
         * is a AV.Op.Unset. These operations are stored in a AV.Object and
         * sent to the server as part of <code>object.save()</code> operations.
         * Instances of AV.Op should be immutable.
         *
         * You should not create subclasses of AV.Op or instantiate AV.Op
         * directly.
         */
        namespace Op {

            interface BaseOperation extends IBaseObject {
                objects(): any[];
            }

            /**
             * @class
             * Add is an atomic operation where the given objects will be appended to the
             * array that is stored in this field.
             */
            interface Add extends BaseOperation { }

            /**
             * @class
             * AddUnique is an atomic operation where the given items will be appended to
             * the array that is stored in this field only if they were not already
             * present in the array.
             */
            interface AddUnique extends BaseOperation { }

            /**
             * @class
             * An Increment is an atomic operation where the numeric value for the field
             * will be increased by a given amount.
             */
            interface Increment extends IBaseObject {
                /**
                 * Returns the amount to increment by.
                 * @return {Number} the amount to increment by.
                 */
                amount: number;
            }

            /**
             * @class
             * A Relation operation indicates that the field is an instance of
             * AV.Relation, and objects are being added to, or removed from, that
             * relation.
             */
            interface Relation extends IBaseObject {
                /**
                 * Returns an array of unfetched AV.Object that are being added to the
                 * relation.
                 * @return {Array}
                 */
                added(): Object[];
                /**
                 * Returns an array of unfetched AV.Object that are being removed from
                 * the relation.
                 * @return {Array}
                 */
                removed: Object[];
            }

            /**
             * @class
             * A Set operation indicates that either the field was changed using
             * AV.Object.set, or it is a mutable container that was detected as being
             * changed.
             */
            interface Set extends IBaseObject {
                /**
                 * Returns the new value of this field after the set.
                 */
                value(): any;
            }

            /**
             * @class
             * An Unset operation indicates that this field has been deleted from the
             * object.
             */
            interface Unset extends IBaseObject { }

            /**
             * @class
             * Remove is an atomic operation where the given objects will be removed from
             * the array that is stored in this field.
             */
            interface Remove extends IBaseObject { }

        }

        /**
         * Contains functions to deal with Push in AV
         * @name AV.Push
         * @namespace
         */
        namespace Push {
            /**
             * Sends a push notification.
             * @param {Object} data -  The data of the push notification.  Valid fields
             * are:
             *   <ol>
             *     <li>channels - An Array of channels to push to.</li>
             *     <li>push_time - A Date object for when to send the push.</li>
             *     <li>expiration_time -  A Date object for when to expire
             *         the push.</li>
             *     <li>expiration_interval - The seconds from now to expire the push.</li>
             *     <li>where - A AV.Query over AV.Installation that is used to match
             *         a set of installations to push to.</li>
             *     <li>cql - A CQL statement over AV.Installation that is used to match
             *         a set of installations to push to.</li>
             *     <li>data - The data to send as part of the push</li>
             *   <ol>
             * @param {Object} options An object that has an optional success function,
             * that takes no arguments and will be called on a successful push, and
             * an error function that takes a AVError and will be called if the push
             * failed.
             */
            function send<T>(data: PushData, options?: SendOptions): Promise<T>;

            interface PushData {
                channels?: string[];
                push_time?: Date;
                expiration_time?: Date;
                expiration_interval?: number;
                where?: Query;
                data?: any;
                alert?: string;
                badge?: string;
                sound?: string;
                title?: string;
            }

            interface SendOptions {
                success?: () => void;
                error?: (error: Error) => void;
            }
        }

        interface CloudResquest {
            expressReq: express.Request,

            params: any,
            object: any,
            meta: {
                remoteAddress: string
            },

            user: User,
            currentUser: User,
            sessionToken: string
        }

        interface CloudResponse {
            success(result: any): void;
            error(error: any): void;
        }

        /**
         * @namespace Contains functions for calling and declaring
         * <a href="/docs/cloud_code_guide#functions">cloud functions</a>.
         * <p><strong><em>
         *   Some functions are only available from Cloud Code.
         * </em></strong></p>
         */
        namespace Cloud {
            /**
             * Makes a call to a cloud function.
             * @param {String} name The function name.
             * @param {Object} data The parameters to send to the cloud function.
             * @param {Object} options A Backbone-style options object
             * options.success, if set, should be a function to handle a successful
             * call to a cloud function.  options.error should be a function that
             * handles an error running the cloud function.  Both functions are
             * optional.  Both functions take a single argument.
             * @return {AV.Promise} A promise that will be resolved with the result
             * of the function.
             */
            function run<T>(name: string, data?: any, options?: SuccessFailureOptions): Promise<T>;

            /**
             * Makes a call to a cloud function, you can send {AV.Object} as param or a field of param; the response
             * from server will also be parsed as an {AV.Object}, array of {AV.Object}, or object includes {AV.Object}
             * @param {String} name The function name.
             * @param {Object} data The parameters to send to the cloud function.
             * @param {Object} options A Backbone-style options object.
             * @return {AV.Promise} A promise that will be resolved with the result of the function.
             */
            function rpc<T>(name: string, data?: any, options?: SuccessFailureOptions): Promise<T>;

            /**
             * Make a call to request server date time.
             * @param {Object} options A Backbone-style options object
             * options.success, if set, should be a function to handle a successful
             * call to a cloud function.  options.error should be a function that
             * handles an error running the cloud function.  Both functions are
             * optional.  Both functions take a single argument.
             * @return {AV.Promise} A promise that will be resolved with the result
             * of the function.
             * @since 0.5.9
             */
            function getServerDate<T>(): Promise<T>;

            /**
             * Makes a call to request a sms code for operation verification.
             * @param {Object} data The mobile phone number string or a JSON
             *    object that contains mobilePhoneNumber,template,op,ttl,name etc.
             * @param {Object} options A Backbone-style options object
             * @return {AV.Promise} A promise that will be resolved with the result
             * of the function.
             */
            function requestSmsCode<T>(data: any, options?: SuccessFailureOptions): Promise<T>;

            /**
             * Makes a call to verify sms code that sent by AV.Cloud.requestSmsCode
             * @param {String} code The sms code sent by AV.Cloud.requestSmsCode
             * @param {phone} phone The mobile phoner number(optional).
             * @param {Object} options A Backbone-style options object
             * @return {AV.Promise} A promise that will be resolved with the result
             * of the function.
             */
            function verifySmsCode<T>(code: string, phone: string, options?: SuccessFailureOptions): Promise<T>;
            function define(name: string, options?: { fetchUser?: boolean }, handler?: (req: CloudResquest, res: CloudResponse) => any): void;

            class BaseHookRequest {
                object: Object;
                user: User;
            }

            class BaseHookResponse {
                error: Function;
                success: Function;
            }

            /**
            * @class A Request object that is passed into the afterDelete function.
            * <strong>Available in Cloud Code only.</strong>
            * @property {AV.Object} object The object that was deleted.
            * @property {AV.User} user If set, the user that made the request.
            */
            class AfterDeleteRequest extends BaseHookRequest { }

            /**
             * @class A Request object that is passed into the afterSave function.
             * <strong>Available in Cloud Code only.</strong>
             * @property {AV.Object} object The object that was saved.
             * @property {AV.User} user If set, the user that made the request.
             */
            class AfterSaveRequest extends BaseHookRequest { }


            /**
             * @class A Request object that is passed into the beforeSave function.
             * <strong>Available in Cloud Code only.</strong>
             * @property {AV.Object} object The object that is being saved.
             * @property {AV.User} user If set, the user that made the request.
             */
            class BeforeSaveRequest extends BaseHookRequest { }


            /**
             * @class A Request object that is passed into the beforeDelete function.
             * <strong>Available in Cloud Code only.</strong>
             * @property {AV.Object} object The object that is being deleted.
             * @property {AV.User} user If set, the user that made the request.
             */
            class BeforeDeleteRequest extends BaseHookRequest { }


            /**
             * @class A Request object that is passed into the afterUpdate function.
             * <strong>Available in Cloud Code only.</strong>
             * @property {AV.Object} object The object that was updated.
             * @property {AV.User} user If set, the user that made the request.
             */
            class AfterUpdateRequest extends BaseHookRequest { }

            /**
             * Define a timer will wait a specified number of seconds, and
             * then execute a specified function, and it will continue to execute the function,
             * once at every given time-interval. <br/>
             * <strong>Available in Cloud Code only.</strong>
             * For example:
             * <pre> <code>
             *       //Log every second.
             *       AV.Cloud.setInterval("timer1", 1, function(){
             *           consooe.log("timer1 log");
             *       });
             * </code></pre>
             * @param name The timer's unique identifier.
             * @param interval The length of the time-intervals between each execution in seconds.
             * @param func The function to be executed.
             */
            function setInterval(name: string, interval: number, func: Function);

            /**
             * Define a timer that will execute by the crontab-like expression.<br/>
             * <strong>Available in Cloud Code only.</strong>
             * <pre> <code>
             *       //Log at 1:00 AM everyday.
             *       AV.Cloud.cronJob("timer1", "0 1 * * * ?", function(){
             *           consooe.log("timer1 log");
             *       });
             * </code></pre>
             * @param name The timer's unique identifier.
             * @param cron The crontab-like string in the form of 'sec min hour dayOfMonth month dayOfWeek [year]'.
             * @param func The function to be executed.
             */
            function cronJob(name: string, cron: string, func: Function);

            /**
             * @class A Response object that is passed to the beforeSave function. This object contains functions to tell the AV.Cloud what to do with the save.
             * <strong>Available in Cloud Code only.</strong>
             * @property {Function} success If called, will allow the save to happen. If a AV.Object is passed in, then the passed in object will be saved instead.
             * @property {Function} error If called, will reject the save. An optional error message may be passed in.
             */
            class BeforeSaveResponse extends BaseHookResponse { }

            /**
             * @class A Response object that is passed to the beforeDelete function. This object contains functions to tell the AV.Cloud what to do with the delete.
             * <strong>Available in Cloud Code only.</strong>
             * @property {Function} success If called, will allow the delete to happen. If a AV.Object is passed in, then the passed in object will be deleted instead.
             * @property {Function} error If called, will reject the delete. An optional error message may be passed in.
             */
            class BeforeDeleteResponse extends BaseHookResponse { }

            /**
             * @class A Request object that is passed into a cloud function.
             * <strong>Available in Cloud Code only.</strong>
             * @property {Object} params The params passed to the cloud function
             * @property {AV.User} user If set, the user that made the request.
             */
            class FunctionRequest extends BaseHookRequest { }

            /**
             * @class A Response object that is passed to a cloud function. This object contains functions to tell the AV.Cloud what to do with the save.
             * <strong>Available in Cloud Code only.</strong>
             * @property {Function} success If success is called, will return a successful response with the optional argument to the caller.
             * @property {Function} error f error is called, will return an error response with an optionally passed message.
             */
            class FunctionResponse extends BaseHookResponse { }

            /**
             * Registers a before save function.
             * <br/><strong>Available in Cloud Code only</strong>.
             * <code><pre>
            AV.Cloud.beforeSave('MyCustomClass', function(request, response) {
            // code here
            })
            AV.Cloud.beforeSave(AV.User, function(request, response) {
            // code here
            })
             * </pre></code>
             * @param {Class} name The AV.Object subclass to register the before save function for. This can instead be a String that is the className of the subclass.
             * @param {Function} func The function to run before a save. This function should take two parameters a AV.Cloud.BeforeSaveRequest and a AV.Cloud.BeforeSaveResponse.
             */
            function beforeSave(name: typeof Object | string, func: Function);

            /**
             * Registers an after save function.
             * <br/><strong>Available in Cloud Code only</strong>.
             * <code><pre>
            AV.Cloud.afterSave('MyCustomClass', function(request) {
              // code here
             })
            AV.Cloud.afterSave(AV.User, function(request) {
            // code here
            })
             * </pre></code>
             * @param {Class} name The AV.Object subclass to register the after save function for. This can instead be a String that is the className of the subclass.
             * @param {Function} func The function to run after a save. This function should take just one parameter AV.Cloud.AfterSaveRequest.
             */
            function afterSave(name: typeof Object | string, func: Function);

            /**
             * Registers an after update function.
             * <br/><strong>Available in Cloud Code only</strong>.
             * <code><pre>
            AV.Cloud.afterUpdate('MyCustomClass', function(request) {
              // code here
             })
            AV.Cloud.afterUpdate(AV.User, function(request) {
            // code here
            })
             * </pre></code>
             * @param {Class} name The AV.Object subclass to register the after update function for. This can instead be a String that is the className of the subclass.
             * @param {Function} func The function to run after a update. This function should take just one parameter AV.Cloud.AfterUpdateRequest.
             */
            function afterUpdate(name: typeof Object | string, func: Function);

            /**
             * Registers a before delete function.
             * <br/><strong>Available in Cloud Code only</strong>.
             * If you want use beforeDelete for a predefined class in the AV JavaScript SDK (e.g. AV.User), you should pass the class itself and not the String for arg1.
             * <code><pre>
            AV.Cloud.beforeDelete('MyCustomClass', function(request, response) {
             // code here
            })
            AV.Cloud.beforeDelete(AV.User, function(request, response) {
             // code here
            })
             * </pre></code>
             * @param {Class} arg1 The AV.Object subclass to register the before delete function for. This can instead be a String that is the className of the subclass.
             * @param {Function} func The function to run before a delete. This function should take two parameters a AV.Cloud.BeforeDeleteRequest and a AV.Cloud.BeforeDeleteResponse
             */
            function beforeDelete(name: typeof Object | string, func: Function);

            /**
             * Registers an after delete function.
             * <br/><strong>Available in Cloud Code only</strong>.
             * If you want to use afterDelete for a predefined class in the AV JavaScript SDK (e.g. AV.User), you should pass the class itself and not the String for arg1.
             * <code><pre>
            AV.Cloud.afterDelete('MyCustomClass', function(request) {
             // code here
            })
            AV.Cloud.afterDelete(AV.User, function(request) {
             // code here
            })
             * </pre></code>
             * @param {Class} arg1 The AV.Object subclass to register the before save function for. This can instead be a String that is the className of the subclass.
             * @param {Function} func The function to run before a save. This function should take just one parameter, AV.Cloud.AfterDeleteRequest.
             */
            function afterDelete(name: typeof Object | string, func: Function);

            /**
             * Registers an on-login function.
             * <br/><strong>Available in Cloud Code only</strong>.
             * If you want to use onLogin for an user in the AV JavaScript SDK, you should pass the function:
             * <code><pre>
            AV.Cloud.onLogin(function(request, response) {
             // code here
            });
             * </pre></code>
             * @param {Function} func The function to run before an user signin. This function should take two parameters a AV.Cloud.FunctionRequest and a AV.Cloud.FunctionResponse.
             */
            function onLogin(func: Function);

            /**
             * Makes an HTTP Request.
             * <br/><strong>Available in Cloud Code only</strong>.
             * @param {Object} The options objects that makes the request.
             * @return {AV.Promise}  A promise that will be resolved with a AV.Cloud.HTTPResponse object when the request completes.
             */
            function httpRequest<T>(options): Promise<T>;

            /**
             * Switches the LeanCloud SDK to using the Master key.  The Master key grants
             * priveleged access to the data in LeanCloud and can be used to bypass ACLs and
             * other restrictions that are applied to the client SDKs.
             * <p><strong><em>Available in Cloud Code and Node.js only.</em></strong>
             * </p>
             */
            function useMasterKey();
        }

        /**
         * Call this method first to set up your authentication tokens for AV.
         * @param {String} applicationId Your Application ID.
         * @param {String} applicationKey Your Application Key.
         * @param {String} masterKey (optional) Your Application Master Key. (Node.js only!)
         */
        function initialize(applicationId: string, applicationKey: string, masterKey?: string): void;

        /**
        *options : {appId:'',appKey:'',masterKey:''}
        */
        function init(options: { appId: string, appKey: string, masterKey?: string, region?: "cn" | "us" }): void;

        /**
         * @deprecated Please use AV.init(), you can set the region of server .
        */
        function useAVCloudCN(): void;
        /**
         * @deprecated Please use AV.init(), you can set the region of server .
        */
        function useAVCloudUS(): void;

        /**
         * Call this method to set production environment variable.
         * @function AV.setProduction
         * @param {Boolean} production True is production environment,and
         *  it's true by default.
         */
        function setProduction(): void;

        /**
         * A builder to generate sort string for app searching.For example:
         * <pre><code>
         *   var builder = new AV.SearchSortBuilder();
         *   builder.ascending('key1').descending('key2','max');
         *   var query = new AV.SearchQuery('Player');
         *   query.sortBy(builder);
         *   query.find().then ...
         * </code></pre>
         * @class
         * @since 0.5.1
         */
        class SearchSortBuilder {

            /**
             * Sorts the results in ascending order by the given key and options.
             *
             * @param {String} key The key to order by.
             * @param {String} mode The sort mode, default is 'avg', you can choose
             *                  'max' or 'min' too.
             * @param {String} missing The missing key behaviour, default is 'last',
             *                  you can choose 'first' too.
             * @return {AV.SearchSortBuilder} Returns the builder, so you can chain this call.
             */
            ascending(key: string, mode?: "avg" | "max" | "min", missing?: "last" | "first"): SearchSortBuilder;

            /**
             * Sorts the results in descending order by the given key and options.
             *
             * @param {String} key The key to order by.
             * @param {String} mode The sort mode, default is 'avg', you can choose
             *                  'max' or 'min' too.
             * @param {String} missing The missing key behaviour, default is 'last',
             *                  you can choose 'first' too.
             * @return {AV.SearchSortBuilder} Returns the builder, so you can chain this call.
             */
            descending(key: string, mode?: "avg" | "max" | "min", missing?: "last" | "first"): SearchSortBuilder;

            /**
             * Add a proximity based constraint for finding objects with key point
             * values near the point given.
             * @param {String} key The key that the AV.GeoPoint is stored in.
             * @param {AV.GeoPoint} point The reference AV.GeoPoint that is used.
             * @param {Object} options The other options such as mode,order, unit etc.
             * @return {AV.SearchSortBuilder} Returns the builder, so you can chain this call.
             */
            whereNear(key: string, point: GeoPoint, options?: SearchSortBuilder.OrderOption): SearchSortBuilder;

            /**
             * Build a sort string by configuration.
             * @return {String} the sort string.
             */
            build(): string;
        }

        namespace SearchSortBuilder {
            interface OrderOption {
                order: "asc" | "desc";
                mode: "avg" | "max" | "min";
                unit: "km" | "mile"
            }
        }

        /**
         * App searching query.Use just like AV.Query:
         * <pre><code>
         *   var query = new AV.SearchQuery('Player');
         *   query.queryString('*');
         *   query.find().then(function(results) {
         *     console.log('Found %d objects', query.hits());
         *     //Process results
         *   });
         *
         * </code></pre>
         * Visite <a href='https://leancloud.cn/docs/app_search_guide.html'>App Searching Guide</a>
         * for more details.
         * @class
         * @since 0.5.1
         *
         */
        class SearchQuery extends Query {


            /**
             * Sets the sid of app searching query.Default is null.
             * @param {String} sid  Scroll id for searching.
             * @return {AV.SearchQuery} Returns the query, so you can chain this call.
             */
            sid(sid: string): SearchQuery;

            /**
             * Sets the query string of app searching.
             * @param {String} q  The query string.
             * @return {AV.SearchQuery} Returns the query, so you can chain this call.
             */
            queryString(q: string): SearchQuery;

            /**
             * Sets the highlight fields. Such as
             * <pre><code>
             *   query.highlights('title');
             *   //or pass an array.
             *   query.highlights(['title', 'content'])
             * </code></pre>
             * @param {Array} highlights a list of fields.
             * @return {AV.SearchQuery} Returns the query, so you can chain this call.
             */
            highlights(highlights: string[]): SearchQuery;

            /**
             * Sets the sort builder for this query.
             * @see AV.SearchSortBuilder
             * @param { AV.SearchSortBuilder} builder The sort builder.
             * @return {AV.SearchQuery} Returns the query, so you can chain this call.
             *
             */
            sortBy(builder: SearchSortBuilder): SearchQuery;

            /**
             * Returns the number of objects that match this query.
             * @return {Number}
             */
            hits(): number;

            /**
             * Returns true when there are more documents can be retrieved by this
             * query instance, you can call find function to get more results.
             * @see AV.SearchQuery#find
             * @return {Boolean}
             */
            hasMore(): boolean;

            /**
             * Reset current query instance state(such as sid, hits etc) except params
             * for a new searching. After resetting, hasMore() will return true.
             */
            reset(): void;

            /**
             * Retrieves a list of AVObjects that satisfy this query.
             * Either options.success or options.error is called when the find
             * completes.
             *
             * @see AV.Query#find
             * @param {Object} options A Backbone-style options object.
             * @return {AV.Promise} A promise that is resolved with the results when
             * the query completes.
             */
            find<T>(options?: SuccessFailureOptions): Promise<T>;
        }

        /**
         * Contains functions to deal with Status in AVOS Cloud.
         * @name AV.Status
         * @namespace
         */
        class Status {

            /**
             * Send  a status to current signined user's followers.For example:
             * <p><pre>
             *     var status = new AVStatus('image url', 'a message');
             *     AV.Status.sendStatusToFollowers(status).then(function(){
             *              //send status successfully.
             *      }, function(err){
             *             //an error threw.
             *             console.dir(err);
             *      });
             * </pre></p>
             * @since 0.3.0
             * @param {AV.Status} status  A status object to be send to followers.
             * @param {Object} options An optional Backbone-like options object with
             *     success and error callbacks that will be invoked once the iteration
             *     has finished.
             * @return {AV.Promise} A promise that is fulfilled when the send
             *     completes.
             */
            static sendStatusToFollowers<T>(status: Status, options?: SuccessFailureOptions): Promise<T>;

            /**
             * <p>Send  a status from current signined user to other user's private status inbox.</p>
             * <p>For example,send a private status to user '52e84e47e4b0f8de283b079b':<br/>
             * <pre>
             *    var status = new AVStatus('image url', 'a message');
             *     AV.Status.sendPrivateStatus(status, '52e84e47e4b0f8de283b079b').then(function(){
             *              //send status successfully.
             *      }, function(err){
             *             //an error threw.
             *             console.dir(err);
             *      });
             * </pre></p>
             * @since 0.3.0
             * @param {AV.Status} status  A status object to be send to followers.
             * @param {} target The target user or user's objectId.
             * @param {Object} options An optional Backbone-like options object with
             *     success and error callbacks that will be invoked once the iteration
             *     has finished.
             * @return {AV.Promise} A promise that is fulfilled when the send
             *     completes.
             */
            static sendPrivateStatus<T>(status: Status, target: User | string, options?: SuccessFailureOptions): Promise<T>;

            /**
             * Count unread statuses in someone's inbox.For example:<br/>
             * <p><pre>
             *  AV.Status.countUnreadStatuses(AV.User.current()).then(function(response){
             *    console.log(response.unread); //unread statuses number.
             *    console.log(response.total);  //total statuses number.
             *  });
             * </pre></p>
             * @since 0.3.0
             * @param {Object} source The status source.
             * @return {AV.Query} The query object for status.
             * @return {AV.Promise} A promise that is fulfilled when the count
             *     completes.
             */
            static countUnreadStatuses<T>(owner: User | string): Promise<T>;

            /**
             * Create a status query to find someone's published statuses.For example:<br/>
             * <p><pre>
             *   //Find current user's published statuses.
             *   var query = AV.Status.statusQuery(AV.User.current());
             *   query.find().then(function(statuses){
             *      //process statuses
             *   });
             * </pre></p>
             * @since 0.3.0
             * @param {Object} source The status source.
             * @return {AV.Query} The query object for status.
             */
            static statusQuery(source: Status): Query;

            /**
             * Create a inbox status query to find someone's inbox statuses.For example:<br/>
             * <p><pre>
             *   //Find current user's default inbox statuses.
             *   var query = AV.Status.inboxQuery(AV.User.current());
             *   //find the statuses after the last message id
             *   query.sinceId(lastMessageId);
             *   query.find().then(function(statuses){
             *      //process statuses
             *   });
             * </pre></p>
             * @since 0.3.0
             * @param {Object} owner The inbox's owner
             * @param {String} inboxType The inbox type,'default' by default.
             * @return {AV.InboxQuery} The inbox query object.
             * @see AV.InboxQuery
             */
            static inboxQuery(owner, inboxType: string): Query;



            constructor(imageUrl: string, message: string);
            /**
             * Gets the value of an attribute in status data.
             * @param {String} attr The string name of an attribute.
             */
            get(): any;
            /**
             * Sets a hash of model attributes on the status data.
             * @param {String} key The key to set.
             * @param {} value The value to give it.
             */
            set(key: string, value: any): void;
            /**
             * Destroy this status,then it will not be avaiable in other user's inboxes.
             * @param {Object} options An optional Backbone-like options object with
             *     success and error callbacks that will be invoked once the iteration
             *     has finished.
             * @return {AV.Promise} A promise that is fulfilled when the destroy
             *     completes.
             */
            destroy<T>(options?: SuccessFailureOptions): Promise<T>;
            /**
              * Cast the AV.Status object to an AV.Object pointer.
              * @return {AV.Object} A AV.Object pointer.
              */
            toObject(): Object;

            /**
             * Send  a status by a AV.Query object.
             * <p>For example,send a status to male users:<br/><pre>
             *     var status = new AVStatus('image url', 'a message');
             *     status.query = new AV.Query('_User');
             *     status.query.equalTo('gender', 'male');
             *     status.send().then(function(){
             *              //send status successfully.
             *      }, function(err){
             *             //an error threw.
             *             console.dir(err);
             *      });
             * </pre></p>
             * @since 0.3.0
             * @param {Object} options An optional Backbone-like options object with
             *     success and error callbacks that will be invoked once the iteration
             *     has finished.
             * @return {AV.Promise} A promise that is fulfilled when the send
             *     completes.
             */
            send<T>(options?: SuccessFailureOptions): Promise<T>
        }

        /**
         * <p>AV.InboxQuery defines a query that is used to fetch somebody's inbox statuses.</p>
         * @see AV.Status#inboxQuery
         * @class
         */
        class InboxQuery extends Query {

            /**
             * Sets the messageId of results to skip before returning any results.
             * This is useful for pagination.
             * Default is zero.
             * @param {Number} n the mesage id.
             * @return {AV.InboxQuery} Returns the query, so you can chain this call.
             */
            sinceId(id: number): InboxQuery;

            /**
             * Sets the maximal messageId of results。
             * This is useful for pagination.
             * Default is zero that is no limition.
             * @param {Number} n the mesage id.
             * @return {AV.InboxQuery} Returns the query, so you can chain this call.
             */
            maxId(id: number): InboxQuery;

            /**
             * Sets the owner of the querying inbox.
             * @param {Object} owner The inbox owner.
             * @return {AV.InboxQuery} Returns the query, so you can chain this call.
             */
            owner(owner): InboxQuery;

            /**
             * Sets the querying inbox type.default is 'default'.
             * @param {Object} owner The inbox type.
             * @return {AV.InboxQuery} Returns the query, so you can chain this call.
             */
            inboxType(type: string): InboxQuery;
        }
    }

    export = AV;
}