function run(data) {
    /** @type {LB.DataForScript} */
    const ddd = data

    /**
     * this code is used for generating column validation constraint
     */

    const fkzz = new Set(ddd.db.tables.Relation.map(item => item.column1Id))

    const ignorezz = new Set(['id', 'userId', 'dtCreate', 'dtUpdate', 'dtDelete'])

    ddd.result = ddd.db.tables.Column
        .filter(item => item.schemaId === ddd.schema.id && !(item.ro || ignorezz.has(item.name)))
        .map(item => setConstraint(item))

    /**
     *
     * @param {LB.Column} item
     * @returns {LB.Column}
     */
    function setConstraint(item) {
        const column = {...item}
        if (column.constraintzz.length) {
            return column
        }

        column.constraintzz.push(makeConstraint('required'))
        if (['smallint', 'integer', 'bigint'].includes(column.type)) {
            column.constraintzz.push(makeConstraint('integer'))
            if (fkzz.has(column.id)) {
                column.constraintzz.push(makeConstraint('min', '1'))
            }
            return column
        }

        if (['decimal', 'float'].includes(column.type)) {
            column.constraintzz.push(makeConstraint('numeric'))
            return column
        }

        if (['string', 'text'].includes(column.type)) {
            column.constraintzz.push(makeConstraint('string'))
            if (column.length) {
                column.constraintzz.push(makeConstraint('max', column.length.toString()))
            }
        }

        return column
    }

    /**
     *
     * @param {string} name
     * @param {string} parameter
     * @returns {LB.ColumnConstraint}
     */
    function makeConstraint(name, parameter = '') {
        return {
            name,
            parameter
        }
    }
}
