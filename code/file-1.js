function run(data) {
    // Database/Entity

    /** @type {LB.DataForScript} */
    const ddd = data

    /**
     * make ORM parameter
     * @param {LB.Column} column
     * @returns {string}
     */
    function makeParameter(column) {
        const list = [`name: '\`${column.name}\`'`, `, type: '${column.type}'`]
        if (column.length) {
            let name = 'length'
            if (['decimal', 'float'].includes(column.type)) {
                name = 'precision'
            }
            list.push(`, ${name}: ${column.length}`)
            if (column.scale) {
                list.push(", scale: " + column.scale)
            }
        }
        if (column.unique) {
            list.push(", unique: true")
        }
        if (column.nullable) {
            list.push(", nullable: true")
        }

        const optionzz = []
        if (column.comment.length) {
            optionzz.push(`"comment" => "${column.comment}"`)
        }
        if (column.default.length) {
            optionzz.push(`"default" => ${column.default}`)
        }
        if (column.unsigned) {
            optionzz.push('"unsigned" => true')
        }
        if (optionzz.length) {
            list.push(`, options: [${optionzz.join(', ')}]`)
        }
        return list.join("")
    }

    ddd.makeParameter = makeParameter

    /** @type {Map<number, LB.Entity>} */
    const entitymap = new Map()
    ddd.db.tables.Entity.forEach(item => entitymap.set(item.id, item))

    /** @type {Map<number, LB.Column>} */
    const columnmap = new Map()
    ddd.db.tables.Column.forEach(item => columnmap.set(item.id, item))

    const fkset = new Set()
    ddd.relationzz = ddd.db.tables.Relation
        .filter((item) => item.entity0Id === ddd.entity.id || item.entity1Id === ddd.entity.id)
        .map((item) => {
            fkset.add(item.column1Id)
            const fk = columnmap.get(item.column1Id)
            if (item.type === "OneToOne") {
                return makeOneToOne(item, fk)
            }
            return makeOneToMany(item, fk)
        })

    ddd.columnzz = ddd.db.tables.Column
        .filter((item) => item.entityId === ddd.entity.id && item.inTable && !fkset.has(item.id)) // exclude foreign key

    const indexzz = ddd.db.tables.Index.filter(item => item.entityId === ddd.entity.id)
    const indexLinezz = []
    indexzz.forEach(item => {
        const text = makeIndex(item)
        if (text.length) {
            indexLinezz.push(text)
        }
    })
    ddd.index = ''
    if (indexLinezz.length) {
        ddd.index = '\n' + indexLinezz.join('\n')
    }

    /**
     *
     * @param {LB.Index} index
     * @returns {string}
     */
    function makeIndex(index) {
        let type = 'Index'
        if (index.type === 'unique') {
            type = 'UniqueConstraint'
        }
        const cnzz = ddd.db.tables.IndexColumn
            .filter(item => item.indexId === index.id)
            .sort((aa, bb) => aa.sort - bb.sort)
            .map(item => columnmap.get(item.columnId).name)
        if (cnzz.length === 0) {
            return ''
        }
        const namezz = [ddd.entity.name, index.type].concat(cnzz)
        return `#[ORM\\${type}(name: "${namezz.join('_')}", columns: ["${cnzz.join('", "')}"])]`
    }

    /**
     * OneToOne relation
     * @param {LB.Relation} relation
     * @param {LB.Column} fk
     * @returns {string}
     */
    function makeOneToOne(relation, fk) {
        const textzz = []
        const nullable = fk.nullable ? 'true' : 'false'
        // for circular reference (parentId)
        if (relation.entity1Id === ddd.entity.id) {
            const entity1 = entitymap.get(relation.entity0Id)
            textzz.push(`    #[ORM\\OneToOne(targetEntity: ${entity1.name}::class)]`)
            textzz.push(`    #[ORM\\JoinColumn(name: "\`${fk.name}\`", referencedColumnName: "id", nullable: ${nullable})]`)
            textzz.push(`    private \$${relation.name1};`)
        } else {
            const entity1 = entitymap.get(relation.entity1Id)
            textzz.push(`    #[ORM\\OneToOne(mappedBy: '${relation.name1}', targetEntity: ${entity1.name}::class)]`)
            textzz.push(`    private \$${relation.name0};`)
        }
        return textzz.join('\n')
    }

    /**
     * OneToMany relation
     * @param {LB.Relation} relation
     * @param {LB.Column} fk
     * @returns {string}
     */
    function makeOneToMany(relation, fk) {
        const textzz = []
        const nullable = fk.nullable ? 'true' : 'false'
        // for circular reference (parentId)
        if (relation.entity1Id === ddd.entity.id) {
            const entity1 = entitymap.get(relation.entity0Id)
            textzz.push(`    #[ORM\\ManyToOne(targetEntity: ${entity1.name}::class)]`)
            textzz.push(`    #[ORM\\JoinColumn(name: "\`${fk.name}\`", referencedColumnName: "id", nullable: ${nullable})]`)
            textzz.push(`    private \$${relation.name1};`)
        } else {
            const entity1 = entitymap.get(relation.entity1Id)
            textzz.push(`    #[ORM\\OneToMany(mappedBy: '${relation.name1}', targetEntity: ${entity1.name}::class)]`)
            textzz.push(`    private \$${relation.name0};`)
        }
        return textzz.join('\n')
    }

}
