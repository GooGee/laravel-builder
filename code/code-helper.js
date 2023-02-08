function makeHelper(data) {
    /** @type {LB.DataForScript} */
    const ddd = data

    /**
     * this code is used for defining helper functions
     */

    /**
     * @template T
     * @param {T[]} itemzz
     * @param {number} id
     * @return {T|undefined}
     */
    function find(itemzz, id) {
        return itemzz.find((item) => item.id === id)
    }

    /**
     * @template T
     * @param {T[]} itemzz
     * @param {string} name
     * @return {T|undefined}
     */
    function findByName(itemzz, name) {
        return itemzz.find((item) => item.name === name)
    }

    /**
     *
     * @param {string} name
     * @returns {LB.File}
     */
    function findFile(name) {
        return findByName(ddd.db.tables.File, name)
    }

    /**
     *
     * @param {string} name
     * @returns {LB.Entity}
     */
    function findEntity(name) {
        return findByName(ddd.db.tables.Entity, name)
    }

    /**
     *
     * @param {string} file
     * @param {string} entity
     * @param {string} action
     * @returns {string}
     */
    function getClassNameByFileEntity(file, entity, action = ddd.action) {
        return ddd.tree.getClassName(findFile(file), findEntity(entity), action)
    }

    /**
     *
     * @param {string} file
     * @param {string} entity
     * @param {string} action
     * @returns {string}
     */
    function getClassFullNameByFileEntity(file, entity, action = ddd.action) {
        return ddd.tree.getClassFullName(findFile(file), findEntity(entity), action)
    }

    /**
     *
     * @param {LB.WuColumn} column
     * @returns {LB.ColumnConstraint[]}
     */
    function getColumnConstraintzz(column) {
        const set = new Set(ddd.db.tables.WuColumnConstraint
            .filter(item => item.wuColumnId === column.wuColumnId)
            .map(item => item.columnConstraintId))
        return ddd.db.tables.ColumnConstraint.filter(item => set.has(item.id))
    }

    /**
     *
     * @returns {string[]}
     */
    function getDependencyzz() {
        const name = `file-${ddd.file.id}.txt`
        if (name in ddd.fileMap) {
            const text = ddd.fileMap[name]
            const set = new Set([
                ...getFileDependencyzz(text.matchAll(/getClassName\(helper.findFile\(['"]([A-Za-z][A-Za-z0-9_]*)['"]\)/g)),
                ...getFileEntityDependencyzz(text.matchAll(/getClassNameByFileEntity\(['"]([A-Za-z][A-Za-z0-9_]*)['"] *, *['"]([A-Za-z][A-Za-z0-9_]*)['"]/g)),
            ])
            if (set.size) {
                return Array.from(set.keys()).sort((aa, bb) => aa.localeCompare(bb))
            }
        }
        return []

        /**
         *
         * @param {IterableIterator<RegExpMatchArray>} zz
         * @returns {string[]}
         */
        function getFileDependencyzz(zz) {
            const set = new Set(Array.from(zz).map((item) => item[1]))
            if (set.size === 0) {
                return []
            }
            return Array.from(set).map((item) =>
                ddd.tree.getClassFullName(findFile(item), ddd.entity, ddd.action),
            )
        }

        /**
         *
         * @param {IterableIterator<RegExpMatchArray>} zz
         * @returns {string[]}
         */
        function getFileEntityDependencyzz(zz) {
            const set = new Set(Array.from(zz).map((item) =>
                ddd.tree.getClassFullName(findFile(item[1]), findEntity(item[2]), ddd.action)
            ))
            if (set.size === 0) {
                return []
            }
            return Array.from(set.keys())
        }
    }

    /**
     *
     * @param {string} name
     * @returns {LB.CollectionItem[]}
     */
    function getItemzzInCollection(name) {
        const parent = ddd.db.tables.Collection.find((item) => item.name === name)
        if (parent === undefined) {
            return []
        }
        return ddd.db.tables.CollectionItem.filter(
            (item) => item.collectionId === parent.id,
        )
    }

    /**
     *
     * @return {LB.Column[]}
     */
    function getParameterzz() {
        const map = new Map(ddd.db.tables.ParameterMap
            .filter(item => item.requestId === ddd.ma.requestId)
            .map(item => [item.columnId, item]))
        const zz = ddd.db.tables.Column.filter(item => map.has(item.id))
        zz.forEach(function (column) {
            const item = map.get(column.id)
            if (item.alias) {
                column.alias = item.alias
            } else {
                column.alias = column.name
            }
            column.constraintzz = ddd.db.tables.ColumnConstraint.filter(item => item.columnId === column.id)
        })
        return zz
    }

    /**
     *
     * @returns {LB.Column[]}
     */
    function getRequestColumnzz() {
        const request = ddd.db.tables.Request.find(item => item.id === ddd.ma.requestId)
        if (request === undefined) {
            return []
        }

        const wczz = getWuColumnzz(request.tf.targetId)
        const zz = makeAliasColumnzz(wczz)
        zz.forEach(function (column) {
            column.constraintzz = getColumnConstraintzz(column)
        })
        return zz
    }

    /**
     *
     * @returns {LB.Column[]}
     */
    function getResponseColumnzz() {
        const mar = ddd.db.tables.ModuleActionResponse
            .find(item => item.moduleActionId === ddd.ma.id && item.status === '200')
        if (mar === undefined) {
            return []
        }

        const response = ddd.db.tables.Response.find(item => item.id === mar.responseId)
        if (response === undefined) {
            return []
        }

        let wi = response.tf.targetId
        if (response.tf.argumentzz.length) {
            wi = response.tf.argumentzz[0].targetId
        }
        const wczz = getWuColumnzz(wi)
        return makeAliasColumnzz(wczz)
    }

    /**
     *
     * @param {number} parentId
     * @param {Set<number>} iSet
     * @returns {LB.WuChild[]}
     */
    function getWuChildzz(parentId, iSet) {
        if (iSet.has(parentId)) {
            return []
        }

        iSet.add(parentId)
        const childzz = ddd.db.tables.WuChild.filter(item => item.wuId === parentId)
        const zz = [...childzz]
        childzz.forEach(item => {
            const czz = getWuChildzz(item.id, iSet)
            if (czz.length) {
                zz.push(...czz)
            }
        })
        return zz
    }

    /**
     *
     * @param {number} wuId
     * @returns {LB.WuColumn[]}
     */
    function getWuColumnzz(wuId) {
        const childzz = getWuChildzz(wuId, new Set)
        const wiSet = new Set(childzz.map(item => item.tf.targetId))
        wiSet.add(wuId)
        return ddd.db.tables.WuColumn.filter(item => wiSet.has(item.wuId))
    }

    /**
     * clone Columns with alias
     * @param {LB.WuColumn[]} wczz
     * @returns {LB.Column[]}
     */
    function makeAliasColumnzz(wczz) {
        /** @type {Map<number, LB.Column>} */
        const map = new Map()
        ddd.db.tables.Column.forEach(item => map.set(item.id, item))
        return wczz.map(item => {
            const column = map.get(item.columnId)
            if (column) {
                let alias = column.name
                if (item.alias) {
                    alias = item.alias
                }
                return {...item, ...column, alias, wuColumnId: item.id}
            }
            return undefined
        })
    }

    /**
     *
     * @param {string} moduleName
     * @returns {string}
     */
    function makeRouteText(moduleName) {
        const module = ddd.db.tables.Module.find(item => item.name === moduleName)
        if (module === undefined) {
            throw new Error(moduleName + ' not found')
        }

        ddd.module = module

        /** @type {Map<number, LB.PathMethod[]>} */
        const pmzzm = new Map()
        ddd.db.tables.PathMethod.forEach(item => {
            let found = pmzzm.get(item.pathId)
            if (found === undefined) {
                found = []
                pmzzm.set(item.pathId, found)
            }
            found.push(item)
        })

        /** @type {Map<number, LB.ModuleAction>} */
        const mam = new Map()
        ddd.db.tables.ModuleAction.forEach(item => mam.set(item.id, item))

        /** @type {Map<number, LB.File>} */
        const fm = new Map()
        ddd.db.tables.File.forEach(item => fm.set(item.id, item))

        /** @type {Map<number, LB.Entity>} */
        const sm = new Map()
        ddd.db.tables.Entity.forEach(item => sm.set(item.id, item))

        /** @type {Map<number, LB.File>} */
        const mafm = new Map()
        ddd.db.tables.ModuleActionFile.forEach(item => {
            const file = fm.get(item.fileId)
            if (file === undefined) {
                return
            }
            if (file.name.includes('Controller')) {
                mafm.set(item.moduleActionId, file)
            }
        })

        const textzz = []
        ddd.db.tables.Path.sort((aa, bb) => aa.name.localeCompare(bb.name))
        ddd.db.tables.Path
            .forEach(function (path) {
                if (path.moduleId === module.id) {
                    // ok
                } else {
                    return
                }
                const pmzz = pmzzm.get(path.id)
                if (pmzz === undefined) {
                    return
                }

                const linezz = []
                pmzz.forEach(function (pm) {
                    const ma = mam.get(pm.moduleActionId)
                    if (ma === undefined) {
                        return
                    }

                    const old = mafm.get(ma.id)
                    if (old === undefined) {
                        return
                    }
                    const file = {...old}

                    const entity = sm.get(ma.entityId)
                    if (entity === undefined) {
                        return
                    }

                    // the module directory
                    file.directoryId = ma.directoryId
                    const cn = ddd.tree.getClassFullName(file, entity, '')
                    let text = `    Route::${pm.method}('${path.name}', \\${cn}::class)`
                    if (pm.middlewarezz.length) {
                        text += `->middleware(['${pm.middlewarezz.join("', '")}'])`
                    }
                    linezz.push(text + ';')
                })

                if (linezz.length) {
                    linezz.sort((aa, bb) => aa.localeCompare(bb))
                    textzz.push(...linezz, '')
                }
            })
        return textzz.join('\n')
    }


    /**
     * do not call any function
     * some property is undefined in DataForScript
     * e.g.
     * when running code, not generating file, the `ddd.file` is undefined
     */
    if (ddd.file) {
        ddd.dependencyzz = getDependencyzz()
    }

    /**
     * do not delete ddd.helper
     */
    ddd.helper = {
        find,
        findByName,
        findFile,
        findEntity,
        getClassNameByFileEntity,
        getClassFullNameByFileEntity,
        getItemzzInCollection,
        getParameterzz,
        getRequestColumnzz,
        getResponseColumnzz,
        getWuChildzz,
        getWuColumnzz,
        makeAliasColumnzz,
        makeRouteText,
    }
}
