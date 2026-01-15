function run(data) {
    /** @type {LB.DataForScript} */
    const ddd = data

    /**
     * this code is used for generating column validation constraint
     */

    const ColumnConstraintzz = []
    ddd.result = ColumnConstraintzz

    const indexzz = ddd.db.tables.Index.filter(item => item.entityId === ddd.entity.id && item.type === 'unique')
    if (indexzz.length) {
        indexzz.forEach(item => {
            const iczz = ddd.db.tables.IndexColumn.filter(ic => ic.indexId === item.id)
            if (iczz.length === 1) {
                if (ddd.db.tables.ColumnConstraint.find(cc => cc.columnId === iczz[0].columnId && cc.name === 'unique')) {
                    return
                }
                ColumnConstraintzz.push(makeConstraint('unique', iczz[0].columnId, ddd.entity.name))
            }
        })
    }

    const relationzz = ddd.db.tables.Relation.filter(item => item.entity1Id === ddd.entity.id)
    const entityMap = new Map(ddd.db.tables.Entity.map(item => [item.id, item]))
    const cienm = new Map(relationzz.map(item => [item.column1Id, entityMap.get(item.entity0Id)]))

    if (ddd.DataMap.Column && ddd.DataMap.OnlyOne) {
        setConstraint(ddd.DataMap.Column)
    } else {
        ddd.db.tables.Column
            .filter(item => item.entityId === ddd.entity.id && (item.inTable && item.type !== 'object'))
            .forEach(setConstraint)
    }

    /**
     *
     * @param {LB.Column} column
     */
    function setConstraint(column) {
        if (ddd.db.tables.ColumnConstraint.find(item => item.columnId === column.id)) {
            // already exists
            return
        }

        if (column.nullable) {
            ColumnConstraintzz.push(makeConstraint('nullable', column.id))
        }
        ColumnConstraintzz.push(makeConstraint('present', column.id))

        const entity = cienm.get(column.id)
        if (entity) {
            ColumnConstraintzz.push(makeConstraint('exists', column.id, (entity.table ? entity.table : entity.name) + ',id'))
        }

        if (column.cast.includes('::')) {
            ColumnConstraintzz.push(makeConstraint('Rule::', column.id, `enum(${column.cast})`))
            return
        }

        if (column.type === 'boolean') {
            ColumnConstraintzz.push(makeConstraint('boolean', column.id))
            return
        }

        if (['smallint', 'integer', 'bigint'].includes(column.type)) {
            ColumnConstraintzz.push(makeConstraint('integer', column.id))
            const parameter = column.name === 'Id' || column.name.includes('Id') ? '1' : '0'
            ColumnConstraintzz.push(makeConstraint('min', column.id, parameter))
            return
        }

        if (['decimal', 'float'].includes(column.type)) {
            ColumnConstraintzz.push(makeConstraint('numeric', column.id))
            return
        }

        if (column.type.startsWith('date')) {
            ColumnConstraintzz.push(makeConstraint('date', column.id))
            return
        }

        if (['string', 'text'].includes(column.type)) {
            ColumnConstraintzz.push(makeConstraint('string', column.id))
            if (column.length === 0) {
                column.length = 222
                if (column.type === 'text') {
                    column.length = 11222
                }
            }
            ColumnConstraintzz.push(makeConstraint('min', column.id, '3'))
            ColumnConstraintzz.push(makeConstraint('max', column.id, column.length.toString()))
        }
    }

    /**
     *
     * @param {string} name
     * @param {number} columnId
     * @param {string} parameter
     * @returns {LB.ColumnConstraint}
     */
    function makeConstraint(name, columnId, parameter = '') {
        return {
            columnId,
            name,
            parameter
        }
    }
}
