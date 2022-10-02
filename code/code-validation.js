function run(data) {
    /** @type {DataForScript} */
    const ddd = data

    /**
     * this code is used for generating column validation constraint
     */

    const excludezz = new Set(['id', 'userId', 'dateCreate', 'dateUpdate', 'dateDelete'])
    ddd.result = ddd.db.tables.Column
        .filter(item => item.schemaId === ddd.schema.id && !(item.ro || excludezz.has(item.name)))
        .map(item => setConstraint(item))

    /**
     *
     * @param {Column} item
     * @returns {Column}
     */
    function setConstraint(item) {
        const column = {...item}
        if (column.constraintzz.length) {
            return column
        }

        if (['smallint', 'integer', 'bigint'].includes(column.type)) {
            column.constraintzz.push(makeConstraint('integer'))
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
     * @returns {ColumnConstraint}
     */
    function makeConstraint(name, parameter = '') {
        return {
            name,
            parameter
        }
    }
}
