function makeHelper(data) {
    /** @type {DataForScript} */
    const ddd = data

    /**
     * this code is used for defining helper functions
     */

    /**
     *
     * @param {string} name
     * @returns {File}
     */
    function findFile(name) {
        return ddd.db.tables.File.find((item) => item.name === name)
    }

    /**
     *
     * @param {string} action
     * @param {number} schemaId
     * @returns {ModuleAction | undefined}
     */
    function findModuleAction(action, schemaId) {
        const ci = ddd.helper.getItemzzInCollection("ModuleAction").find(item => item.name === action)
        return ddd.db.tables.ModuleAction.find(item => item.collectionItemId === ci.id && item.schemaId === schemaId)
    }

    /**
     *
     * @param {string} name
     * @returns {Schema}
     */
    function findSchema(name) {
        return ddd.db.tables.Schema.find((item) => item.name === name)
    }

    /**
     *
     * @param file
     * @param schema
     * @returns {string}
     */
    function getClassNameByFileSchema(file, schema) {
        return ddd.tree.getClassName(findFile(file), findSchema(schema))
    }

    /**
     *
     * @param file
     * @param schema
     * @returns {string}
     */
    function getClassFullNameByFileSchema(file, schema) {
        return ddd.tree.getFullClassName(findFile(file), findSchema(schema))
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
                ...getFileSchemaDependencyzz(text.matchAll(/getClassNameByFileSchema\(['"]([A-Za-z][A-Za-z0-9_]*)['"] *, *['"]([A-Za-z][A-Za-z0-9_]*)['"]/g)),
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
                ddd.tree.getFullClassName(findFile(item), ddd.schema),
            )
        }

        /**
         *
         * @param {IterableIterator<RegExpMatchArray>} zz
         * @returns {string[]}
         */
        function getFileSchemaDependencyzz(zz) {
            const set = new Set(Array.from(zz).map((item) =>
                ddd.tree.getFullClassName(findFile(item[1]), findSchema(item[2]))
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
     * @returns {CollectionItem[]}
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
     * @param {ModuleAction} ma
     * @returns {Column[]}
     */
    function getRequestColumnzz(ma) {
        const wi = ma.request.reference.targetId
        const wu = ddd.db.tables.Wu.find(item => item.id === wi)
        if (wu === undefined) {
            return []
        }

        const wczz = getWuColumnzz(wi)
        return makeAliasColumnzz(wczz)
    }

    /**
     *
     * @param {ModuleAction} ma
     * @returns {Column[]}
     */
    function getResponseColumnzz(ma) {
        if (ma.responsezz.length === 0) {
            return ddd.db.tables.Column
                .filter((item) => item.schemaId === ma.schemaId && item.inTable && !item.wo)
                .map(item => makeAliasColumn(item))
        }

        const wi = ma.responsezz[0].reference.targetId
        const wu = ddd.db.tables.Wu.find(item => item.id === wi)
        if (wu === undefined) {
            return []
        }

        const wczz = getWuColumnzz(wi)
        return makeAliasColumnzz(wczz)
    }

    /**
     *
     * @param {number} parentId
     * @param {Set<number>} iSet
     * @returns {WuChild[]}
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
     * @returns {WuColumn[]}
     */
    function getWuColumnzz(wuId) {
        const childzz = getWuChildzz(wuId, new Set)
        const wiSet = new Set(childzz.map(item => item.reference.targetId))
        wiSet.add(wuId)
        return ddd.db.tables.WuColumn.filter(item => wiSet.has(item.wuId))
    }

    /**
     * clone Column with alias
     * @param {Column} column
     * @returns {Column}
     */
    function makeAliasColumn(column) {
        let alias = column.name
        if (column.alias) {
            alias = column.alias
        }
        return {...column, alias}
    }

    /**
     * clone Columns with alias
     * @param {WuColumn[]} wczz
     * @returns {Column[]}
     */
    function makeAliasColumnzz(wczz) {
        /** @type {Map<number, Column>} */
        const map = new Map()
        ddd.db.tables.Column.forEach(item => map.set(item.id, item))
        return wczz.map(item => {
            const column = map.get(item.columnId)
            if (column) {
                return makeAliasColumn(column)
            }
            return undefined
        })
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
        findFile,
        findModuleAction,
        findSchema,
        getClassNameByFileSchema,
        getClassFullNameByFileSchema,
        getItemzzInCollection,
        getRequestColumnzz,
        getResponseColumnzz,
        getWuChildzz,
        getWuColumnzz,
        makeAliasColumnzz,
    }
}
