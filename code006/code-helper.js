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
        if (parent == null) {
            return []
        }
        return ddd.db.tables.CollectionItem.filter((item) => item.collectionId === parent.id,)
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
    function getRequestColumnzz(requestId = ddd.ma.requestId, forRequestFile = false) {
        const request = ddd.db.tables.Request.find(item => item.id === requestId)
        if (request == null) {
            return []
        }

        const tf = ddd.db.tables.TypeFormat.find(item => item.ownerRequestId === request.id)
        if (tf == null) {
            return []
        }

        const zz = ddd.getTypeFormatColumnzz(tf, [], ddd.db)
        zz.forEach(function (column) {
            if (forRequestFile) {
                column.constraintzz = getColumnConstraintzz(column)
            }
            column.phpType = makeColumnType(column, forRequestFile)
        })
        return zz
    }

    /**
     * return content Columnzz of Response (not wrapper)
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
        if (response == null) {
            return []
        }

        return ddd.getResponseContentColumnzz(response.id, ddd.db).filter(item => !(item.name === 'Id' && excludeId))
    }

    /**
     * @param {LB.ColumnWithAlias} column
     */
    function makeColumnValueFromRequest(column) {
        const index = column.cast.indexOf('::')
        if (index > 0) {
            return column.cast.substring(0, index) + `::from($Request->${column.alias})`
        }

        if (column.type === 'datetime' || column.type === 'date') {
            return `Carbon::parse($Request->${column.alias})`
        }

        return '$Request->' + column.alias
    }

    /**
     * get PHP type of field in request
     * @param {LB.Column} column
     * @param {boolean} forRequestFile
     * @returns {string}
     */
    function makeColumnType(column, forRequestFile = false) {

        if (forRequestFile) {
            if (column.type === 'array') {
                return 'array<int, mixed>'
            }
            if (column.type === 'datetime') {
                return 'string'
            }
        }

        if (column.cast) {
            const found = getItemzzInCollection('ModelFieldTypeCast').find(item => item.name === column.cast)
            if (found) {
                if (column.nullable) {
                    return '?' + found.value
                }
                return found.value
            }

            const index = column.cast.indexOf('::')
            if (index > 0) {
                if (forRequestFile) {
                    return 'int|string'
                }
                return column.cast.substring(0, index)
            }
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

    /**
     * @param {LB.ColumnConstraint} item
     * @returns {string}
     */
    function makeConstraintText(item) {
        if (item.name === "Rule::") {
            return item.name + item.parameter
        }

        if (item.parameter) {
            return `'${item.name}:${item.parameter}'`
        }

        return `'${item.name}'`
    }

    function makePermissionzz() {
        const entityMap = new Map(ddd.db.tables.Entity.map(item => [item.id, item]))
        const moduleMap = new Map(ddd.db.tables.Module.map(item => [item.id, item]))
        return ddd.db.tables.ModuleAction.map(function (ma) {
            const entity = entityMap.get(ma.entityId)
            const module = moduleMap.get(ma.moduleId)
            return {
                permission: ma.name + entity?.name, entity: entity?.name, module: module?.name,
            }
        })
    }

    /**
     *
     * @param {string} moduleName
     * @returns {string}
     */
    function makeRouteText(moduleName) {
        const module = ddd.db.tables.Module.find(item => item.name === moduleName)
        if (module == null) {
            throw new Error(moduleName + ' not found')
        }

        ddd.module = module

        /** @type {Map<number, LB.ModuleAction>} */
        const mam = new Map()
        ddd.db.tables.ModuleAction.forEach(item => mam.set(item.id, item))

        /** @type {Map<number, LB.File>} */
        const fm = new Map()
        ddd.db.tables.File.forEach(item => fm.set(item.id, item))

        /** @type {Map<number, LB.Entity>} */
        const sm = new Map()
        ddd.db.tables.Entity.forEach(item => sm.set(item.id, item))

        let entityId = 0
        const textzz = []
        ddd.db.tables.Path.sort((aa, bb) => aa.name.localeCompare(bb.name))
        ddd.db.tables.Path
            .forEach(function (path) {
                if (path.moduleId === module.id) {
                    // ok
                } else {
                    return
                }

                const linezz = []
                const ma = mam.get(path.moduleActionId)
                if (ma == null) {
                    return
                }

                const file = ma.filezz.find(item => item.name.includes('Controller'))
                if (file == null) {
                    return
                }

                const entity = sm.get(ma.entityId)
                if (entity == null) {
                    return
                }
                if (entity.id === 1) {
                    return
                }

                const cn = ddd.tree.getClassFullName(file, entity, ma.name)
                let text = `    Route::${path.method}('${path.name}', \\${cn}::class)`
                if (path.middlewarezz.length) {
                    text += `->middleware(['${path.middlewarezz.join("', '")}'])`
                }
                if (ma.routeName) {
                    text += `->name('${ma.routeName}')`
                }
                linezz.push(text + ';')

                if (linezz.length) {
                    if (entityId !== path.entityId) {
                        entityId = path.entityId
                        textzz.push('')
                    }
                    linezz.sort((aa, bb) => aa.localeCompare(bb))
                    textzz.push(...linezz, '')
                }
            })

        return textzz.join('\n').replaceAll('\n\n', '\n')
    }


    /**
     * some property is undefined in DataForScript
     * e.g.
     * when running code, not generating file, the `ddd.file` is undefined
     */
    if (ddd.file) {
    }

    ddd.DirectoryIdEnum = {
        CreateMany: 110,
        CreateOne: 120,
        DeleteMany: 130,
        DeleteOne: 140,
        ReadAll: 151,
        ReadCurrent: 161,
        ReadHome: 152,
        ReadMany: 150,
        ReadOne: 160,
        ReadPage: 170,
        UpdateMany: 180,
        UpdateOne: 190,
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
        makeColumnValueFromRequest,
        getItemzzInCollection,
        getParameterzz,
        getRequestColumnzz,
        getResponseContentColumnzz,
        makeColumnType,
        makeConstraintText,
        makePermissionzz,
        makeRouteText,
    }
}
