function run(data) {
    /** @type {LB.DataForScript} */
    const ddd = data

    /**
     * this code is used for generating column validation constraint
     */

    const fkzz = new Set(ddd.db.tables.Relation.map(item => item.column1Id))
    const ignorezz = new Set(['id', 'userId'])

    const ColumnConstraintzz = []
    ddd.result = ColumnConstraintzz

    const indexzz = ddd.db.tables.Index.filter(item => item.entityId === ddd.entity.id && item.type === 'unique')
    if (indexzz.length) {
        indexzz.forEach(item => {
            const iczz = ddd.db.tables.IndexColumn.filter(ic => ic.indexId === item.id)
            if (iczz.length === 1) {
                ColumnConstraintzz.push(makeConstraint('unique', iczz[0].columnId, ddd.entity.name))
            }
        })
    }

    ddd.db.tables.Column
        .filter(item => item.entityId === ddd.entity.id && !(item.ro || ignorezz.has(item.name)))
        .forEach(item => setConstraint(item))

    /**
     *
     * @param {LB.Column} column
     */
    function setConstraint(column) {
        if (ddd.db.tables.ColumnConstraint.find(item => item.columnId === column.id)) {
            return
        }

        if (column.nullable) {
            ColumnConstraintzz.push(makeConstraint('nullable', column.id))
        }

        ColumnConstraintzz.push(makeConstraint('required', column.id))
        if (['smallint', 'integer', 'bigint'].includes(column.type)) {
            ColumnConstraintzz.push(makeConstraint('integer', column.id))
            if (fkzz.has(column.id)) {
                ColumnConstraintzz.push(makeConstraint('min', column.id, '1'))
            }
            return
        }

        if (['decimal', 'float'].includes(column.type)) {
            ColumnConstraintzz.push(makeConstraint('numeric', column.id))
            return
        }

        if (['string', 'text'].includes(column.type)) {
            ColumnConstraintzz.push(makeConstraint('string', column.id))
            if (column.length) {
                ColumnConstraintzz.push(makeConstraint('max', column.id, column.length.toString()))
            }
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
