function makeHelper(data) {
    /** @type {LB.DataForScript} */
    const ddd = data

    /**
     * this code is used for defining helper functions
     */

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
     * @param {LB.File} file
     * @param {LB.Entity} entity
     * @param {string} action
     * @param {number} directoryId
     * @returns {string}
     */
    function getClassName(file, entity, action, directoryId = 0) {
        // change dependency file directory. e.g. Event file
        if (directoryId) {
            file = {...file, directoryId}
        }
        ddd.dependencyzz.push(ddd.tree.getClassFullName(file, entity, action))
        return ddd.tree.getClassName(file, entity, action)
    }

    /**
     *
     * @param {LB.ColumnWithAlias[]} columnzz
     * @returns {[LB.ColumnWithAlias[], [string,string][]]}
     */
    function getColumnzzAndReferencezz(columnzz) {
        const columnmap = new Map(columnzz.map(item => [item.id, item]))

        const fks = new Set()
        const entitymap = ddd.makeIdNameMap(ddd.db.tables.Entity)
        const rzz = ddd.db.tables.Relation
            .filter(item => columnmap.has(item.column1Id))
            .map(item => {
                fks.add(item.column1Id)
                return [columnmap.get(item.column1Id)?.alias, entitymap.get(item.entity0Id)]
            })

        const czz = columnzz.filter(item => !fks.has(item.id))
        return [czz, rzz]
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
     * @returns {LB.ColumnWithAlias[]}
     */
    function getRequestColumnzz() {
        const request = ddd.db.tables.Request.find(item => item.id === ddd.ma.requestId)
        if (request === undefined) {
            return []
        }

        const tf = ddd.db.tables.TypeFormat.find(item => item.ownerRequestId === request.id)
        if (tf === undefined) {
            return []
        }
        const zz = ddd.getTypeFormatColumnzz(tf, [], ddd.db)
        zz.forEach(function (column) {
            column.constraintzz = getColumnConstraintzz(column)
        })
        return zz
    }

    /**
     *
     * @param {boolean} excludeId
     * @returns {LB.ColumnWithAlias[]}
     */
    function getResponseContentColumnzz(excludeId = false) {
        const marzz = ddd.db.tables.ModuleActionResponse.filter(item => item.status === '200' && item.moduleActionId === ddd.ma.id)
        if (marzz.length === 0) {
            return []
        }
        const set = new Set(marzz.map(item => item.responseId))
        const response = ddd.db.tables.Response.find(item => set.has(item.id))
        if (response === undefined) {
            return []
        }

        return ddd.getResponseContentColumnzz(response.id, ddd.db).filter(item => !(item.name === 'id' && excludeId))
    }

    /**
     * get PHP type of field in request
     * @param {LB.Column} column
     * @returns {string}
     */
    function makeColumnType(column) {
        if (['array', 'object'].includes(column.cast)) {
            return 'array'
        }
        const found = ddd.db.tables.DoctrineColumnType.find((item) => item.name === column.type)
        if (found) {
            if (column.nullable) {
                return '?' + found.phpType
            }
            return found.phpType
        }

        return "mixed"
    }

    function makePermissionzz() {
        const ci = ddd.db.tables.Collection.find(item => item.name === 'ModuleAction')?.id
        const actionMap = new Map(ddd.db.tables.CollectionItem
            .filter(item => item.collectionId === ci)
            .map(item => [item.id, item.name])
        )
        const entityMap = new Map(ddd.db.tables.Entity.map(item => [item.id, item]))
        const moduleMap = new Map(ddd.db.tables.Module.map(item => [item.id, item]))
        const permissionzz = ddd.db.tables.ModuleAction.map(function (ma) {
            const action = actionMap.get(ma.collectionItemId)
            const entity = entityMap.get(ma.entityId)
            const module = moduleMap.get(ma.moduleId)
            return {
                permission: action + entity?.name,
                entity: entity?.name,
                module: module?.name,
            }
        })
        return permissionzz
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
     * some property is undefined in DataForScript
     * e.g.
     * when running code, not generating file, the `ddd.file` is undefined
     */
    if (ddd.file) {
    }

    ddd.DirectoryIdEnum = {
        AdminCreateMany: 100,
        AdminCreateOne: 110,
        AdminDeleteMany: 120,
        AdminDeleteOne: 130,
        AdminReadMany: 140,
        AdminReadOne: 150,
        AdminReadPage: 180,
        AdminUpdateMany: 160,
        AdminUpdateOne: 170,

        CreateMany: 400,
        CreateOne: 410,
        DeleteMany: 420,
        DeleteOne: 430,
        ReadMany: 440,
        ReadOne: 450,
        ReadPage: 480,
        UpdateMany: 460,
        UpdateOne: 470,
    }

    /**
     * do not delete ddd.helper
     */
    ddd.helper = {
        findByName,
        findFile,
        findEntity,
        getClassName,
        getColumnzzAndReferencezz,
        getItemzzInCollection,
        getParameterzz,
        getRequestColumnzz,
        getResponseContentColumnzz,
        makeColumnType,
        makePermissionzz,
        makeRouteText,
    }
}
