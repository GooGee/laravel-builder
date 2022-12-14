function run(data) {
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
            if (["''", '""'].includes(column.default)) {
                optionzz.push(`"default" => ""`)
            } else {
                optionzz.push(`"default" => "${column.default}"`)
            }
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

    /** @type {Map<number, LB.Schema>} */
    const schemamap = new Map()
    ddd.db.tables.Schema.forEach(item => schemamap.set(item.id, item))

    /** @type {Map<number, LB.Column>} */
    const columnmap = new Map()
    ddd.db.tables.Column.forEach(item => columnmap.set(item.id, item))

    const fkset = new Set()
    ddd.relationzz = ddd.db.tables.Relation
        .filter((item) => item.schema0Id === ddd.schema.id || item.schema1Id === ddd.schema.id)
        .map((item) => {
            fkset.add(item.column1Id)
            const fk = columnmap.get(item.column1Id)
            if (item.type === "OneToOne") {
                return makeOneToOne(item, fk)
            }
            return makeOneToMany(item, fk)
        })

    ddd.columnzz = ddd.db.tables.Column
        .filter((item) => item.schemaId === ddd.schema.id && item.inTable && !fkset.has(item.id)) // exclude foreign key

    const indexzz = ddd.db.tables.Index.filter(item => item.schemaId === ddd.schema.id)
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
        const namezz = [ddd.schema.name].concat(cnzz)
        namezz.push(index.type)
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
        if (relation.schema1Id === ddd.schema.id) {
            const schema1 = schemamap.get(relation.schema0Id)
            textzz.push(`    #[ORM\\OneToOne(targetEntity: ${schema1.name}::class)]`)
            textzz.push(`    #[ORM\\JoinColumn(name: "\`${fk.name}\`", referencedColumnName: "id", nullable: ${nullable})]`)
            textzz.push(`    private \$${relation.name1};`)
        } else {
            const schema1 = schemamap.get(relation.schema1Id)
            textzz.push(`    #[ORM\\OneToOne(mappedBy: '${relation.name1}', targetEntity: ${schema1.name}::class)]`)
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
        if (relation.schema1Id === ddd.schema.id) {
            const schema1 = schemamap.get(relation.schema0Id)
            textzz.push(`    #[ORM\\ManyToOne(targetEntity: ${schema1.name}::class)]`)
            textzz.push(`    #[ORM\\JoinColumn(name: "\`${fk.name}\`", referencedColumnName: "id", nullable: ${nullable})]`)
            textzz.push(`    private \$${relation.name1};`)
        } else {
            const schema1 = schemamap.get(relation.schema1Id)
            textzz.push(`    #[ORM\\OneToMany(mappedBy: '${relation.name1}', targetEntity: ${schema1.name}::class)]`)
            textzz.push(`    private \$${relation.name0};`)
        }
        return textzz.join('\n')
    }

}
