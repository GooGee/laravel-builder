function run(data) {
    /** @type {LB.DataForScript} */
    const ddd = data

    const columnzz = ddd.db.tables.Column.filter((item) => item.schemaId === ddd.schema.id && item.inTable)
    ddd.columnzz = columnzz

    ddd.keyzz = columnzz.filter(item => !item.wo)

    const typezz = ddd.helper.getItemzzInCollection('DoctrineColumnType')
    const castzz = ddd.helper.getItemzzInCollection('ModelFieldTypeCast')

    ddd.propertyzz = columnzz.map(item => {
        let type = getFieldType(item)
        if (item.nullable) {
            type += '|null'
        }
        return type + ' $' + item.name
    })

    /**
     * get PHP type of field
     * @param {LB.Column} column
     * @returns {string}
     */
    function getFieldType(column) {
        if (column.type === 'datetime') {
            return '\\Illuminate\\Support\\Carbon'
        }

        if (column.cast) {
            const found = castzz.find(item => item.name === column.cast)
            if (found) {
                return found.value
            }
        }

        const found = typezz.find(item => item.name === column.type)
        if (found) {
            return found.tag
        }

        return 'mixed'
    }

    /** @type {Map<number, LB.Schema>} */
    const schemamap = new Map()
    ddd.db.tables.Schema.forEach(item => schemamap.set(item.id, item))

    /** @type {Map<number, LB.Column>} */
    const columnmap = new Map()
    ddd.db.tables.Column.forEach(item => columnmap.set(item.id, item))

    const przz = []
    const relationzz = ddd.db.tables.Relation
        .filter((item) => item.schema0Id === ddd.schema.id || item.schema1Id === ddd.schema.id)

    const textzz = relationzz.map((item) => {
        const fk = columnmap.get(item.column1Id)
        if (item.schema1Id === ddd.schema.id) {
            return makeBelongsTo(item, fk)
        }
        if (item.type === "OneToOne") {
            return makeHasMany(item, fk, 'hasOne')
        }
        return makeHasMany(item, fk)
    })

    const pivotzz = relationzz.filter(item => item.type === 'OneToMany' && item.schema1Id !== ddd.schema.id)
    const siSet = new Set(pivotzz.map(item => item.schema1Id))
    // belongsToMany relation
    const m2mzz = ddd.db.tables.Relation.filter((item) => siSet.has(item.schema1Id) && item.schema0Id !== ddd.schema.id)
        .map(item => {
            const pivot = schemamap.get(item.schema1Id)
            const fk1 = columnmap.get(item.column1Id)
            const schema2 = schemamap.get(item.schema0Id)
            const relation = pivotzz.find(one => one.schema1Id === item.schema1Id)
            const fk0 = columnmap.get(relation.column1Id)
            przz.push(`${schema2.name}[] ${item.name1}zz`)
            return `
    public function ${item.name1}zz()
    {
        return $this->belongsToMany(${schema2.name}::class, '${pivot.name}', '${fk0.name}', '${fk1.name}');
    }`
        })
    ddd.relationzz = textzz.concat(m2mzz)
    ddd.przz = przz

    /**
     * hasMany relation
     * @param {LB.Relation} relation
     * @param {LB.Column} fk
     * @param {string} method
     * @returns {string}
     */
    function makeHasMany(relation, fk, method = 'hasMany') {
        const schema1 = schemamap.get(relation.schema1Id)
        let type = schema1.name
        if (method === 'hasMany') {
            type += '[]'
        }
        przz.push(`${type} ${relation.name0}`)
        return `
    public function ${relation.name0}()
    {
        return $this->${method}(${schema1.name}::class, '${fk.name}');
    }`
    }

    /**
     * belongsTo relation
     * @param {LB.Relation} relation
     * @param {LB.Column} fk
     * @returns {string}
     */
    function makeBelongsTo(relation, fk) {
        const schema1 = schemamap.get(relation.schema0Id)
        przz.push(`${schema1.name} ${relation.name1}`)
        return `
    public function ${relation.name1}()
    {
        return $this->belongsTo(${schema1.name}::class, '${fk.name}');
    }`
    }

}
