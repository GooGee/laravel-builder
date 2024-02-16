function makeFaker(data) {
    /** @type {LB.DataForScript} */
    const ddd = data

    /**
     * this code is used for generating model column faker method
     */

    /** @type {Map<string, LB.CollectionItem>} */
    const fakeForColumnNameMap = new Map()
    ddd.helper.getItemzzInCollection('FakeForColumnName').forEach(item => fakeForColumnNameMap.set(item.name, item))

    /** @type {Map<string, LB.DoctrineColumnType>} */
    const fakeForColumnTypeMap = new Map()
    ddd.db.tables.DoctrineColumnType.forEach(item => fakeForColumnTypeMap.set(item.name, item))

    const entityMap = new Map()
    ddd.db.tables.Entity.forEach(item => entityMap.set(item.id, item))

    /** @type {Map<number, string>} */
    const relationMap = new Map()
    ddd.db.tables.Relation.forEach(item => {
        if (item.entity1Id === ddd.entity.id) {
            relationMap.set(item.column1Id, entityMap.get(item.entity0Id).name)
        }
    })

    ddd.result = ddd.db.tables.Column.filter(item => item.entityId === ddd.entity.id && item.inTable).map(item => setFaker(item))

    /**
     *
     * @param {LB.Column} item
     * @returns {LB.Column}
     */
    function setFaker(item) {
        const column = {...item}
        if (column.name === 'Id') {
            return column
        }
        if (column.fakeText) {
            return column
        }
        if (column.fakeRaw === false && column.fakeMethod) {
            return column
        }
        if (column.nullable) {
            column.fakeText = 'null'
            return column
        }
        if (column.default) {
            column.fakeText = column.default
            return column
        }

        const entity = relationMap.get(column.id)
        if (entity) {
            column.fakeRaw = true
            column.fakeMethod = ''
            column.fakeText = entity + 'Factory::new()'
            return column
        }

        const found = fakeForColumnNameMap.get(column.name)
        if (found) {
            column.fakeRaw = found.tag.length === 0
            column.fakeMethod = found.tag
            column.fakeText = found.value
        } else {
            const found = fakeForColumnTypeMap.get(column.type)
            if (found) {
                column.fakeRaw = found.fakeMethod.length === 0
                column.fakeMethod = found.fakeMethod
                column.fakeText = found.fakeText
            }
        }

        return column
    }
}
