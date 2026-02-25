function run(data) {
    // app/ModelBase

    /** @type {LB.DataForScript} */
    const ddd = data

    const nameset = new Set(['Id', 'CreatedAt', 'UpdatedAt',]);

    const columnzz = ddd.db.tables.Column.filter((item) => item.entityId === ddd.entity.id && item.inTable)
    ddd.columnzz = columnzz

    ddd.setableColumnzz = columnzz.filter((item) => nameset.has(item.name) === false)

    /** @type {Map<string, string>} */
    const castMap = new Map()
    columnzz.forEach(function (item) {
        if (item.cast) {
            let text = `'${item.cast}'`
            if (item.cast.includes('::')) {
                text = item.cast
            }
            castMap.set(item.name, text)
            return
        }

        if (item.type.includes('date')) {
            castMap.set(item.name, "'datetime'")
        }
    })
    ddd.castzz = Array.from(castMap)

    /** @type {Map<number, LB.Entity>} */
    const entitymap = new Map()
    ddd.db.tables.Entity.forEach(item => entitymap.set(item.id, item))

    /** @type {Map<number, LB.Column>} */
    const columnmap = new Map()
    ddd.db.tables.Column.forEach(item => columnmap.set(item.id, item))

    const przz = []
    const relationzz = ddd.db.tables.Relation
        .filter((item) => item.entity0Id === ddd.entity.id || item.entity1Id === ddd.entity.id)
        .sort((aa, bb) => aa.name1.localeCompare(bb.name1))
    ddd.relationzz = relationzz.filter(item => item.entity1Id === ddd.entity.id || item.type === "OneToOne" || item.addToModel)

    const textzz = relationzz.map((item) => {
        const fk = columnmap.get(item.column1Id)
        if (item.entity1Id === ddd.entity.id) {
            return makeBelongsTo(item, fk)
        }
        if (item.type === "OneToOne") {
            return makeHasMany(item, fk, 'hasOne')
        }
        if (item.addToModel) {
            return makeHasMany(item, fk)
        }
        return ''
    })

    const pivotzz = relationzz.filter(item => item.type === 'OneToMany' && item.entity1Id !== ddd.entity.id)
    const siSet = new Set(pivotzz.map(item => item.entity1Id))
    // belongsToMany relation
    const m2mzz = ddd.db.tables.Relation
        .filter((item) => siSet.has(item.entity1Id) && item.entity0Id !== ddd.entity.id)
        .map(item => {
            const pivot = entitymap.get(item.entity1Id)
            const fk1 = columnmap.get(item.column1Id)
            const entity2 = entitymap.get(item.entity0Id)
            const relation = pivotzz.find(one => one.entity1Id === item.entity1Id)
            const fk0 = columnmap.get(relation.column1Id)
            // przz.push(`${entity2.name}[] \$${item.name1}zz`)
            return `
    /** @phpstan-ignore-next-line */
    public function ${item.name1}zz(): BelongsToMany
    {
        return $this->belongsToMany(${entity2.name}::class, '${pivot.name}', '${fk0.name}', '${fk1.name}');
    }`
        })
    // ddd.textzz = textzz.concat(m2mzz)
    ddd.textzz = textzz
    ddd.przz = przz

    /**
     * hasMany relation
     * @param {LB.Relation} relation
     * @param {LB.Column} fk
     * @param {string} method
     * @returns {string}
     */
    function makeHasMany(relation, fk, method = 'hasMany') {
        const entity1 = entitymap.get(relation.entity1Id)
        let type = entity1.name
        if (method === 'hasMany') {
            type = `\\Illuminate\\Database\\Eloquent\\Collection<${type}>`
        }
        przz.push(type + ' $' + relation.name0)
        return `
    /** @phpstan-ignore-next-line */
    public function ${relation.name0}(): HasMany
    {
        return $this->${method}(${entity1.name}::class, '${fk.name}', 'Id');
    }`
    }

    /**
     * belongsTo relation
     * @param {LB.Relation} relation
     * @param {LB.Column} fk
     * @returns {string}
     */
    function makeBelongsTo(relation, fk) {
        const entity1 = entitymap.get(relation.entity0Id)
        let type = entity1.name
        if (fk.nullable) {
            type += '|null'
        }
        przz.push(type + ' $' + relation.name1)
        return `
    /** @phpstan-ignore-next-line */
    public function ${relation.name1}(): BelongsTo
    {
        return $this->belongsTo(${entity1.name}::class, '${fk.name}', 'Id');
    }`
    }

}
